import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from 'axios';
import baseURL from "../../utils/baseUrl";
import "../../assets/css/mastercom.css";
import "../../assets/css/examination.css";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const GenarateResultPage = () => {
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
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    Promise.allSettled([
      axios.get(`${baseURL}/api/exam-names`),
      axios.get(`${baseURL}/api/class-div-map-masters`),
    ]).then(([examResponse, classDivisionResponse]) => {
      setExam(examResponse.value?.data?.data || []);
      setClassDivisionMap(classDivisionResponse.value?.data?.data || []);
    });
  }, []);

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
    setExamSchemid(
      examSchemes.find(
        (item) =>
          item.exam_name_id == selectedExam && item.classInfo?.id == selectedClass && item.termInfo?.id == termId
      )?.id ?? null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const missing = [
      [selectedExam, "Exam"],
      [selectedClass, "Class"],
      [selectedTerm, "Term"],
      [selectedDivision, "Division"],
    ].filter(([value]) => !value).map(([, label]) => label);

    if (missing.length) {
      setErrorMsg(`Please select ${missing.join(", ")}`);
      return;
    }

    const examSchemeId =
      examschemid ??
      examSchemes.find(
        (item) =>
          item.exam_name_id == selectedExam &&
          item.classInfo?.id == selectedClass &&
          item.termInfo?.id == selectedTerm
      )?.id;

    if (!examSchemeId) {
      setErrorMsg("No exam scheme found for the selected exam, class and term.");
      return;
    }

    const payload = {
      exam_scheme_id: examSchemeId,
      class_id: selectedClass,
      term_id: selectedTerm,
      division_id: selectedDivision,
    };

    setSubmitting(true);
    try {
      const { data } = await axios.post(`${baseURL}/api/result-mark-entry-lists/generate-result`, payload, {
        headers: authHeaders(),
      });
      setSuccessMsg(data?.message || "Result generated successfully");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
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
    setSuccessMsg("");
    setErrorMsg("");
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
      onChange: (e) => setSelectedDivision(e.target.value),
      placeholder: "Select Division",
      options: divisionList.map((item) => ({ value: item.id, label: item.division_name })),
    },
  ];

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:diploma-verified-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Generate Result</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          {successMsg && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMsg}
              <button type="button" className="btn-close" onClick={() => setSuccessMsg("")} />
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMsg}
              <button type="button" className="btn-close" onClick={() => setErrorMsg("")} />
            </div>
          )}

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
                <button type="button" className="btn btn-reset" onClick={handleReset} disabled={submitting}>
                  <Icon icon="solar:restart-bold-duotone" width="16" />
                  Reset
                </button>
                <button type="submit" className="btn btn-submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Icon icon="line-md:loading-loop" width="16" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Icon icon="solar:check-circle-bold-duotone" width="18" />
                      Generate Result
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenarateResultPage;
