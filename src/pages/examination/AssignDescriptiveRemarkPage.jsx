import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from 'axios';
import baseURL from "../../utils/baseUrl";
import "../../assets/css/mastercom.css";
import "../../assets/css/academicOfflineFeeReport.css";
import "../../assets/css/examination.css";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AssignDescriptiveRemarkPage = () => {
  const [exam, setExam] = useState([]);
  const [examSchemes, setExamSchemes] = useState([]);
  const [classdivisionmap, setClassDivisionMap] = useState([]);
  const [classlist, setClassList] = useState([]);
  const [termList, setTermList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);

  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [examschemid, setExamSchemid] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [student, setStudent] = useState(null);
  const [resolvedSchemeId, setResolvedSchemeId] = useState(null);

  const [remarks, setRemarks] = useState([]);
  const [selectedRemarkIds, setSelectedRemarkIds] = useState([]);
  const [sequences, setSequences] = useState({});
  const selectAllRef = useRef(null);
  const alertRef = useRef(null);

  useEffect(() => {
    Promise.allSettled([
      axios.get(`${baseURL}/api/exam-names`),
      axios.get(`${baseURL}/api/class-div-map-masters`),
      axios.get(`${baseURL}/api/descriptive-remarks`),
    ]).then(([examResponse, classDivisionResponse, remarksResponse]) => {
      setExam(examResponse.value?.data?.data || []);
      setClassDivisionMap(classDivisionResponse.value?.data?.data || []);
      const remarkRows = (Array.isArray(remarksResponse.value?.data?.data)
        ? remarksResponse.value.data.data
        : []
      ).map((row) => ({ ...row, id: Number(row.id) }));
      setRemarks(remarkRows);
      const initialSequences = {};
      remarkRows.forEach((row) => {
        initialSequences[row.id] = "";
      });
      setSequences(initialSequences);
    });
  }, []);

  const sequenceOptions = useMemo(
    () => Array.from({ length: remarks.length }, (_, i) => i + 1),
    [remarks.length]
  );

  const usedSequencesByRemark = useMemo(() => {
    const used = {};
    Object.entries(sequences).forEach(([remarkId, seq]) => {
      if (seq !== "" && seq != null) used[Number(seq)] = Number(remarkId);
    });
    return used;
  }, [sequences]);

  const allSelected = useMemo(
    () => remarks.length > 0 && selectedRemarkIds.length === remarks.length,
    [remarks, selectedRemarkIds]
  );
  const someSelected = selectedRemarkIds.length > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  useEffect(() => {
    if (errorMsg || successMsg) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Also scroll common app layout containers that may hold the overflow
      const scrollParents = [
        document.querySelector(".dashboard-main"),
        document.querySelector(".dashboard-main-body"),
        document.querySelector("main"),
        document.scrollingElement,
      ].filter(Boolean);
      scrollParents.forEach((el) => {
        if (typeof el.scrollTo === "function") {
          el.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          el.scrollTop = 0;
        }
      });
    }
  }, [errorMsg, successMsg]);

  const clearStudentResult = () => {
    setStudent(null);
    setResolvedSchemeId(null);
    setSelectedRemarkIds([]);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const studentDisplayName = (s) =>
    [s?.first_name, s?.last_name, s?.father_name]
      .map((part) => String(part ?? "").trim())
      .filter(Boolean)
      .join(" ");

  const handleExamChange = async (e) => {
    const examId = e.target.value;
    setSelectedExam(examId);
    setSelectedClass('');
    setSelectedTerm('');
    setSelectedDivision('');
    setExamSchemid(null);
    setExamSchemes([]);
    setClassList([]);
    setTermList([]);
    setDivisionList([]);
    clearStudentResult();

    if (!examId) return;

    try {
      const { data } = await axios.get(`${baseURL}/api/exam-schemes/exam-name/${examId}`);
      setExamSchemes(data?.data || []);
      const filterClass = (data?.data || []).map((item) => ({
        id: item.classInfo?.id,
        class_name: item.classInfo?.class_name,
      }));
      setClassList([...new Map(filterClass.map((item) => [item.id, item])).values()]);
    } catch (err) {
      console.error("Failed to load exam schemes", err);
      setErrorMsg(err.response?.data?.message || "Failed to load exam schemes");
    }
  };

  const handleChangeClass = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setSelectedTerm('');
    setSelectedDivision('');
    setExamSchemid(null);
    clearStudentResult();

    if (!classId) {
      setTermList([]);
      setDivisionList([]);
      return;
    }

    const filterTerms = examSchemes.filter((item) => item.classInfo?.id == classId);
    setTermList(filterTerms.map((item) => ({ id: item.termInfo?.id, term_name: item.termInfo?.term_name })));

    const division = classdivisionmap.filter((item) => item.classInfo?.id == classId);
    setDivisionList(
      division.map((item) => ({ id: item.divisionInfo?.id, division_name: item.divisionInfo?.division_name }))
    );
  };

  const handleChangeTerm = (e) => {
    const termId = e.target.value;
    setSelectedTerm(termId);
    clearStudentResult();
    setExamSchemid(
      examSchemes.find(
        (item) =>
          item.exam_name_id == selectedExam && item.classInfo?.id == selectedClass && item.termInfo?.id == termId
      )?.id ?? null
    );
  };

  const resolveExamSchemeId = () =>
    examschemid ??
    examSchemes.find(
      (item) =>
        item.exam_name_id == selectedExam &&
        item.classInfo?.id == selectedClass &&
        item.termInfo?.id == selectedTerm
    )?.id ??
    null;

  const searchStudent = async ({ keepSuccessMsg = false } = {}) => {
    if (!keepSuccessMsg) setSuccessMsg("");
    setErrorMsg("");
    setSelectedRemarkIds([]);
    setSequences((prev) => {
      const empty = {};
      Object.keys(prev).forEach((id) => {
        empty[id] = "";
      });
      return empty;
    });

    const missing = [
      [selectedExam, "Exam"],
      [selectedClass, "Class"],
      [selectedTerm, "Term"],
      [selectedDivision, "Division"],
    ].filter(([value]) => !value).map(([, label]) => label);

    if (missing.length) {
      setStudent(null);
      setResolvedSchemeId(null);
      setErrorMsg(`Please select ${missing.join(", ")}`);
      return false;
    }

    const examSchemeId = resolveExamSchemeId();
    if (!examSchemeId) {
      setStudent(null);
      setResolvedSchemeId(null);
      setErrorMsg("No exam scheme found for the selected exam, class and term.");
      return false;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.get(`${baseURL}/api/assign-descriptive-remarks/one-student`, {
        params: {
          exam_scheme_id: examSchemeId,
          class_id: selectedClass,
          term_id: selectedTerm,
          division_id: selectedDivision,
        },
        headers: authHeaders(),
      });

      if (!data?.success) {
        setStudent(null);
        setResolvedSchemeId(null);
        setErrorMsg(data?.message || "No student found for this exam Scheme");
        return false;
      }

      const found = data?.data?.student || null;
      if (!found) {
        setStudent(null);
        setResolvedSchemeId(null);
        setErrorMsg(data?.message || "No student found for this exam Scheme");
        return false;
      }

      setStudent(found);
      setResolvedSchemeId(examSchemeId);
      return true;
    } catch (err) {
      setStudent(null);
      setResolvedSchemeId(null);
      setErrorMsg(err.response?.data?.message || err.message || "Failed to search student");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await searchStudent();
  };

  const handleReset = () => {
    setSelectedExam('');
    setSelectedClass('');
    setSelectedTerm('');
    setSelectedDivision('');
    setExamSchemid(null);
    setExamSchemes([]);
    setClassList([]);
    setTermList([]);
    setDivisionList([]);
    clearStudentResult();
  };

  const toggleSelectAll = (checked) => {
    setSelectedRemarkIds(checked ? remarks.map((row) => Number(row.id)) : []);
  };

  const toggleRemark = (remarkId, checked) => {
    const id = Number(remarkId);
    setSelectedRemarkIds((prev) =>
      checked ? [...new Set([...prev, id])] : prev.filter((item) => item !== id)
    );
  };

  const setSequence = (remarkId, value) => {
    const nextValue = value === "" ? "" : Number(value);
    setSequences((prev) => {
      const next = { ...prev };
      // Keep sequences unique: clear the same sequence from any other remark
      if (nextValue !== "") {
        Object.keys(next).forEach((id) => {
          if (Number(id) !== Number(remarkId) && Number(next[id]) === nextValue) {
            next[id] = "";
          }
        });
      }
      next[remarkId] = nextValue;
      return next;
    });
  };

  const resetSequences = () => {
    const empty = {};
    remarks.forEach((row) => {
      empty[row.id] = "";
    });
    setSequences(empty);
  };

  const handleSaveRemarks = async () => {
    setSuccessMsg("");
    setErrorMsg("");

    if (!student || !resolvedSchemeId) {
      setErrorMsg("Search and select a student first.");
      return;
    }
    if (!selectedRemarkIds.length) {
      setErrorMsg("Please select at least one descriptive remark.");
      return;
    }

    const maxSequence = remarks.length;
    const selectedSequences = [];
    for (const remarkId of selectedRemarkIds) {
      const seq = sequences[remarkId];
      if (seq === "" || seq == null) {
        setErrorMsg("Please select sequence for all checked descriptive remarks.");
        return;
      }
      const seqNum = Number(seq);
      if (!Number.isFinite(seqNum) || seqNum < 1 || seqNum > maxSequence) {
        setErrorMsg(`Sequence must be between 1 and ${maxSequence}.`);
        return;
      }
      if (selectedSequences.includes(seqNum)) {
        setErrorMsg("Sequence should not be the same for two descriptive remarks.");
        return;
      }
      selectedSequences.push(seqNum);
    }

    const payload = {
      exam_scheme_id: Number(resolvedSchemeId),
      reg_no: student.reg_no,
      remarks: selectedRemarkIds.map((remarkId) => ({
        remark_id: remarkId,
        sequence: Number(sequences[remarkId]),
      })),
    };

    setSaving(true);
    try {
      const { data } = await axios.post(`${baseURL}/api/assign-descriptive-remarks`, payload, {
        headers: authHeaders(),
      });
      if (data?.success === false) {
        setErrorMsg(data?.message || "Failed to save descriptive remarks");
        return;
      }
      setSuccessMsg(data?.message || "Descriptive remarks assigned successfully");
      resetSequences();
      // Load next student automatically (same as Search Student)
      await searchStudent({ keepSuccessMsg: true });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to save descriptive remarks");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    {
      id: "result-exam",
      label: "Exam",
      required: true,
      icon: "solar:document-text-bold-duotone",
      value: selectedExam,
      onChange: handleExamChange,
      placeholder: "Select Exam",
      options: exam.map((item) => ({ value: item.id, label: item.exam_name })),
    },
    {
      id: "result-class",
      label: "Class",
      required: true,
      icon: "solar:square-academic-cap-bold-duotone",
      value: selectedClass,
      onChange: handleChangeClass,
      placeholder: "Select Class",
      options: classlist.map((item) => ({ value: item.id, label: item.class_name })),
    },
    {
      id: "result-term",
      label: "Term",
      required: true,
      icon: "solar:calendar-bold-duotone",
      value: selectedTerm,
      onChange: handleChangeTerm,
      placeholder: "Select Term",
      options: termList.map((item) => ({ value: item.id, label: item.term_name })),
    },
    {
      id: "result-division",
      label: "Division",
      required: true,
      icon: "solar:users-group-rounded-bold-duotone",
      value: selectedDivision,
      onChange: (e) => {
        setSelectedDivision(e.target.value);
        clearStudentResult();
      },
      placeholder: "Select Division",
      options: divisionList.map((item) => ({ value: item.id, label: item.division_name })),
    },
  ];

  return (
    <div className="chfi-wrapper adr-page mb-3">
      <div className="chfi-card adr-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:diploma-verified-bold-duotone" width="22" />
            </span>
            <div>
              <h5 className="card-title">Assign Result Descriptive Remark</h5>
              <p className="card-subtitle mb-0">Search a student, select remarks, set sequence, then save</p>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div ref={alertRef}>
            {successMsg && (
              <div className="adr-alert adr-alert-success" role="alert">
                <Icon icon="solar:check-circle-bold-duotone" width="18" />
                <span>{successMsg}</span>
                <button type="button" className="btn-close ms-auto" onClick={() => setSuccessMsg("")} />
              </div>
            )}

            {errorMsg && (
              <div className="adr-alert adr-alert-danger" role="alert">
                <Icon icon="solar:danger-triangle-bold-duotone" width="18" />
                <span>{errorMsg}</span>
                <button type="button" className="btn-close ms-auto" onClick={() => setErrorMsg("")} />
              </div>
            )}
          </div>

          <div className="form-area">
            <form className="chfi-root dynamic-form" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <div key={field.id} className="field-row">
                  <label htmlFor={field.id} className="form-label">
                    <span className="label-dot" />
                    {field.label}
                    {field.required && <span className="text-danger"> *</span>}
                  </label>
                  <div className="icon-field">
                    <span className="icon">
                      <Icon icon={field.icon} width="18" />
                    </span>
                    <select id={field.id} className="form-select" value={field.value} onChange={field.onChange}>
                      <option value="">{field.placeholder}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              <div className="actions">
                <button type="button" className="btn btn-reset" onClick={handleReset} disabled={submitting || saving}>
                  <Icon icon="solar:restart-bold-duotone" width="16" />
                  Reset
                </button>
                <button type="submit" className="btn btn-submit" disabled={submitting || saving}>
                  {submitting ? (
                    <>
                      <Icon icon="line-md:loading-loop" width="16" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Icon icon="solar:magnifer-bold-duotone" width="18" />
                      Search Student
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {student && (
            <div className="adr-result">
              <div className="adr-student">
                <div className="adr-student-title">
                  <Icon icon="solar:user-bold-duotone" width="16" />
                  Student Details
                </div>
                <div className="adr-student-lines">
                  <div>reg_no - {student.reg_no ?? "—"}</div>
                  <div>name - {studentDisplayName(student) || "—"}</div>
                  <div>student_id: {student.id ?? "—"}</div>
                </div>
              </div>

              <div className="report-table-wrap adr-table-full">
                <table className="table report-table mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: 52 }} className="text-center">
                        <input
                          ref={selectAllRef}
                          type="checkbox"
                          className="form-check-input m-0"
                          checked={allSelected}
                          onChange={(e) => toggleSelectAll(e.target.checked)}
                          title="Select all"
                          aria-label="Select all remarks"
                        />
                      </th>
                      <th style={{ width: 70 }}>Sr No</th>
                      <th>Descriptive Remark</th>
                      <th style={{ width: 140 }}>Sequence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {remarks.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-muted py-3">
                          No descriptive remarks found.
                        </td>
                      </tr>
                    ) : (
                      remarks.map((row, index) => {
                        const remarkId = Number(row.id);
                        const checked = selectedRemarkIds.includes(remarkId);
                        return (
                          <tr key={remarkId}>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                className="form-check-input m-0"
                                checked={checked}
                                onChange={(e) => toggleRemark(remarkId, e.target.checked)}
                                title="Select remark"
                                aria-label={`Select remark ${remarkId}`}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td className="adr-remark-cell">{row.remark}</td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={sequences[remarkId] ?? ""}
                                onChange={(e) => setSequence(remarkId, e.target.value)}
                              >
                                <option value="">Select sequence</option>
                                {sequenceOptions.map((n) => {
                                  const takenBy = usedSequencesByRemark[n];
                                  const disabled = takenBy != null && takenBy !== remarkId;
                                  return (
                                    <option key={n} value={n} disabled={disabled}>
                                      {n}{disabled ? " (used)" : ""}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="adr-save-row">
                <button
                  type="button"
                  className="adr-save-btn"
                  onClick={handleSaveRemarks}
                  disabled={saving || !remarks.length}
                >
                  {saving ? (
                    <>
                      <Icon icon="line-md:loading-loop" width="16" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Icon icon="solar:diskette-bold-duotone" width="18" />
                      Save Remarks
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignDescriptiveRemarkPage;
