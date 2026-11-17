import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import baseURL from "../../utils/baseUrl";
import buildAddMarkExcelFromLiveMarkEntry, { markInputKey } from "../../utils/buildAddMarkExcelFromLiveMarkEntry";
import buildCoScholasticExcelFromLiveMarkEntry from "../../utils/buildCoScholasticExcelFromLiveMarkEntry";
import "../../assets/css/mastercom.css";
import "../../assets/css/examination.css";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const studentDisplayName = (student) =>
  [student?.first_name, student?.last_name, student?.father_name]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" ");

const groupAssessments = (assessments) => {
  const groups = [];
  (assessments || []).forEach((assessment) => {
    let group = groups.find((g) => g.id === assessment.group_id);
    if (!group) {
      group = { id: assessment.group_id, name: assessment?.groupInfo?.group, assessments: [] };
      groups.push(group);
    }
    group.assessments.push(assessment);
  });
  return groups;
};

const markColCount = (assessment) => assessment.components?.length || 1;
// Same as Excel: mark columns + Total + Total Converted
const assessmentColCount = (assessment) => markColCount(assessment) + 2;
const groupColCount = (group) => group.assessments.reduce((sum, a) => sum + assessmentColCount(a), 0);
const groupMax = (group) => group.assessments.reduce((sum, a) => sum + Number(a.max_marks || 0), 0);
const subHeadTotalMax = (assessment) =>
  assessment.components?.length
    ? assessment.components.reduce((sum, c) => sum + Number(c.max_marks || 0), 0)
    : Number(assessment.max_marks || 0);
const ratioOf = (assessment) => {
  const ratio = Number(assessment.ratio);
  return assessment.ratio != null && Number.isFinite(ratio) ? ratio : 1;
};

const formatCalc = (value, hasAnyMark) => {
  if (!hasAnyMark) {
    return <span className="am-calc-value is-empty">—</span>;
  }
  const rounded = Math.round(Number(value) * 100) / 100;
  const display = Number.isFinite(rounded) ? rounded : "—";
  return <span className="am-calc-value">{display}</span>;
};

const AddMarks = () => {
  const { markentryid } = useParams();
  const resultMarkEntry = useSelector((state) => state.resultMarkEntry.marksentryvalue);

  const [scheme, setScheme] = useState(null);
  const [configure, setConfigure] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [students, setStudents] = useState([]);
  const [marksByStudent, setMarksByStudent] = useState({});
  const [gradesByStudent, setGradesByStudent] = useState({});
  const [gradeOptions, setGradeOptions] = useState([]);
  const [isDescriptor, setIsDescriptor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const groups = useMemo(() => groupAssessments(assessments), [assessments]);
  const grandMax = useMemo(() => groups.reduce((sum, g) => sum + groupMax(g), 0), [groups]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!resultMarkEntry?.exam_scheme_id || !resultMarkEntry?.subject_id) {
        setErrorMsg("Marks entry details are missing. Open Add Marks again from Marks Entry.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      try {
        const { data: configureRes } = await axios.get(`${baseURL}/api/exam-configures/search`, {
          params: {
            exam_scheme_id: resultMarkEntry.exam_scheme_id,
            class_id: resultMarkEntry?.scheme?.class_id ?? resultMarkEntry?.scheme?.classInfo?.id,
            term_id: resultMarkEntry?.scheme?.term_id ?? resultMarkEntry?.scheme?.termInfo?.id,
            subject_id: resultMarkEntry.subject_id,
          },
          headers: authHeaders(),
        });

        const configureData = configureRes?.data;
        if (!configureRes?.success || !configureData) {
          throw new Error(
            configureRes?.message || "Exam configure not found for this exam scheme, class, term and subject"
          );
        }

        const descriptor = String(configureData?.gradeScale?.type || "").toLowerCase() === "descriptor";
        if (cancelled) return;
        setIsDescriptor(descriptor);
        setConfigure(configureData);

        const entryId = markentryid || resultMarkEntry.id;

        if (descriptor) {
          const gradeScaleId = configureData?.gradeScale?.id ?? configureData?.grade_scale_id;
          if (!gradeScaleId) {
            throw new Error("Grade scale id is required for co-scholastic marks entry");
          }

          const [studentsRes, gradeScaleRes] = await Promise.all([
            axios.get(`${baseURL}/api/result-mark-entry-lists/${entryId}/co-scholastic-students`, {
              headers: authHeaders(),
            }),
            axios.get(`${baseURL}/api/grade-scales/${gradeScaleId}`, {
              headers: authHeaders(),
            }),
          ]);

          if (cancelled) return;

          const loadedStudents = Array.isArray(studentsRes?.data?.data) ? studentsRes.data.data : [];
          // axios response body is { success, data: { ranges: [...] } }
          const gradeScalePayload = gradeScaleRes?.data?.data ?? gradeScaleRes?.data;
          const options = (Array.isArray(gradeScalePayload?.ranges) ? gradeScalePayload.ranges : [])
            .slice()
            .sort((a, b) => Number(a.sequence ?? 0) - Number(b.sequence ?? 0))
            .map((range) => String(range?.grade ?? "").trim())
            .filter(Boolean);

          const initialGrades = {};
          loadedStudents.forEach((student) => {
            initialGrades[student.id] = String(student?.grade ?? "").trim();
          });

          setScheme(resultMarkEntry?.scheme || null);
          setStudents(loadedStudents);
          setGradeOptions(options);
          setGradesByStudent(initialGrades);
          setAssessments([]);
          setMarksByStudent({});
          return;
        }

        const [assessmentRes, studentsRes] = await Promise.all([
          axios.get(`${baseURL}/api/exam-schemes/${resultMarkEntry.exam_scheme_id}/assessment-and-components`, {
            params: { subject_id: resultMarkEntry.subject_id },
            headers: authHeaders(),
          }),
          axios.get(`${baseURL}/api/result-mark-entry-lists/${entryId}/students`, {
            headers: authHeaders(),
          }),
        ]);

        if (cancelled) return;

        const loadedStudents = Array.isArray(studentsRes?.data?.data) ? studentsRes.data.data : [];
        const initialMarks = {};
        loadedStudents.forEach((student) => {
          initialMarks[student.id] = {};
        });

        setScheme(assessmentRes?.data?.data?.scheme || null);
        setAssessments(assessmentRes?.data?.data?.assessments || []);
        setStudents(loadedStudents);
        setMarksByStudent(initialMarks);
        setGradeOptions([]);
        setGradesByStudent({});
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.response?.data?.message || err.message || "Failed to load add marks data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [resultMarkEntry, markentryid]);

  const setMarkValue = (studentId, key, value) => {
    setMarksByStudent((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [key]: value,
      },
    }));
    setSuccessMsg("");
  };

  const setGradeValue = (studentId, value) => {
    setGradesByStudent((prev) => ({
      ...prev,
      [studentId]: value,
    }));
    setSuccessMsg("");
  };

  const parseMark = (raw) => {
    if (raw === "" || raw == null) return null;
    const num = Number(raw);
    return Number.isFinite(num) ? num : null;
  };

  /** Same math as Excel formulas: Total, Total Converted, group total, grand total. */
  const calcStudentRow = (studentId) => {
    const studentMarks = marksByStudent[studentId] || {};
    const heads = {};
    let grandTotal = 0;
    let hasAnyConverted = false;

    const groupTotals = groups.map((group) => {
      let groupConvertedSum = 0;
      let groupHasConverted = false;

      group.assessments.forEach((assessment) => {
        const keys = assessment.components?.length
          ? assessment.components.map((c) => markInputKey(assessment.id, c.id))
          : [markInputKey(assessment.id)];
        const values = keys.map((key) => parseMark(studentMarks[key]));
        const hasAnyMark = values.some((v) => v != null);
        const total = hasAnyMark ? values.reduce((sum, v) => sum + (v ?? 0), 0) : null;
        const ratio = ratioOf(assessment);
        const totalConverted = hasAnyMark ? Math.round(total * ratio * 100) / 100 : null;

        heads[assessment.id] = { total, totalConverted, hasAnyMark };
        if (totalConverted != null) {
          groupConvertedSum += totalConverted;
          groupHasConverted = true;
          hasAnyConverted = true;
        }
      });

      const groupTotal = groupHasConverted ? Math.round(groupConvertedSum * 100) / 100 : null;
      if (groupTotal != null) grandTotal += groupTotal;
      return { groupId: group.id, total: groupTotal, hasAny: groupHasConverted };
    });

    return {
      heads,
      groupTotals,
      grandTotal: hasAnyConverted ? Math.round(grandTotal * 100) / 100 : null,
      hasAnyConverted,
    };
  };

  const handleSaveMarks = async () => {
    if (!resultMarkEntry || saving) return;
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      let blob;
      let fileName;
      let importUrl;

      if (isDescriptor) {
        ({ blob, fileName } = await buildCoScholasticExcelFromLiveMarkEntry(
          resultMarkEntry,
          students,
          configure,
          gradesByStudent,
          gradeOptions
        ));
        importUrl = `${baseURL}/api/student-co-scholastic-marks/import-co-scholastic-marks`;
      } else {
        ({ blob, fileName } = await buildAddMarkExcelFromLiveMarkEntry(
          resultMarkEntry,
          students,
          marksByStudent
        ));
        importUrl = `${baseURL}/api/result-mark-entry-lists/import-marks`;
      }

      const formData = new FormData();
      formData.append("file", blob, fileName || (isDescriptor ? "CoScholastic.xlsx" : "Marks_Entry.xlsx"));

      const { data } = await axios.post(importUrl, formData, {
        headers: authHeaders(),
      });
      setSuccessMsg(
        data?.message ||
          (isDescriptor ? "Co-scholastic grades saved successfully." : "Marks saved successfully.")
      );
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to save marks");
    } finally {
      setSaving(false);
    }
  };

  const metaChips = [
    ["solar:document-text-bold-duotone", scheme?.examNameInfo?.exam_name || configure?.exam?.examNameInfo?.exam_name || resultMarkEntry?.scheme?.examNameInfo?.exam_name],
    ["solar:square-academic-cap-bold-duotone", scheme?.classInfo?.class_name || configure?.classInfo?.class_name || resultMarkEntry?.scheme?.classInfo?.class_name],
    ["solar:calendar-bold-duotone", scheme?.termInfo?.term_name || configure?.termInfo?.term_name || resultMarkEntry?.scheme?.termInfo?.term_name],
    ["solar:users-group-rounded-bold-duotone", resultMarkEntry?.divisionInfo?.division_name],
    ["solar:book-bookmark-bold-duotone", configure?.subjectInfo?.value || resultMarkEntry?.subjectInfo?.value],
  ].filter(([, value]) => value);

  const filledCount = isDescriptor
    ? students.filter((s) => String(gradesByStudent[s.id] || "").trim()).length
    : students.filter((s) => Object.values(marksByStudent[s.id] || {}).some((v) => v !== "" && v != null)).length;

  if (loading) {
    return (
      <div className="container-fluid exam-page am-page py-4">
        <div className="am-shell am-loading">
          <Icon icon="line-md:loading-loop" width={28} />
          <div>
            <div className="am-loading-title">Preparing mark entry</div>
            <div className="am-loading-sub">Fetching students and assessment layout…</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container-fluid exam-page am-page py-3 ${isDescriptor ? "am-page-descriptor" : "am-page-marks"}`}>
      <div className="am-shell">
        <div className="am-header">
          <div className="am-header-main">
            <span className={`am-header-icon ${isDescriptor ? "am-header-icon-green" : ""}`}>
              <Icon
                icon={isDescriptor ? "solar:medal-ribbons-star-bold-duotone" : "solar:clipboard-list-bold-duotone"}
                width={18}
              />
            </span>
            <div className="am-header-text">
              <h5 className="am-title">{isDescriptor ? "Add Co-scholastic Grades" : "Add Marks"}</h5>
              <p className="am-subtitle">
                {isDescriptor
                  ? "Select a grade for each student, then save to update co-scholastic marks"
                  : "Enter marks in the table. Totals update automatically, then save to import"}
              </p>
            </div>
          </div>

          <div className="am-header-actions">
            <div className="am-stat">
              <span className="am-stat-value">{students.length}</span>
              <span className="am-stat-label">Students</span>
            </div>
            <div className="am-stat">
              <span className="am-stat-value">{filledCount}</span>
              <span className="am-stat-label">{isDescriptor ? "Graded" : "Filled"}</span>
            </div>
            <button
              type="button"
              className={`am-save-btn ${isDescriptor ? "am-save-btn-green" : ""}`}
              onClick={handleSaveMarks}
              disabled={saving || !students.length}
            >
              <Icon icon={saving ? "line-md:loading-loop" : "solar:diskette-bold-duotone"} width={18} />
              {saving ? "Saving…" : isDescriptor ? "Save Grades" : "Save Marks"}
            </button>
          </div>
        </div>

        {metaChips.length > 0 && (
          <div className="am-chips">
            {metaChips.map(([icon, value]) => (
              <span key={`${icon}-${value}`} className="am-chip">
                <Icon icon={icon} width={14} />
                {value}
              </span>
            ))}
            {isDescriptor && gradeOptions.length > 0 ? (
              <span className="am-chip am-chip-grades">
                <Icon icon="solar:ranking-bold-duotone" width={14} />
                Grades: {gradeOptions.join(", ")}
              </span>
            ) : null}
          </div>
        )}

        {errorMsg ? (
          <div className="am-alert am-alert-danger" role="alert">
            <Icon icon="solar:danger-triangle-bold-duotone" width={20} />
            <span>{errorMsg}</span>
          </div>
        ) : null}
        {successMsg ? (
          <div className="am-alert am-alert-success" role="alert">
            <Icon icon="solar:check-circle-bold-duotone" width={20} />
            <span>{successMsg}</span>
          </div>
        ) : null}

        <div className="am-table-card">
          <div className="am-table-wrap">
            {isDescriptor ? (
              <table className="am-table am-table-grades">
                <thead>
                  <tr>
                    <th className="am-col-sr">Sr No</th>
                    <th className="am-col-reg">Registration No</th>
                    <th className="am-col-roll">Roll No</th>
                    <th className="am-col-seat">Seat No</th>
                    <th className="am-col-name">Name</th>
                    <th className="am-grade-head">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="am-empty">
                          <Icon icon="solar:users-group-rounded-bold-duotone" width={32} />
                          <div>No students found for this co-scholastic entry.</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    students.map((student, index) => {
                      const grade = gradesByStudent[student.id] ?? "";
                      return (
                        <tr key={student.id} className={grade ? "am-row-filled" : ""}>
                          <td className="am-col-sr">{index + 1}</td>
                          <td className="am-col-reg">{student.reg_no ?? ""}</td>
                          <td className="am-col-roll">{student.rollnumber ?? "—"}</td>
                          <td className="am-col-seat">{student.seat_no ?? "—"}</td>
                          <td className="am-col-name">
                            <span className="am-student-name">{studentDisplayName(student)}</span>
                          </td>
                          <td className="am-grade-cell">
                            <select
                              className={`am-grade-select ${grade ? "is-selected" : ""}`}
                              value={grade}
                              onChange={(e) => setGradeValue(student.id, e.target.value)}
                            >
                              <option value="">Select grade</option>
                              {gradeOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            ) : (
              <table className="am-table am-table-marks">
                <thead>
                  <tr>
                    <th rowSpan={3} className="am-col-sr">Sr No</th>
                    <th rowSpan={3} className="am-col-reg">Registration No</th>
                    <th rowSpan={3} className="am-col-roll">Roll No</th>
                    <th rowSpan={3} className="am-col-seat">Seat No</th>
                    <th rowSpan={3} className="am-col-name">Name</th>
                    {groups.map((group) => (
                      <React.Fragment key={group.id}>
                        <th colSpan={groupColCount(group)} className="am-group-head">
                          {group.name} Marks
                        </th>
                        <th rowSpan={3} className="am-calc-head am-group-total-head">
                          {group.name} Total ({groupMax(group)})
                        </th>
                      </React.Fragment>
                    ))}
                    <th rowSpan={3} className="am-calc-head am-grand-head">
                      Grand Total ({grandMax})
                    </th>
                  </tr>
                  <tr>
                    {groups.flatMap((group) =>
                      group.assessments.map((assessment) => (
                        <th key={assessment.id} colSpan={assessmentColCount(assessment)} className="am-assessment-head">
                          {assessment?.componentInfo?.component_name} ({Number(assessment.max_marks)})
                        </th>
                      ))
                    )}
                  </tr>
                  <tr>
                    {groups.flatMap((group) =>
                      group.assessments.flatMap((assessment) => {
                        const markHeaders = assessment.components?.length
                          ? assessment.components.map((component) => (
                              <th key={component.id} className="am-mark-head">
                                {component?.componentInfo?.component_name} ({Number(component.max_marks)})
                              </th>
                            ))
                          : [
                              <th key={`marks-${assessment.id}`} className="am-mark-head">
                                Marks ({Number(assessment.max_marks)})
                              </th>,
                            ];
                        return [
                          ...markHeaders,
                          <th key={`total-${assessment.id}`} className="am-calc-head">
                            Total ({subHeadTotalMax(assessment)})
                          </th>,
                          <th key={`converted-${assessment.id}`} className="am-calc-head">
                            Converted ({Number(assessment.max_marks)})
                          </th>,
                        ];
                      })
                    )}
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5 + groups.reduce((sum, g) => sum + groupColCount(g) + 1, 0) + 1}>
                        <div className="am-empty">
                          <Icon icon="solar:users-group-rounded-bold-duotone" width={32} />
                          <div>No students found for this marks entry.</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    students.map((student, index) => {
                      const studentMarks = marksByStudent[student.id] || {};
                      const calc = calcStudentRow(student.id);
                      const rowFilled = Object.values(studentMarks).some((v) => v !== "" && v != null);
                      return (
                        <tr key={student.id} className={rowFilled ? "am-row-filled" : ""}>
                          <td className="am-col-sr">{index + 1}</td>
                          <td className="am-col-reg">{student.reg_no ?? ""}</td>
                          <td className="am-col-roll">{student.rollnumber ?? "—"}</td>
                          <td className="am-col-seat">{student.seat_no ?? "—"}</td>
                          <td className="am-col-name">
                            <span className="am-student-name">{studentDisplayName(student)}</span>
                          </td>
                          {groups.flatMap((group) => {
                            const groupCells = group.assessments.flatMap((assessment) => {
                              const headCalc = calc.heads[assessment.id] || {};
                              const markInputs = assessment.components?.length
                                ? assessment.components.map((component) => {
                                    const key = markInputKey(assessment.id, component.id);
                                    return (
                                      <td key={`${student.id}-${key}`} className="am-mark-cell">
                                        <input
                                          type="number"
                                          className="am-mark-input"
                                          min={0}
                                          max={Number(component.max_marks)}
                                          step="any"
                                          value={studentMarks[key] ?? ""}
                                          onChange={(e) => setMarkValue(student.id, key, e.target.value)}
                                        />
                                      </td>
                                    );
                                  })
                                : [
                                    (() => {
                                      const key = markInputKey(assessment.id);
                                      return (
                                        <td key={`${student.id}-${key}`} className="am-mark-cell">
                                          <input
                                            type="number"
                                            className="am-mark-input"
                                            min={0}
                                            max={Number(assessment.max_marks)}
                                            step="any"
                                            value={studentMarks[key] ?? ""}
                                            onChange={(e) => setMarkValue(student.id, key, e.target.value)}
                                          />
                                        </td>
                                      );
                                    })(),
                                  ];

                              return [
                                ...markInputs,
                                <td key={`${student.id}-total-${assessment.id}`} className="am-calc-cell">
                                  {formatCalc(headCalc.total, headCalc.hasAnyMark)}
                                </td>,
                                <td key={`${student.id}-converted-${assessment.id}`} className="am-calc-cell">
                                  {formatCalc(headCalc.totalConverted, headCalc.hasAnyMark)}
                                </td>,
                              ];
                            });

                            const groupTotal = calc.groupTotals.find((g) => g.groupId === group.id);
                            return [
                              ...groupCells,
                              <td key={`${student.id}-gt-${group.id}`} className="am-calc-cell am-group-total-cell">
                                {formatCalc(groupTotal?.total, groupTotal?.hasAny)}
                              </td>,
                            ];
                          })}
                          <td className="am-calc-cell am-grand-cell">
                            {formatCalc(calc.grandTotal, calc.hasAnyConverted)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMarks;
