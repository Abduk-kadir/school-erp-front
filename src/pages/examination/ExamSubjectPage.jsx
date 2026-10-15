import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../utils/baseUrl";
import axios from "axios";
import "../../assets/css/mastercom.css";
import "../../assets/css/academicOfflineFeeReport.css";

const ExamSubjectPage = () => {
  const [exams, setExams] = useState([]);
  const [examSchemes, setExamSchemes] = useState([]);
  const [loadingExamDetail, setLoadingExamDetail] = useState(false);
  const examRequestRef = useRef(0);
  const examSchemeRequestRef = useRef(0);
  const [loadingExamScheme, setLoadingExamScheme] = useState(false);
  const [classSubjects, setClassSubjects] = useState([]);
  const [loadingClassSubjects, setLoadingClassSubjects] = useState(false);
  const classSubjectsRequestRef = useRef(0);
  const [sequenceOptions] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [components, setComponents] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submittingKey, setSubmittingKey] = useState(null);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const assessmentsRequestRef = useRef(0);
  const groupKeyRef = useRef(0);

  const initialValues = {
    exam_id: "",
    term_id: "",
    class_id: "",
    exam_scheme_id: "",
    is_optional: "",
    compulsory_subject: [{}],
    optional_groups: [],
  };

  const validationSchema = Yup.object({
    exam_id: Yup.string().required("Exam is required"),
    term_id: Yup.string().required("Term is required"),
    class_id: Yup.string().required("Class is required"),
  });

  const toFieldValue = (value) => (value == null ? "" : String(value));

  const createGroup = (subjectId) => ({
    _key: `new-${++groupKeyRef.current}`,
    id: null,
    subject_id: String(subjectId),
    component_id: "",
    marks: "",
    sequence: "",
    sub_components: [],
  });

  const mapAssessmentToGroup = (assessment) => ({
    _key: `saved-${assessment.id}`,
    id: assessment.id,
    code: assessment.code ?? null,
    subject_id: toFieldValue(assessment.subject_id),
    component_id: toFieldValue(assessment.component_id),
    marks: toFieldValue(assessment.max_marks),
    sequence: toFieldValue(assessment.sequence),
    sub_components: (assessment.assesmentcomponent || []).map((sub) => ({
      id: sub.id,
      sub_component_id: toFieldValue(sub.component_id),
      marks: toFieldValue(sub.max_marks),
      sequence: toFieldValue(sub.sequence),
    })),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`${baseURL}/api/exam-names`, {
          params: { start: 0, length: 1000 },
        });
        await axios.get(`${baseURL}/api/elective-baskets`);
        const componentsRes = await axios.get(`${baseURL}/api/components`, {
          params: { start: 0, length: 1000 },
        });
        setExams(data?.data || []);
        setComponents(componentsRes?.data?.data || []);
      } catch (err) {
        console.error("Failed to load exams", err);
      }
    }
    fetchData();
  }, []);

  const handleExamChange = async (examId, setFieldValue) => {
    const requestId = ++examRequestRef.current;
    setFieldValue("exam_id", examId);
    setFieldValue("term_id", "");
    setFieldValue("class_id", "");
    setExamSchemes([]);
    fetchExamSchemeId("", "", "", setFieldValue);
    fetchClassSubjects("", setFieldValue);
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
      }
    } finally {
      if (requestId === examRequestRef.current) {
        setLoadingExamDetail(false);
      }
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

  const fetchSchemeAssessments = async (schemeId, setFieldValue) => {
    const requestId = ++assessmentsRequestRef.current;
    setLoadingAssessments(true);
    try {
      const { data } = await axios.get(`${baseURL}/api/exam-assessments/scheme/${schemeId}`);
      if (requestId !== assessmentsRequestRef.current) return;
      const saved = Array.isArray(data?.data) ? data.data : [];
      const savedGroups = saved.map(mapAssessmentToGroup);
      const emptyGroups = classSubjects
        .filter((sub) => !savedGroups.some((g) => g.subject_id === String(sub.id)))
        .map((sub) => createGroup(sub.id));
      setFieldValue("optional_groups", [...savedGroups, ...emptyGroups]);
    } catch (err) {
      if (requestId === assessmentsRequestRef.current) {
        console.error("Failed to load saved assessments", err);
      }
    } finally {
      if (requestId === assessmentsRequestRef.current) {
        setLoadingAssessments(false);
      }
    }
  };

  const fetchExamSchemeId = async (examId, classId, termId, setFieldValue) => {
    const requestId = ++examSchemeRequestRef.current;
    ++assessmentsRequestRef.current;
    setLoadingAssessments(false);
    setFieldValue("exam_scheme_id", "");
    if (!examId || !classId || !termId) {
      setLoadingExamScheme(false);
      return;
    }

    setLoadingExamScheme(true);
    try {
      const { data } = await axios.get(
        `${baseURL}/api/exam-schemes/exam-name/${examId}/class/${classId}/term/${termId}`
      );
      if (requestId !== examSchemeRequestRef.current) return;
      const schemeId = data?.data?.id;
      setFieldValue("exam_scheme_id", schemeId != null ? String(schemeId) : "");
      if (schemeId != null) fetchSchemeAssessments(schemeId, setFieldValue);
    } catch (err) {
      if (requestId === examSchemeRequestRef.current) {
        console.error("Failed to load exam scheme", err);
      }
    } finally {
      if (requestId === examSchemeRequestRef.current) {
        setLoadingExamScheme(false);
      }
    }
  };

  const toNumberOrNull = (value) => (value === "" || value == null ? null : Number(value));

  const buildAssessmentPayload = (values, group) => ({
      exam_scheme_id: Number(values.exam_scheme_id),
      subject_id: Number(group.subject_id),
      component_id: Number(group.component_id),
      max_marks: toNumberOrNull(group.marks),
      sequence: toNumberOrNull(group.sequence),
      ...(group.code != null ? { code: group.code } : {}),
      assesmentcomponent: group.sub_components.map((sub) => ({
        ...(sub.id != null ? { id: sub.id } : {}),
        component_id: Number(sub.sub_component_id),
        max_marks: toNumberOrNull(sub.marks),
        sequence: toNumberOrNull(sub.sequence),
      })),
  });

  const handleSubjectSubmit = async (values, subject, heads, setFieldValue) => {
    setSuccessMsg("");
    setErrorMsg("");

    if (!values.exam_scheme_id) {
      setErrorMsg("Select exam, class and term before submitting.");
      return;
    }
    if (!heads.length) {
      setErrorMsg(`Add at least one head for ${subject.name}.`);
      return;
    }
    const missingHead = heads.findIndex(({ group }) => !group.component_id);
    if (missingHead !== -1) {
      setErrorMsg(`Select a head for Head ${missingHead + 1} in ${subject.name}.`);
      return;
    }
    const missingSubHead = heads.findIndex(({ group }) =>
      group.sub_components.some((sub) => !sub.sub_component_id)
    );
    if (missingSubHead !== -1) {
      setErrorMsg(`Select a sub head for every sub head row in Head ${missingSubHead + 1} of ${subject.name}.`);
      return;
    }

    const token = localStorage.getItem("token");
    const config = { headers: token ? { Authorization: `Bearer ${token}` } : {} };
    const failures = [];

    setSubmittingKey(String(subject.id));
    try {
      for (const [headIndex, { group, groupIndex }] of heads.entries()) {
        const payload = buildAssessmentPayload(values, group);
        try {
          const { data } =
            group.id != null
              ? await axios.put(`${baseURL}/api/exam-assessments/${group.id}`, payload, config)
              : await axios.post(`${baseURL}/api/exam-assessments`, payload, config);

          const saved = data?.data;
          if (saved && !Array.isArray(saved) && saved.id != null) {
            setFieldValue(`optional_groups.${groupIndex}.id`, saved.id);
            const savedSubs = saved.assesmentcomponent;
            if (Array.isArray(savedSubs) && savedSubs.length === group.sub_components.length) {
              savedSubs.forEach((sub, subIndex) => {
                setFieldValue(`optional_groups.${groupIndex}.sub_components.${subIndex}.id`, sub.id);
              });
            }
          }
        } catch (err) {
          failures.push(
            `Head ${headIndex + 1}: ${err.response?.data?.message || err.message || "Failed to save"}`
          );
        }
      }

      if (failures.length) {
        setErrorMsg(`${subject.name} - ${failures.join("; ")}`);
      }
      if (failures.length < heads.length) {
        setSuccessMsg(
          `${subject.name}: ${heads.length - failures.length} of ${heads.length} head(s) saved successfully!`
        );
      }
    } finally {
      setSubmittingKey(null);
    }
  };

  const fetchClassSubjects = async (classId, setFieldValue) => {
    const requestId = ++classSubjectsRequestRef.current;
    setClassSubjects([]);
    setFieldValue("optional_groups", []);
    if (!classId) {
      setLoadingClassSubjects(false);
      return;
    }

    setLoadingClassSubjects(true);
    try {
      const { data } = await axios.get(`${baseURL}/api/program-subjects`, {
        params: { classId },
      });
      if (requestId !== classSubjectsRequestRef.current) return;

      // The same subject can be mapped to the class more than once (per program/semester).
      const unique = new Map();
      (data?.data || []).forEach((item) => {
        const id = item?.subject?.id ?? item?.subjectId;
        if (id != null && !unique.has(id)) {
          unique.set(id, { id, name: item?.subject?.value || `Subject ${id}` });
        }
      });
      const subjects = Array.from(unique.values());
      setClassSubjects(subjects);
      setFieldValue("optional_groups", subjects.map((sub) => createGroup(sub.id)));
    } catch (err) {
      if (requestId === classSubjectsRequestRef.current) {
        console.error("Failed to load class subjects", err);
      }
    } finally {
      if (requestId === classSubjectsRequestRef.current) {
        setLoadingClassSubjects(false);
      }
    }
  };

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:bookmark-square-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Assign Subject</h5>
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

          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              setSuccessMsg("");
              setErrorMsg("");
            
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="chfi-root assign-subject-form">
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
                          fetchExamSchemeId("", "", "", setFieldValue);
                          fetchClassSubjects(classId, setFieldValue);
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
                        disabled={!values.class_id || loadingExamDetail || loadingClassSubjects}
                        onChange={(e) => {
                          const termId = e.target.value;
                          setFieldValue("term_id", termId);
                          fetchExamSchemeId(values.exam_id, values.class_id, termId, setFieldValue);
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

                  {values?.subject_pattern == "Semester" && (
                    <div className="col-md-4">
                      <label className="form-label">
                        <span className="label-dot" />
                        Semester Pattern
                      </label>
                      <div className="icon-field">
                        <span className="icon">
                          <Icon icon="solar:hashtag-square-bold-duotone" width="18" />
                        </span>
                        <Field as="select" name="subject_pattern" className="form-select">
                          <option value="">Select semester</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </Field>
                      </div>
                      <ErrorMessage name="semester" component="div" className="text-danger field-error" />
                    </div>
                  )}

                  

                 

                
                    <div className="col-md-12">
                      <FieldArray name="optional_groups">
                        {({ push: pushGroup, remove: removeGroup }) => {
                          if (!values.class_id) {
                            return <div className="text-muted small">Select a class to load subjects.</div>;
                          }
                          if (loadingClassSubjects) {
                            return <div className="text-muted small">Loading subjects...</div>;
                          }
                          if (loadingAssessments) {
                            return <div className="text-muted small">Loading saved assessments...</div>;
                          }
                          if (!classSubjects.length) {
                            return <div className="text-muted small">No subjects found for this class.</div>;
                          }

                          const subjectList = [...classSubjects];
                          values.optional_groups.forEach((g) => {
                            if (!subjectList.some((sub) => String(sub.id) === String(g.subject_id))) {
                              subjectList.push({ id: g.subject_id, name: `Subject ${g.subject_id}` });
                            }
                          });

                          return (
                          <div className="d-flex flex-column gap-3">
                            {subjectList.map((subject) => {
                              const heads = values.optional_groups
                                .map((group, groupIndex) => ({ group, groupIndex }))
                                .filter(({ group }) => String(group.subject_id) === String(subject.id));

                              return (
                              <div key={subject.id} className="as-section as-optional-group">
                                <div className="as-section-title justify-content-between">
                                  <span className="d-inline-flex align-items-center gap-2">
                                    <Icon icon="solar:book-2-bold-duotone" width="18" />
                                    {subject.name}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn btn-submit as-head-btn"
                                    onClick={() => pushGroup(createGroup(subject.id))}
                                  >
                                    <Icon icon="solar:add-circle-bold-duotone" width="14" />
                                    Add Head
                                  </button>
                                </div>

                                <div className="d-flex flex-column gap-3">
                                {!heads.length && (
                                  <div className="text-muted small">No head added. Click "Add Head".</div>
                                )}
                                {heads.map(({ group, groupIndex }, headIndex) => (
                                <div key={group._key} className="as-head-box">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="as-head-box-title">Head {headIndex + 1}</span>
                                  <button
                                    type="button"
                                    className="btn btn-reset text-danger border-danger as-head-btn"
                                    onClick={() => removeGroup(groupIndex)}
                                  >
                                    <Icon icon="solar:trash-bin-trash-bold-duotone" width="14" />
                                    Delete Head
                                  </button>
                                </div>

                                <div className="row g-3">
                                  <div className="col-md-4">
                                    <label className="form-label">
                                      <span className="label-dot" />
                                      Head
                                    </label>
                                    <div className="icon-field">
                                      <span className="icon">
                                        <Icon icon="solar:notebook-bookmark-bold-duotone" width="18" />
                                      </span>
                                      <Field
                                        as="select"
                                        name={`optional_groups.${groupIndex}.component_id`}
                                        className="form-select"
                                      >
                                        <option value="">Select Head</option>
                                        {components.map((component) => (
                                          <option key={component.id} value={component.id}>
                                            {component.component_name}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                  </div>

                                  <div className="col-md-4">
                                    <label className="form-label">
                                      <span className="label-dot" />
                                      Marks
                                    </label>
                                    <div className="icon-field">
                                      <span className="icon">
                                        <Icon icon="solar:medal-ribbon-bold-duotone" width="18" />
                                      </span>
                                      <Field
                                        type="number"
                                        min="0"
                                        name={`optional_groups.${groupIndex}.marks`}
                                        className="form-control"
                                        placeholder="Enter marks"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-md-4">
                                    <label className="form-label">
                                      <span className="label-dot" />
                                      Order
                                    </label>
                                    <div className="icon-field">
                                      <span className="icon">
                                        <Icon icon="solar:hashtag-square-bold-duotone" width="18" />
                                      </span>
                                      <Field
                                        as="select"
                                        name={`optional_groups.${groupIndex}.sequence`}
                                        className="form-select"
                                      >
                                        <option value="">Select Order</option>
                                        {sequenceOptions.map((elem) => (
                                          <option key={elem} value={elem}>
                                            {elem}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                  </div>

                                  <div className="col-md-12">
                                    <FieldArray
                                      name={`optional_groups.${groupIndex}.sub_components`}
                                    >
                                      {({ push, remove }) => (
                                        <div className="as-subhead-box d-flex flex-column gap-3">
                                          {(group.sub_components || []).map((_, index) => (
                                            <div key={index} className="row g-3 align-items-end">
                                              <div className="col-md-4">
                                                <label className="form-label">
                                                  <span className="label-dot" />
                                                  Sub Head {index + 1}
                                                </label>
                                                <div className="icon-field">
                                                  <span className="icon">
                                                    <Icon icon="solar:notebook-bookmark-bold-duotone" width="18" />
                                                  </span>
                                                  <Field
                                                    as="select"
                                                    name={`optional_groups.${groupIndex}.sub_components.${index}.sub_component_id`}
                                                    className="form-select"
                                                  >
                                                    <option value="">Select Sub Head</option>
                                                    {components.map((component) => (
                                                      <option key={component.id} value={component.id}>
                                                        {component.component_name}
                                                      </option>
                                                    ))}
                                                  </Field>
                                                </div>
                                              </div>

                                              <div className="col-md-3">
                                                <label className="form-label">
                                                  <span className="label-dot" />
                                                  Sub Head Marks
                                                </label>
                                                <div className="icon-field">
                                                  <span className="icon">
                                                    <Icon icon="solar:medal-ribbon-bold-duotone" width="18" />
                                                  </span>
                                                  <Field
                                                    type="number"
                                                    min="0"
                                                    name={`optional_groups.${groupIndex}.sub_components.${index}.marks`}
                                                    className="form-control"
                                                    placeholder="Enter marks"
                                                  />
                                                </div>
                                              </div>

                                              <div className="col-md-3">
                                                <label className="form-label">
                                                  <span className="label-dot" />
                                                  Sub Head Order
                                                </label>
                                                <div className="icon-field">
                                                  <span className="icon">
                                                    <Icon icon="solar:hashtag-square-bold-duotone" width="18" />
                                                  </span>
                                                  <Field
                                                    as="select"
                                                    name={`optional_groups.${groupIndex}.sub_components.${index}.sequence`}
                                                    className="form-select"
                                                  >
                                                    <option value="">Select Order</option>
                                                    {sequenceOptions.map((elem) => (
                                                      <option key={elem} value={elem}>
                                                        {elem}
                                                      </option>
                                                    ))}
                                                  </Field>
                                                </div>
                                              </div>

                                              <div className="col-md-2">
                                                <button
                                                  type="button"
                                                  className="btn btn-reset text-danger border-danger as-head-btn mb-1"
                                                  onClick={() => remove(index)}
                                                >
                                                  <Icon icon="solar:trash-bin-trash-bold-duotone" width="14" />
                                                  Delete Sub Head
                                                </button>
                                              </div>
                                            </div>
                                          ))}

                                          <div>
                                            <button
                                              type="button"
                                              className="btn btn-submit as-head-btn"
                                              onClick={() =>
                                                push({ sub_component_id: "", marks: "", sequence: "" })
                                              }
                                            >
                                              <Icon icon="solar:add-circle-bold-duotone" width="14" />
                                              Add Sub Head
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </FieldArray>
                                  </div>
                                </div>

                                </div>
                                ))}
                                </div>

                                <div className="d-flex justify-content-end mt-3">
                                  <button
                                    type="button"
                                    className="btn btn-submit"
                                    disabled={
                                      loadingExamScheme ||
                                      !heads.length ||
                                      submittingKey === String(subject.id)
                                    }
                                    onClick={() => handleSubjectSubmit(values, subject, heads, setFieldValue)}
                                  >
                                    {submittingKey === String(subject.id) ? (
                                      <>
                                        <Icon icon="line-md:loading-loop" width="16" />
                                        Submitting...
                                      </>
                                    ) : (
                                      <>
                                        <Icon icon="solar:check-circle-bold-duotone" width="18" />
                                        {heads.length && heads.every(({ group }) => group.id != null)
                                          ? "Update"
                                          : "Submit"}
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                              );
                            })}
                          </div>
                          );
                        }}
                      </FieldArray>
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

export default ExamSubjectPage;
