import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../utils/baseUrl";
import axios from "axios";
import "../../assets/css/mastercom.css";
import "../../assets/css/examconfigure.css";
import GenericTableDataLayer from "../../components/GenericTable";

const groupBySchemeAndSubject = (rows) => {
  const groups = new Map();
  rows.forEach((row) => {
    const key = `${row.scheme_id}-${row.subject_id}`;
    if (!groups.has(key)) {
      groups.set(key, {
        scheme_id: row.scheme_id,
        exam_name: row.exam_name,
        subject_id: row.subject_id,
        subject: row.subject,
        term_id: row.term_id,
        term: row.term,
        formative_components: [],
        formative_total: 0,
        summative_components: [],
        summative_total: 0,
      });
    }

    const group = groups.get(key);
    const marks = Number(row.max_marks) || 0;
    const groupName = String(row.group_name || "").trim().toLowerCase();

    if (groupName === "formative") {
      group.formative_components.push(row.component);
      group.formative_total += marks;
    } else if (groupName === "summative" || groupName === "submative") {
      group.summative_components.push(row.component);
      group.summative_total += marks;
    }
  });
  return Array.from(groups.values());
};

const Examconfiguration = () => {
  const [exams, setExams] = useState([]);
  const [examSchemes, setExamSchemes] = useState([]);
  const [subjectsComponents, setSubjectsComponents] = useState([]);
  const [loadingExamDetail, setLoadingExamDetail] = useState(false);
  const [loadingSubjectsComponents, setLoadingSubjectsComponents] = useState(false);
  const examRequestRef = useRef(0);
  const subjectsComponentsRequestRef = useRef(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [gradeScales, setGradeScales] = useState([]);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const formikRef = useRef(null);
  console.log('subject name is:',subjectsComponents)
  const initialValues = {
    exam_id: "",
    class_id: "",
    term_id: "",
    exam_scheme_id: "",
  };

  useEffect(() => {
    async function fetchExams() {
      try {
        const { data } = await axios.get(`${baseURL}/api/exam-names`, {
          params: { start: 0, length: 1000 },
        });
        setExams(data?.data || []);
      } catch (err) {
        console.error("Failed to load exams", err);
      }
    }
    fetchExams();
  }, []);

  useEffect(() => {
    async function fetchGradeScales() {
      try {
        const { data } = await axios.get(`${baseURL}/api/grade-scales`, {
          params: { start: 0, length: 1000 },
        });
        setGradeScales(data?.data || []);
      } catch (err) {
        console.error("Failed to load grade scales", err);
      }
    }
    fetchGradeScales();
  }, []);

  const highestMaxCacheRef = useRef(new Map());

  const calcRatio = (maxPercent, total) => {
    const totalMarks = Number(total);
    if (maxPercent == null || !totalMarks) return "";
    return Number((maxPercent / totalMarks).toFixed(2));
  };

  const withRatios = (row) =>
    row.mark_or_grade === 1 && row.max_percent != null
      ? {
          ...row,
          formative_ratio: calcRatio(row.max_percent, row.formative_total),
          summative_ratio: calcRatio(row.max_percent, row.summative_total),
        }
      : { ...row, formative_ratio: "", summative_ratio: "" };

  const updateSubjectField = (index, field, value) => {
    setSubjectsComponents((prev) =>
      prev.map((item, i) => (i === index ? withRatios({ ...item, [field]: value }) : item))
    );
  };

  const fetchHighestMaxPercent = async (gradeScaleId) => {
    const cache = highestMaxCacheRef.current;
    if (cache.has(gradeScaleId)) return cache.get(gradeScaleId);
    const { data } = await axios.get(`${baseURL}/api/grade-scales/${gradeScaleId}/highest-max`);
    const maxPercent = Number(data?.data?.max_percent);
    const value = Number.isFinite(maxPercent) ? maxPercent : null;
    cache.set(gradeScaleId, value);
    return value;
  };

  /** Grade or Mark/Grade changed: ratio = highest max_percent / total, only when Mark/Grade is Yes (1). */
  const handleRatioSourceChange = async (index, field, value) => {
    const row = { ...subjectsComponents[index], [field]: value };
    setSubjectsComponents((prev) =>
      prev.map((item, i) =>
        i === index ? withRatios({ ...item, [field]: value, max_percent: null }) : item
      )
    );

    if (!row.grade_scale_id || row.mark_or_grade !== 1) return;

    try {
      const maxPercent = await fetchHighestMaxPercent(row.grade_scale_id);
      setSubjectsComponents((prev) =>
        prev.map((item) =>
          item.subject_id === row.subject_id &&
          item.grade_scale_id === row.grade_scale_id &&
          item.mark_or_grade === 1
            ? withRatios({ ...item, max_percent: maxPercent })
            : item
        )
      );
    } catch (err) {
      console.error("Failed to load highest grade percent", err);
      setErrorMsg(err.response?.data?.message || "Failed to load highest grade percent");
    }
  };

  const toNumberOrEmpty = (value) => (value === "" ? "" : Number(value));

  const toNumber = (value) => Number(value) || 0;

  const toFlag = (value) => (value === true || value === 1 || value === "1" ? 1 : 0);

  const REQUIRED_FIELDS = [
    ["grade_scale_id", "Grade"],
    ["is_separate_passing", "Is Separate Passing"],
    ["is_included_in_total", "Is Include in Total"],
    ["mark_or_grade", "Mark/Grade"],
    ["sequence", "Sequence"],
  ];

  const handleSave = async () => {
    const { exam_id, class_id, term_id } = formikRef.current?.values || {};
    setErrorMsg("");
    setSuccessMsg("");

    if (!exam_id || !class_id || !term_id) {
      setErrorMsg("Please select exam, class and term.");
      return;
    }

    for (const row of subjectsComponents) {
      const missing = REQUIRED_FIELDS.find(([field]) => row[field] === "" || row[field] == null);
      if (missing) {
        setErrorMsg(`Please select ${missing[1]} for ${row.subject}.`);
        return;
      }
    }

    const payload = subjectsComponents.map((row) => {
      const formativeTotal = toNumber(row.formative_total);
      const summativeTotal = toNumber(row.summative_total);
      const formativePassing = toNumber(row.formative_passing);
      const summativePassing = toNumber(row.summative_passing);
      return {
        exam_id: row.scheme_id,
        class_id: Number(class_id),
        term_id: Number(term_id),
        subject_id: row.subject_id,
        grade_scale_id: row.grade_scale_id,
        is_separate_passing: row.is_separate_passing === 1,
        is_included_in_total: row.is_included_in_total === 1,
        mark_or_grade: row.mark_or_grade === 1,
        sequence: row.sequence,
        formative_total: formativeTotal,
        formative_passing: formativePassing,
        formative_ratio: toNumber(row.formative_ratio),
        summative_total: summativeTotal,
        summative_passing: summativePassing,
        summative_ratio: toNumber(row.summative_ratio),
        total_mark: formativeTotal + summativeTotal,
        total_passing: formativePassing + summativePassing,
      };
    });

    setSaving(true);
    try {
      const { data } = await axios.post(`${baseURL}/api/exam-configures`, payload);
      setSuccessMsg(data?.message || "Exam configuration saved successfully.");
    } catch (err) {
      console.error("Failed to save exam configuration", err);
      setErrorMsg(err.response?.data?.message || "Failed to save exam configuration");
    } finally {
      setSaving(false);
    }
  };

  const uniqueById = (items) => {
    const map = new Map();
    items.forEach((item) => {
      if (item?.id != null && !map.has(item.id)) map.set(item.id, item);
    });
    return Array.from(map.values());
  };

  const classes = uniqueById(examSchemes.map((scheme) => scheme.classInfo));

  const getTermsForClass = (classId) =>
    classId
      ? uniqueById(
          examSchemes
            .filter((scheme) => String(scheme.class_id) === String(classId))
            .map((scheme) => scheme.termInfo)
        )
      : [];

  const clearSubjectsData = (setFieldValue) => {
    ++subjectsComponentsRequestRef.current;
    setLoadingSubjectsComponents(false);
    setSubjectsComponents([]);
    setFieldValue("exam_scheme_id", "");
    setErrorMsg("");
  };

  const fetchSubjectsComponents = async (classId, termId, setFieldValue) => {
    const requestId = ++subjectsComponentsRequestRef.current;
    setSubjectsComponents([]);
    setFieldValue("exam_scheme_id", "");
    setErrorMsg("");

    if (!classId || !termId) {
      setLoadingSubjectsComponents(false);
      return;
    }

    const matchedScheme = examSchemes.find(
      (scheme) =>
        String(scheme.class_id) === String(classId) &&
        String(scheme.term_id) === String(termId)
    );
    const schemeId = matchedScheme?.id;

    if (schemeId == null) {
      setErrorMsg("No exam scheme found for this exam, class and term.");
      setLoadingSubjectsComponents(false);
      return;
    }

    setFieldValue("exam_scheme_id", String(schemeId));
    setLoadingSubjectsComponents(true);
    try {
      const [{ data }, { data: savedData }] = await Promise.all([
        axios.get(
          `${baseURL}/api/exam-schemes/${schemeId}/class/${classId}/term/${termId}/subjects-components`
        ),
        axios.get(`${baseURL}/api/exam-configures`, {
          params: { start: 0, length: 1000, exam_id: schemeId, class_id: classId, term_id: termId },
        }),
      ]);
      if (requestId !== subjectsComponentsRequestRef.current) return;

      const savedBySubject = new Map(
        (Array.isArray(savedData?.data) ? savedData.data : [])
          .filter(
            (saved) =>
              String(saved.exam_id) === String(schemeId) &&
              String(saved.class_id) === String(classId) &&
              String(saved.term_id) === String(termId)
          )
          .map((saved) => [String(saved.subject_id), saved])
      );

      const rows = groupBySchemeAndSubject(Array.isArray(data?.data) ? data.data : []).map((item) => {
        const saved = savedBySubject.get(String(item.subject_id));
        if (!saved) {
          return {
            ...item,
            formative_passing: "",
            summative_passing: "",
            formative_ratio: "",
            summative_ratio: "",
          };
        }
        return {
          ...item,
          grade_scale_id: saved.grade_scale_id ?? "",
          is_separate_passing: toFlag(saved.is_separate_passing),
          is_included_in_total: toFlag(saved.is_included_in_total),
          mark_or_grade: toFlag(saved.mark_or_grade),
          sequence: saved.sequence ?? "",
          formative_total: Number(saved.formative_total) || 0,
          formative_passing: saved.formative_passing ?? "",
          formative_ratio: saved.formative_ratio ?? "",
          summative_total: Number(saved.summative_total) || 0,
          summative_passing: saved.summative_passing ?? "",
          summative_ratio: saved.summative_ratio ?? "",
          max_percent: null,
        };
      });
      setSubjectsComponents(rows);

      const gradeScaleIds = [
        ...new Set(
          rows
            .filter((row) => row.mark_or_grade === 1 && row.grade_scale_id)
            .map((row) => row.grade_scale_id)
        ),
      ];
      gradeScaleIds.forEach(async (gradeScaleId) => {
        try {
          const maxPercent = await fetchHighestMaxPercent(gradeScaleId);
          if (requestId !== subjectsComponentsRequestRef.current) return;
          setSubjectsComponents((prev) =>
            prev.map((row) =>
              row.mark_or_grade === 1 && row.grade_scale_id === gradeScaleId
                ? { ...row, max_percent: maxPercent }
                : row
            )
          );
        } catch (err) {
          console.error("Failed to load highest grade percent", err);
        }
      });
    } catch (err) {
      if (requestId === subjectsComponentsRequestRef.current) {
        console.error("Failed to load subjects components", err);
        setErrorMsg(err.response?.data?.message || "Failed to load subjects components");
      }
    } finally {
      if (requestId === subjectsComponentsRequestRef.current) {
        setLoadingSubjectsComponents(false);
      }
    }
  };

  const handleExamChange = async (examId, setFieldValue) => {
    const requestId = ++examRequestRef.current;
    setFieldValue("exam_id", examId);
    setFieldValue("class_id", "");
    setFieldValue("term_id", "");
    setExamSchemes([]);
    clearSubjectsData(setFieldValue);
    if (!examId) {
      setLoadingExamDetail(false);
      return;
    }

    setLoadingExamDetail(true);
    try {
      const { data } = await axios.get(`${baseURL}/api/exam-schemes/exam-name/${examId}`);
      if (requestId !== examRequestRef.current) return;
      setExamSchemes(data?.data || []);
    } catch (err) {
      if (requestId === examRequestRef.current) {
        console.error("Failed to load exam details", err);
        setErrorMsg(err.response?.data?.message || "Failed to load exam details");
      }
    } finally {
      if (requestId === examRequestRef.current) {
        setLoadingExamDetail(false);
      }
    }
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/exam-configures/${id}`);
      alert("Exam configuration deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = async (id, row) => {
    if (!row) return;
    setErrorMsg("");
    setSuccessMsg("");

    const examNameId = row.exam?.exam_name_id ?? "";

    formikRef.current?.setValues({
      exam_id: examNameId ? String(examNameId) : "",
      class_id: String(row.class_id ?? ""),
      term_id: String(row.term_id ?? ""),
      exam_scheme_id: String(row.exam_id ?? ""),
    });

    ++subjectsComponentsRequestRef.current;
    setLoadingSubjectsComponents(false);
    const editRow = {
      scheme_id: row.exam_id,
      exam_name: row.exam?.examNameInfo?.exam_name ?? "",
      subject_id: row.subject_id,
      subject: row.subjectInfo?.value ?? "",
      term_id: row.term_id,
      term: row.termInfo?.term_name ?? "",
      grade_scale_id: row.grade_scale_id ?? "",
      is_separate_passing: toFlag(row.is_separate_passing),
      is_included_in_total: toFlag(row.is_included_in_total),
      mark_or_grade: toFlag(row.mark_or_grade),
      sequence: row.sequence ?? "",
      formative_total: Number(row.formative_total) || 0,
      formative_passing: row.formative_passing ?? "",
      formative_ratio: row.formative_ratio ?? "",
      summative_total: Number(row.summative_total) || 0,
      summative_passing: row.summative_passing ?? "",
      summative_ratio: row.summative_ratio ?? "",
      max_percent: null,
    };
    setSubjectsComponents([editRow]);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (examNameId) {
      const requestId = ++examRequestRef.current;
      setLoadingExamDetail(true);
      try {
        const { data } = await axios.get(`${baseURL}/api/exam-schemes/exam-name/${examNameId}`);
        if (requestId === examRequestRef.current) setExamSchemes(data?.data || []);
      } catch (err) {
        console.error("Failed to load exam details", err);
      } finally {
        if (requestId === examRequestRef.current) setLoadingExamDetail(false);
      }
    }

    if (editRow.mark_or_grade === 1 && editRow.grade_scale_id) {
      try {
        const maxPercent = await fetchHighestMaxPercent(editRow.grade_scale_id);
        setSubjectsComponents((prev) =>
          prev.map((item) =>
            item.subject_id === editRow.subject_id ? { ...item, max_percent: maxPercent } : item
          )
        );
      } catch (err) {
        console.error("Failed to load highest grade percent", err);
      }
    }
  };

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:settings-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Filter Exam</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          {errorMsg && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMsg}
              <button type="button" className="btn-close" onClick={() => setErrorMsg("")} />
            </div>
          )}

          <Formik innerRef={formikRef} initialValues={initialValues} onSubmit={() => {}}>
            {({ values, setFieldValue }) => (
              <Form className="chfi-root">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">
                      <span className="label-dot" />
                      Exam
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:document-text-bold-duotone" width="18" />
                      </span>
                      <Field
                        as="select"
                        name="exam_id"
                        className="form-select"
                        onChange={(e) => handleExamChange(e.target.value, setFieldValue)}
                      >
                        <option value="">Select exam</option>
                        {exams.map((exam) => (
                          <option key={exam.id} value={exam.id}>
                            {exam.exam_name}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage name="exam_id" component="div" className="text-danger field-error" />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      <span className="label-dot" />
                      Class
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:square-academic-cap-bold-duotone" width="18" />
                      </span>
                      <Field
                        as="select"
                        name="class_id"
                        className="form-select"
                        disabled={!values.exam_id || loadingExamDetail}
                        onChange={(e) => {
                          const classId = e.target.value;
                          setFieldValue("class_id", classId);
                          setFieldValue("term_id", "");
                          clearSubjectsData(setFieldValue);
                        }}
                      >
                        <option value="">Select class</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.class_name}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage name="class_id" component="div" className="text-danger field-error" />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      <span className="label-dot" />
                      Term
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:calendar-bold-duotone" width="18" />
                      </span>
                      <Field
                        as="select"
                        name="term_id"
                        className="form-select"
                        disabled={!values.class_id || loadingExamDetail || loadingSubjectsComponents}
                        onChange={(e) => {
                          const termId = e.target.value;
                          setFieldValue("term_id", termId);
                          fetchSubjectsComponents(values.class_id, termId, setFieldValue);
                        }}
                      >
                        <option value="">Select term</option>
                        {getTermsForClass(values.class_id).map((term) => (
                          <option key={term.id} value={term.id}>
                            {term.term_name}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage name="term_id" component="div" className="text-danger field-error" />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {subjectsComponents.length > 0 && (
        <div className="chfi-card ec-config mt-3">
          <div className="card-header">
            <div className="header-row">
              <div className="ec-header-title">
                <span className="header-icon">
                  <Icon icon="solar:book-bookmark-bold-duotone" width="16" />
                </span>
                <h5 className="card-title">Exam Configuration</h5>
              </div>
              <span className="ec-count-badge">
                {subjectsComponents.length} {subjectsComponents.length === 1 ? "Subject" : "Subjects"}
              </span>
            </div>
          </div>

          <div className="card-body">
            {successMsg && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {successMsg}
                <button type="button" className="btn-close" onClick={() => setSuccessMsg("")} />
              </div>
            )}

            <div className="ec-table-wrap">
              <table className="ec-table">
                <thead>
                  <tr>
                    <th className="ec-col-subject">Subject<span className="ec-required">*</span></th>
                    <th className="ec-col-grade">Grade<span className="ec-required">*</span></th>
                    <th className="ec-col-yesno">Is Separate Passing?<span className="ec-required">*</span></th>
                    <th className="ec-col-yesno">Is Include in Total<span className="ec-required">*</span></th>
                    <th className="ec-col-yesno">Mark/Grade<span className="ec-required">*</span></th>
                    <th className="ec-col-sequence">Sequence<span className="ec-required">*</span></th>
                    <th className="ec-col-marks">Formative | Summative<span className="ec-required">*</span></th>
                  </tr>
                </thead>
                <tbody>
                  {subjectsComponents.map((elem, index) => {
                    const totalMark = toNumber(elem.formative_total) + toNumber(elem.summative_total);
                    const totalPassing =
                      toNumber(elem.formative_passing) + toNumber(elem.summative_passing);

                    const numberInput = (field, variant) => (
                      <input
                        type="number"
                        min="0"
                        className={`ec-input ec-input--${variant}`}
                        value={elem[field] ?? ""}
                        onChange={(e) =>
                          updateSubjectField(index, field, toNumberOrEmpty(e.target.value))
                        }
                      />
                    );

                    const yesNoSelect = (field, onSelect = updateSubjectField) => (
                      <select
                        className="form-select ec-select"
                        value={elem[field] ?? ""}
                        onChange={(e) => onSelect(index, field, toNumberOrEmpty(e.target.value))}
                      >
                        <option value="">Select</option>
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </select>
                    );

                    return (
                      <tr key={`${elem.scheme_id}-${elem.subject_id}`}>
                        <td className="ec-col-subject">
                          <span className="ec-subject">
                            <span className="ec-subject-icon">
                              <Icon icon="solar:notebook-bold-duotone" width="16" />
                            </span>
                            {elem.subject}
                          </span>
                        </td>
                        <td className="ec-col-grade">
                          <select
                            className="form-select ec-select"
                            value={elem.grade_scale_id ?? ""}
                            onChange={(e) =>
                              handleRatioSourceChange(index, "grade_scale_id", toNumberOrEmpty(e.target.value))
                            }
                          >
                            <option value="">Select</option>
                            {gradeScales.map((scale) => (
                              <option key={scale.id} value={scale.id}>
                                {scale.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="ec-col-yesno">{yesNoSelect("is_separate_passing")}</td>
                        <td className="ec-col-yesno">{yesNoSelect("is_included_in_total")}</td>
                        <td className="ec-col-yesno">{yesNoSelect("mark_or_grade", handleRatioSourceChange)}</td>
                        <td className="ec-col-sequence">
                          <select
                            className="form-select ec-select"
                            value={elem.sequence ?? ""}
                            onChange={(e) =>
                              updateSubjectField(index, "sequence", toNumberOrEmpty(e.target.value))
                            }
                          >
                            <option value="">Select</option>
                            {Array.from(
                              { length: Math.max(subjectsComponents.length, Number(elem.sequence) || 0) },
                              (_, seqIndex) => (
                                <option key={seqIndex + 1} value={seqIndex + 1}>
                                  {seqIndex + 1}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                        <td className="ec-col-marks">
                          <div className="ec-marks-grid">
                            <span />
                            <span className="ec-marks-head ec-marks-head--formative">Formative</span>
                            <span />
                            <span className="ec-marks-head ec-marks-head--summative">Summative</span>
                            <span />
                            <span className="ec-marks-head ec-marks-head--total">Total</span>

                            <span className="ec-marks-label">Marks</span>
                            {numberInput("formative_total", "formative")}
                            <span className="ec-operator">+</span>
                            {numberInput("summative_total", "summative")}
                            <span className="ec-operator">=</span>
                            <input type="number" className="ec-input" value={totalMark} readOnly />

                            <span className="ec-marks-label">Passing</span>
                            {numberInput("formative_passing", "formative")}
                            <span className="ec-operator">+</span>
                            {numberInput("summative_passing", "summative")}
                            <span className="ec-operator">=</span>
                            <input type="number" className="ec-input" value={totalPassing} readOnly />

                            <span className="ec-marks-label">Ratio</span>
                            <input
                              type="number"
                              className="ec-input ec-input--ratio"
                              value={elem.formative_ratio ?? ""}
                              placeholder="—"
                              readOnly
                            />
                            <span />
                            <input
                              type="number"
                              className="ec-input ec-input--ratio"
                              value={elem.summative_ratio ?? ""}
                              placeholder="—"
                              readOnly
                            />
                            <span />
                            <span />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="chfi-root ec-actions">
              <button
                type="button"
                className="btn-submit"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                ) : (
                  <Icon icon="solar:diskette-bold-duotone" width="18" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <GenericTableDataLayer
        url={`${baseURL}/api/exam-configures`}
        pageName="Exam Configuration List"
        columns={[
          {data:"id",name:"id",title:"ID"},
          {data:"exam.examNameInfo.exam_name",name:"exam.examNameInfo.exam_name",title:"Exam"},
          {data:"classInfo.class_name",name:"classInfo.class_name",title:"Class"},
          {data:"termInfo.term_name",name:"termInfo.term_name",title:"Term"},
          {data:"subjectInfo.value",name:"subjectInfo.value",title:"Subject"},
          {data:"gradeScale.name",name:"gradeScale.name",title:"Grade Scale"},
          {data:"is_separate_passing",name:"is_separate_passing",title:"Is Separate Passing",render: (data) => {
            return data === true ? "Yes" : "No";
          }},
          {data:"is_included_in_total",name:"is_included_in_total",title:"Is Included in Total",render: (data) => {
            return data === true ? "Yes" : "No";
          }},
          {data:"mark_or_grade",name:"mark_or_grade",title:"Mark or Grade",render: (data) => {
            return data === true ? "Mark" : "Grade";
          }},
          
          {data:"formative_total",name:"formative_total",title:"Formative Total"},
          {data:"formative_passing",name:"formative_passing",title:"Formative Passing"},
          {data:"formative_ratio",name:"formative_ratio",title:"Formative Ratio"},
          {data:"summative_total",name:"summative_total",title:"Summative Total"},
          {data:"summative_passing",name:"summative_passing",title:"Summative Passing"},
          {data:"summative_ratio",name:"summative_ratio",title:"Summative Ratio"},
          {data:"total_mark",name:"total_mark",title:"Total Mark"},
          {data:"total_passing",name:"total_passing",title:"Total Passing"},
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Exam Configuration">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Exam Configuration">Delete</button>
                </div>
              `;
            },
          },
         
          

        ]}
        onEdit={handleEdit}
       onDelete={handleDelete}
       
       
      />
    </div>
  );
};

export default Examconfiguration;
