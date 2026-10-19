import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../utils/baseUrl";
import axios from "axios";
import "../../assets/css/mastercom.css";

const Examconfiguration = () => {
  const [exams, setExams] = useState([]);
  const [examSchemes, setExamSchemes] = useState([]);
  const [subjectsComponents, setSubjectsComponents] = useState([]);
  const [loadingExamDetail, setLoadingExamDetail] = useState(false);
  const [loadingSubjectsComponents, setLoadingSubjectsComponents] = useState(false);
  const examRequestRef = useRef(0);
  const subjectsComponentsRequestRef = useRef(0);
  const [errorMsg, setErrorMsg] = useState("");

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
      const { data } = await axios.get(
        `${baseURL}/api/exam-schemes/${schemeId}/class/${classId}/term/${termId}/subjects-components`
      );
      if (requestId !== subjectsComponentsRequestRef.current) return;
      setSubjectsComponents(Array.isArray(data?.data) ? data.data : []);
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

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:settings-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Exam Configuration</h5>
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

          <Formik initialValues={initialValues} onSubmit={() => {}}>
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
    </div>
  );
};

export default Examconfiguration;
