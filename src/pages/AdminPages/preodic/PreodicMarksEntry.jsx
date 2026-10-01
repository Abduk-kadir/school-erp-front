import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/mastercom.css";
import "../../../assets/css/academicOfflineFeeReport.css";

const emptyValues = {
  class: "",
  division: "",
  subject: "",
  preodic_test: "",
};

const ExamPickerPanel = ({
  tests,
  selectedId,
  onSelect,
  loading,
  filtersReady,
}) => {
  if (!filtersReady) {
    return (
      <div className="pme-exam-panel pme-exam-panel--placeholder">
        <Icon icon="solar:document-text-bold-duotone" width="28" />
        <span>Select Exam</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pme-exam-panel pme-exam-panel--placeholder">
        <Icon icon="line-md:loading-loop" width="24" />
        <span>Loading exams...</span>
      </div>
    );
  }

  if (!tests.length) {
    return (
      <div className="pme-exam-panel pme-exam-panel--placeholder">
        <Icon icon="solar:folder-open-bold-duotone" width="28" />
        <span>No exams found</span>
      </div>
    );
  }

  return (
    <div className="pme-exam-list" role="listbox" aria-label="Select Exam">
      {tests.map((test) => {
        const isSelected = String(selectedId) === String(test.id);
        return (
          <button
            key={test.id}
            type="button"
            role="option"
            aria-selected={isSelected}
            className={`pme-exam-row${isSelected ? " is-selected" : ""}`}
            onClick={() => onSelect(String(test.id))}
          >
            <div className="pme-exam-row__details">
              <div className="pme-exam-row__line">
                <span className="pme-exam-row__label">Exam Name:</span>
                <span className="pme-exam-row__value">
                  {test.exam_name || "—"}
                </span>
              </div>
              <div className="pme-exam-row__line">
                <span className="pme-exam-row__label">Date:</span>
                <span className="pme-exam-row__value">{test.date || "—"}</span>
              </div>
              <div className="pme-exam-row__line">
                <span className="pme-exam-row__label">Topic:</span>
                <span className="pme-exam-row__value">{test.topics || "—"}</span>
              </div>
            </div>
            {isSelected && (
              <span className="pme-exam-row__check">
                <Icon icon="solar:check-circle-bold" width="18" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

const validationSchema = Yup.object({
  class: Yup.string().required("Class is required"),
  division: Yup.string().required("Division is required"),
  subject: Yup.string().required("Subject is required"),
});

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const parseProgramSubjects = (payload) => {
  const list = Array.isArray(payload?.data) ? payload.data : [];
  const subjectMap = new Map();
  list.forEach((item) => {
    const subject = item?.subject;
    if (subject?.id && !subjectMap.has(subject.id)) {
      subjectMap.set(subject.id, subject);
    }
  });
  return Array.from(subjectMap.values());
};

const formatStudentName = (student) =>
  [student.first_name, student.last_name].filter(Boolean).join(" ").trim() ||
  "—";

const formatRollNumber = (student) => {
  const roll = student.rollnumber;
  return roll !== "" && roll != null ? roll : "—";
};

const mergeStudentsWithMarkEntries = (students, entries) => {
  const map = new Map();
  students.forEach((student) => {
    map.set(String(student.reg_no), student);
  });
  entries.forEach((entry) => {
    const key = String(entry.reg_no);
    if (!map.has(key)) {
      map.set(key, {
        id: `reg-${key}`,
        reg_no: entry.reg_no,
        rollnumber: entry.rollnumber,
        first_name: entry.first_name,
        last_name: entry.last_name,
      });
    }
  });
  return Array.from(map.values());
};

const PreodicMarksEntry = () => {
  const [classes, setClasses] = useState([]);
  const [classDivMap, setClassDivMap] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [preodicTests, setPreodicTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsFetched, setStudentsFetched] = useState(false);
  const [marksByRegNo, setMarksByRegNo] = useState({});
  const [markEntryIdsByRegNo, setMarkEntryIdsByRegNo] = useState({});
  const [selectedExamId, setSelectedExamId] = useState("");
  const [savingMarks, setSavingMarks] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchBaseOptions = async () => {
      try {
        const [classRes, mapRes] = await Promise.all([
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/class-div-map-masters`),
        ]);
        setClasses(normalizeList(classRes?.data));
        setClassDivMap(normalizeList(mapRes?.data));
      } catch (error) {
        console.error("Failed to load dropdown options", error);
        setErrorMsg("Failed to load dropdown options. Please try again.");
      }
    };
    fetchBaseOptions();
  }, []);

  const getDivisionsForClass = (classId) => {
    if (!classId) return [];
    const filtered = classDivMap.filter(
      (item) =>
        String(item.classid ?? item.classId ?? item.classInfo?.id) ===
        String(classId)
    );
    const divisionMap = new Map();
    filtered.forEach((item) => {
      const id = item.divisionInfo?.id ?? item.divisionid ?? item.divisionId;
      const name =
        item.divisionInfo?.division_name ??
        item.division_name ??
        item.division?.division_name ??
        "";
      if (id != null && !divisionMap.has(String(id))) {
        divisionMap.set(String(id), { id, division_name: name });
      }
    });
    return Array.from(divisionMap.values());
  };

  const resetStudents = () => {
    setStudents([]);
    setStudentsFetched(false);
    setMarksByRegNo({});
    setMarkEntryIdsByRegNo({});
  };

  const resolveExamId = (values) =>
    selectedExamId || values.preodic_test || "";

  const applyPrepopulatedMarks = (entries) => {
    const marks = {};
    const entryIds = {};
    entries.forEach((entry) => {
      const key = String(entry.reg_no);
      if (entry.mark_obtained != null && entry.mark_obtained !== "") {
        marks[key] = String(entry.mark_obtained);
      }
      if (entry.id != null) {
        entryIds[key] = entry.id;
      }
    });
    setMarksByRegNo(marks);
    setMarkEntryIdsByRegNo(entryIds);
  };

  const fetchMarkEntriesByTest = async (preodictestId) => {
    if (!preodictestId) return [];
    try {
      const res = await axios.get(
        `${baseURL}/api/preodictest-mark-entries/by-test/${preodictestId}`
      );
      return normalizeList(res?.data);
    } catch (error) {
      console.error("Failed to load saved marks for test", error);
      return [];
    }
  };

  const applyMarkEntriesToTable = (entries) => {
    if (!entries.length) {
      setMarksByRegNo({});
      setMarkEntryIdsByRegNo({});
      return;
    }
    applyPrepopulatedMarks(entries);
  };

  const syncStudentTable = async (values) => {
    const { class: classId, division: divisionId, subject: subjectId } =
      values;
    const preodictestId = resolveExamId(values);

    if (!classId || !divisionId || !subjectId) {
      setErrorMsg("Please select class, division, and subject first.");
      return;
    }
    if (!preodictestId) {
      setErrorMsg("Please select an exam, then click Show Student.");
      return;
    }

    setErrorMsg("");
    setLoadingStudents(true);

    try {
      const [studentRes, markEntries] = await Promise.all([
        axios.get(
          `${baseURL}/api/preodictest-mark-entries/filter-students`,
          {
            params: { classId, divisionId, subjectId },
          }
        ),
        fetchMarkEntriesByTest(preodictestId),
      ]);

      const filterStudents = normalizeList(studentRes?.data);
      const merged = mergeStudentsWithMarkEntries(filterStudents, markEntries);
      setStudents(merged);
      setStudentsFetched(true);

      if (markEntries.length) {
        applyPrepopulatedMarks(markEntries);
      } else {
        setMarksByRegNo({});
        setMarkEntryIdsByRegNo({});
      }
    } catch (error) {
      console.error("Failed to load student table", error);
      setStudents([]);
      setStudentsFetched(true);
      setErrorMsg(
        error.response?.data?.message ||
          "Failed to load students. Please try again."
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleMarkChange = (regNo, value) => {
    const key = String(regNo);
    setMarksByRegNo((prev) => ({ ...prev, [key]: value }));
  };

  const resetPreodicTests = (setFieldValue) => {
    setFieldValue?.("preodic_test", "");
    setSelectedExamId("");
    setPreodicTests([]);
    resetStudents();
  };

  const fetchPreodicTests = async (classId, divisionId, subjectId, setFieldValue) => {
    resetPreodicTests(setFieldValue);
    if (!classId || !divisionId || !subjectId) {
      return;
    }
    setLoadingTests(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/preodictests/by-class-division-subject`,
        {
          params: {
            class: classId,
            division: divisionId,
            subject: subjectId,
          },
        }
      );
      setPreodicTests(normalizeList(res?.data));
    } catch (error) {
      console.error("Failed to fetch periodic tests", error);
      setPreodicTests([]);
      setErrorMsg(
        error.response?.data?.message ||
          "Failed to load periodic tests. Please try again."
      );
    } finally {
      setLoadingTests(false);
    }
  };

  const fetchSubjects = async (classId, setFieldValue) => {
    setFieldValue?.("subject", "");
    resetPreodicTests(setFieldValue);
    if (!classId) {
      setSubjects([]);
      return;
    }
    try {
      const res = await axios.get(
        `${baseURL}/api/program-subjects?classId=${classId}`
      );
      setSubjects(parseProgramSubjects(res?.data));
    } catch (error) {
      console.error("Failed to fetch subjects", error);
      setSubjects([]);
    }
  };

  const handleClassChange = (classId, setFieldValue) => {
    setFieldValue("class", classId);
    setFieldValue("division", "");
    resetPreodicTests(setFieldValue);
    fetchSubjects(classId, setFieldValue);
  };

  const handleDivisionChange = (divisionId, values, setFieldValue) => {
    setFieldValue("division", divisionId);
    resetStudents();
    fetchPreodicTests(
      values.class,
      divisionId,
      values.subject,
      setFieldValue
    );
  };

  const handleSubjectChange = (subjectId, values, setFieldValue) => {
    setFieldValue("subject", subjectId);
    resetStudents();
    fetchPreodicTests(
      values.class,
      values.division,
      subjectId,
      setFieldValue
    );
  };

  const handleShowStudents = async (values) => {
    await syncStudentTable(values);
  };

  const handleExamSelect = (examId, setFieldValue) => {
    setSelectedExamId(String(examId));
    setFieldValue("preodic_test", examId);

    if (studentsFetched && students.length) {
      fetchMarkEntriesByTest(examId).then((entries) => {
        applyMarkEntriesToTable(entries);
        setStudents((prev) => mergeStudentsWithMarkEntries(prev, entries));
      });
    }
  };

  const handleSaveMarks = async (values) => {
    const preodictestId = resolveExamId(values);
    if (!preodictestId) {
      setErrorMsg("Please select an exam before saving marks.");
      setSuccessMsg("");
      return;
    }
    if (!students.length) {
      setErrorMsg("Load students first, then enter marks.");
      setSuccessMsg("");
      return;
    }

    const payload = students
      .map((student) => {
        const raw = marksByRegNo[String(student.reg_no)];
        if (raw === "" || raw == null) return null;
        const mark = Number(raw);
        if (Number.isNaN(mark)) return null;
        return {
          preodictest_id: Number(preodictestId),
          reg_no: Number(student.reg_no),
          mark_obtained: mark,
        };
      })
      .filter(Boolean);

    if (!payload.length) {
      setErrorMsg("Enter at least one mark before saving.");
      setSuccessMsg("");
      return;
    }

    setSavingMarks(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await axios.post(
        `${baseURL}/api/preodictest-mark-entries/bulk`,
        payload
      );
      setSuccessMsg("Marks saved successfully.");
      const entries = await fetchMarkEntriesByTest(preodictestId);
      applyPrepopulatedMarks(entries);
      setStudents((prev) => mergeStudentsWithMarkEntries(prev, entries));
    } catch (error) {
      console.error("Failed to save marks", error);
      setErrorMsg(
        error.response?.data?.message ||
          "Failed to save marks. Please try again."
      );
    } finally {
      setSavingMarks(false);
    }
  };

  return (
    <div>
      <style>{`
        .chfi-root.pme-marks-form .field-row {
          grid-template-columns: 1fr;
          align-items: start;
          justify-items: start;
          text-align: left;
        }
        .chfi-root.pme-marks-form .form-label {
          justify-content: flex-start;
          text-align: left;
          width: 100%;
        }
        .chfi-root.pme-marks-form .icon-field {
          width: 100%;
        }
        .chfi-root.pme-marks-form .field-row > .field-error,
        .chfi-root.pme-marks-form .field-row .field-error {
          grid-column: 1;
        }
        .chfi-root.pme-marks-form .pme-exam-field {
          grid-column: 1;
          width: 100%;
        }
        .chfi-root .pme-exam-field {
          grid-column: 1 / -1;
        }
        .chfi-root .pme-exam-panel {
          border: 1px dashed rgba(148, 163, 184, 0.55);
          border-radius: 12px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
          min-height: 72px;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
          color: #64748b;
          font-size: 0.88rem;
          padding: 16px;
          text-align: left;
        }
        .chfi-root .pme-exam-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px;
          border: 1px solid rgba(59, 130, 246, 0.35);
          border-radius: 12px;
          background: linear-gradient(180deg, #ffffff 0%, #eff6ff 100%);
          box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.08);
        }
        .chfi-root .pme-exam-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          text-align: left;
          border: 1px solid rgba(96, 165, 250, 0.45);
          border-radius: 10px;
          background: #ffffff;
          padding: 10px 12px;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .chfi-root .pme-exam-row:hover {
          border-color: rgba(37, 99, 235, 0.55);
          background: #f8fafc;
        }
        .chfi-root .pme-exam-row.is-selected {
          border-color: rgba(37, 99, 235, 0.75);
          background: linear-gradient(180deg, #ffffff 0%, #dbeafe 100%);
          box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.18);
        }
        .chfi-root .pme-exam-row__details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .chfi-root .pme-exam-row__line {
          font-size: 0.86rem;
          line-height: 1.4;
          color: #000000;
          font-weight: 700;
          text-align: left;
        }
        .chfi-root .pme-exam-row__label {
          font-weight: 700;
          color: #000000;
        }
        .chfi-root .pme-exam-row__value {
          font-weight: 700;
          color: #000000;
        }
        .chfi-root .pme-exam-row.is-selected .pme-exam-row__line,
        .chfi-root .pme-exam-row.is-selected .pme-exam-row__label,
        .chfi-root .pme-exam-row.is-selected .pme-exam-row__value {
          color: #000000;
          font-weight: 700;
        }
        .chfi-root .pme-exam-row__check {
          flex-shrink: 0;
          color: #f59e0b;
        }
        .chfi-root .pme-show-students-wrap {
          grid-column: 1;
          width: 100%;
          margin-top: 4px;
        }
        .chfi-root .pme-students-empty {
          padding: 14px 12px;
          color: #64748b;
          font-size: 0.88rem;
        }
        .chfi-root .pme-mark-field {
          max-width: 120px;
        }
        .chfi-root .pme-save-marks-wrap {
          display: flex;
          justify-content: flex-start;
          margin-top: 12px;
        }
      `}</style>
      <div className="chfi-wrapper mb-3">
        <div className="chfi-card">
          <div className="card-header">
            <div className="header-row">
              <span className="header-icon">
                <Icon icon="solar:pen-new-square-bold-duotone" width="24" />
              </span>
              <div>
                <h5 className="card-title">Periodic Marks Entry</h5>
              </div>
            </div>
          </div>

          <div className="card-body">
            {successMsg && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                {successMsg}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccessMsg("")}
                />
              </div>
            )}
            {errorMsg && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {errorMsg}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setErrorMsg("")}
                />
              </div>
            )}

            <div className="form-area">
              <Formik
                initialValues={emptyValues}
                validationSchema={validationSchema}
                onSubmit={() => {}}
              >
                {({ setFieldValue, values }) => {
                  const divisionOptions = getDivisionsForClass(values.class);
                  return (
                    <Form className="chfi-root dynamic-form pme-marks-form">
                      <div className="field-row">
                        <label htmlFor="class" className="form-label">
                          <span className="label-dot" />
                          Class
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon
                              icon="solar:square-academic-cap-bold-duotone"
                              width="18"
                            />
                          </span>
                          <Field
                            as="select"
                            name="class"
                            className="form-select"
                            onChange={(e) =>
                              handleClassChange(e.target.value, setFieldValue)
                            }
                          >
                            <option value="">Select Class</option>
                            {classes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.class_name ?? c.name}
                              </option>
                            ))}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="class"
                          component="div"
                          className="text-danger field-error"
                        />
                      </div>

                      <div className="field-row">
                        <label htmlFor="division" className="form-label">
                          <span className="label-dot" />
                          Division
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon icon="solar:widget-bold-duotone" width="18" />
                          </span>
                          <Field
                            as="select"
                            name="division"
                            className="form-select"
                            disabled={!values.class}
                            onChange={(e) =>
                              handleDivisionChange(
                                e.target.value,
                                values,
                                setFieldValue
                              )
                            }
                          >
                            <option value="">Select Division</option>
                            {divisionOptions.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.division_name}
                              </option>
                            ))}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="division"
                          component="div"
                          className="text-danger field-error"
                        />
                      </div>

                      <div className="field-row">
                        <label htmlFor="subject" className="form-label">
                          <span className="label-dot" />
                          Subject
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon icon="solar:book-2-bold-duotone" width="18" />
                          </span>
                          <Field
                            as="select"
                            name="subject"
                            className="form-select"
                            disabled={!values.class}
                            onChange={(e) =>
                              handleSubjectChange(
                                e.target.value,
                                values,
                                setFieldValue
                              )
                            }
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.subject_name ?? s.name ?? s.value}
                              </option>
                            ))}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="subject"
                          component="div"
                          className="text-danger field-error"
                        />
                      </div>

                      <Field type="hidden" name="preodic_test" />

                      <div className="field-row pme-exam-field">
                        <label className="form-label">
                          <span className="label-dot" />
                          Select Exam
                        </label>
                        <ExamPickerPanel
                          tests={preodicTests}
                          selectedId={selectedExamId || values.preodic_test}
                          onSelect={(id) => handleExamSelect(id, setFieldValue)}
                          loading={loadingTests}
                          filtersReady={
                            Boolean(
                              values.class && values.division && values.subject
                            )
                          }
                        />
                      </div>

                      <div className="field-row pme-show-students-wrap">
                        <button
                          type="button"
                          className="btn btn-submit"
                          disabled={
                            loadingStudents ||
                            !values.class ||
                            !values.division ||
                            !values.subject ||
                            !(selectedExamId || values.preodic_test)
                          }
                          onClick={() => handleShowStudents(values)}
                        >
                          {loadingStudents ? (
                            <>
                              <Icon icon="line-md:loading-loop" width="16" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <Icon
                                icon="solar:users-group-rounded-bold-duotone"
                                width="18"
                              />
                              Show Student
                            </>
                          )}
                        </button>
                      </div>

                      {studentsFetched && (
                        <div className="field-row pme-show-students-wrap">
                          {students.length ? (
                            <>
                              <div className="report-table-wrap">
                                <table className="table report-table mb-0">
                                  <thead>
                                    <tr>
                                      <th>Reg No</th>
                                      <th>Roll Number</th>
                                      <th>Student Name</th>
                                      <th>Enter Mark</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {students.map((student) => (
                                      <tr key={student.id}>
                                        <td>{student.reg_no ?? "—"}</td>
                                        <td>{formatRollNumber(student)}</td>
                                        <td>{formatStudentName(student)}</td>
                                        <td>
                                          <input
                                            type="number"
                                            min={0}
                                            step="any"
                                            className="form-control pme-mark-field"
                                            placeholder="Enter Mark"
                                            value={
                                              marksByRegNo[
                                                String(student.reg_no)
                                              ] ?? ""
                                            }
                                            onChange={(e) =>
                                              handleMarkChange(
                                                student.reg_no,
                                                e.target.value
                                              )
                                            }
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="pme-save-marks-wrap pme-show-students-wrap">
                                <button
                                  type="button"
                                  className="btn btn-submit"
                                  disabled={savingMarks || !students.length}
                                  title={
                                    !(selectedExamId || values.preodic_test)
                                      ? "Select an exam above, then save"
                                      : undefined
                                  }
                                  onClick={() => handleSaveMarks(values)}
                                >
                                  {savingMarks ? (
                                    <>
                                      <Icon
                                        icon="line-md:loading-loop"
                                        width="16"
                                      />
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <Icon
                                        icon="solar:diskette-bold-duotone"
                                        width="18"
                                      />
                                      Save Marks
                                    </>
                                  )}
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="report-table-wrap pme-students-empty">
                              No students found.
                            </div>
                          )}
                        </div>
                      )}
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreodicMarksEntry;
