import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import axios from "axios";
import "../../../assets/css/mastercom.css";
import "../../../assets/css/academicOfflineFeeReport.css";

const AssignSubject = () => {
  const [classes, setClasses] = useState([]);
  const [sujects, setSubjects] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [electiveBasket] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [studentTypesArr, setStudentTypesArr] = useState([]);
  const [semester, setSemester] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const initialValues = {
    batch: "",
    class_id: "",
    program_id: "",
    semester: "",
    is_optional: "",
    compulsory_subject: [{}],
    optional_groups: [
      {
        studenttype: "",
        no_of_optional: "",
        optional_subject: [{}],
      },
    ],
  };

  const validationSchema = Yup.object({
    batch: Yup.string().required("Batch is required"),
    class_id: Yup.string().required("Class is required"),
    subject_pattern: Yup.string().required("Subject pattern is required"),
    semester: Yup.string().required("semester is required"),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`${baseURL}/api/classes`);
        const res = await axios.get(`${baseURL}/api/subjects`);
        const res2 = await axios.get(`${baseURL}/api/programs`);
        await axios.get(`${baseURL}/api/elective-baskets`);
        const res4 = await axios.get(`${baseURL}/api/semesters`);
        const res5 = await axios.get(`${baseURL}/api/studenttypes`);
        setClasses(data?.data || []);
        setSubjects(res?.data?.data || []);
        setPrograms(res2?.data?.data || []);
        setSemester(res4?.data?.data || []);
        setStudentTypesArr(res5?.data?.data || []);
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    }
    fetchData();
  }, []);

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
              try {
                let arr = [];
                let firstelem = values.compulsory_subject[0];
                if (firstelem?.compulsory_subject) {
                  values.compulsory_subject.map((elem) => {
                    arr.push({
                      batch: values.batch,
                      classId: Number(values.class_id) || null,
                      programId: Number(values.program_id) || null,
                      semester: Number(values.semester) || null,
                      isCompulsory: true,
                      subjectId: Number(elem.compulsory_subject),
                    });
                  });
                }
                if (values.is_optional === "Yes") {
                  for (const group of values.optional_groups || []) {
                    const elective = {
                      classId: Number(values.class_id) || null,
                      semester: Number(values.semester) || null,
                      exactChoices: Number(group.no_of_optional) || null,
                      studenttype: group.studenttype || null,
                    };
                    const { data } = await axios.post(
                      `${baseURL}/api/elective-baskets`,
                      elective
                    );
                    const id = data?.data?.id;
                    (group.optional_subject || []).forEach((elem) => {
                      if (!elem?.optional_subject) return;
                      arr.push({
                        batch: values.batch,
                        classId: values.class_id,
                        programId: values.program_id?values.program_id:null,
                        semester: values.semester,
                        isCompulsory: false,
                        subjectId: elem.optional_subject,
                        basketId: id,
                      });
                    });
                  }
                }
                await axios.post(`${baseURL}/api/program-subjects/bulk`, {
                  arr: arr,
                });
                resetForm();
                setSuccessMsg("Subjects assigned successfully!");
              } catch (error) {
                setErrorMsg(
                  error.response?.data?.message || "Something went wrong"
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, values }) => (
              <Form className="chfi-root assign-subject-form">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">
                      <span className="label-dot" />
                      Batch
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:calendar-bold-duotone" width="18" />
                      </span>
                      <Field name="batch" className="form-control" placeholder="Enter batch" />
                    </div>
                    <ErrorMessage name="batch" component="div" className="text-danger field-error" />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">
                      <span className="label-dot" />
                      Class
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:square-academic-cap-bold-duotone" width="18" />
                      </span>
                      <Field as="select" name="class_id" className="form-select">
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

                  <div className="col-md-3">
                    <label className="form-label">
                      <span className="label-dot" />
                      Program
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:notebook-bookmark-bold-duotone" width="18" />
                      </span>
                      <Field as="select" name="program_id" className="form-select">
                        <option value="">Select Program</option>
                        {programs.map((prog) => (
                          <option key={prog.id} value={prog.id}>
                            {prog.program_name}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">
                      <span className="label-dot" />
                      Semester
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:layers-bold-duotone" width="18" />
                      </span>
                      <Field as="select" name="semester" className="form-select">
                        <option value="">Semester</option>
                        {semester.map((sem) => (
                          <option key={sem.id} value={sem.id}>
                            {sem.semester}
                          </option>
                        ))}
                      </Field>
                    </div>
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
                    <div className="as-section">
                      <div className="as-section-title">
                        <Icon icon="solar:checklist-minimalistic-bold-duotone" width="18" />
                        Compulsory Subject
                      </div>
                      <FieldArray name="compulsory_subject">
                        {({ push, remove }) => (
                          <div className="row g-2">
                            {values.compulsory_subject.map((_, index) => (
                              <div key={index} className="col-md-4">
                                <div className="as-field-with-actions">
                                  <div className="icon-field">
                                    <span className="icon">
                                      <Icon icon="solar:book-bold-duotone" width="18" />
                                    </span>
                                    <Field
                                      as="select"
                                      name={`compulsory_subject.${index}.compulsory_subject`}
                                      className="form-select"
                                    >
                                      <option value="">Select Subject</option>
                                      {sujects.map((sub) => (
                                        <option key={sub.id} value={sub.id}>
                                          {sub.value}
                                        </option>
                                      ))}
                                    </Field>
                                  </div>
                                  <div className="as-row-actions">
                                    {index === values.compulsory_subject.length - 1 && (
                                      <button
                                        type="button"
                                        className="as-icon-btn as-icon-add"
                                        onClick={() => push({ compulsory_subject: "" })}
                                        title="Add subject"
                                      >
                                        <Icon icon="solar:add-circle-bold-duotone" width="22" />
                                      </button>
                                    )}
                                    {values.compulsory_subject.length > 1 && (
                                      <button
                                        type="button"
                                        className="as-icon-btn as-icon-remove"
                                        onClick={() => remove(index)}
                                        title="Remove subject"
                                      >
                                        <Icon icon="solar:trash-bin-trash-bold-duotone" width="20" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      <span className="label-dot" />
                      Is Optional
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:question-circle-bold-duotone" width="18" />
                      </span>
                      <Field as="select" name="is_optional" className="form-select">
                        <option value="">Is Optional</option>
                        <option value="Yes">Yes</option>
                        <option value="NO">NO</option>
                      </Field>
                    </div>
                  </div>

                  {values?.is_optional == "Yes" && (
                    <div className="col-md-12">
                      <FieldArray name="optional_groups">
                        {({ push: pushGroup, remove: removeGroup }) => (
                          <div className="d-flex flex-column gap-3">
                            {values.optional_groups.map((group, groupIndex) => (
                              <div key={groupIndex} className="as-section as-optional-group">
                                <div className="as-section-title justify-content-between">
                                  <span className="d-inline-flex align-items-center gap-2">
                                    <Icon icon="solar:widget-bold-duotone" width="18" />
                                    Optional Subject Group {groupIndex + 1}
                                  </span>
                                  <div className="d-flex gap-2">
                                    {groupIndex === values.optional_groups.length - 1 && (
                                      <button
                                        type="button"
                                        className="as-icon-btn as-icon-add"
                                        title="Add optional group"
                                        onClick={() =>
                                          pushGroup({
                                            studenttype: "",
                                            no_of_optional: "",
                                            optional_subject: [{}],
                                          })
                                        }
                                      >
                                        <Icon icon="solar:add-circle-bold-duotone" width="24" />
                                      </button>
                                    )}
                                    {values.optional_groups.length > 1 && (
                                      <button
                                        type="button"
                                        className="as-icon-btn as-icon-remove"
                                        title="Remove optional group"
                                        onClick={() => removeGroup(groupIndex)}
                                      >
                                        <Icon icon="solar:trash-bin-trash-bold-duotone" width="22" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="row g-3">
                                  <div className="col-md-6">
                                    <label className="form-label">
                                      <span className="label-dot" />
                                      Student Type
                                    </label>
                                    <div className="icon-field">
                                      <span className="icon">
                                        <Icon icon="solar:users-group-rounded-bold-duotone" width="18" />
                                      </span>
                                      <Field
                                        as="select"
                                        name={`optional_groups.${groupIndex}.studenttype`}
                                        className="form-select"
                                      >
                                        <option value="">Select</option>
                                        {studentTypesArr.map((elem) => (
                                          <option key={elem.id} value={elem.id}>
                                            {elem.studenttype}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <label className="form-label">
                                      <span className="label-dot" />
                                      Number of Optional Subject
                                    </label>
                                    <div className="icon-field">
                                      <span className="icon">
                                        <Icon icon="solar:hashtag-square-bold-duotone" width="18" />
                                      </span>
                                      <Field
                                        as="select"
                                        name={`optional_groups.${groupIndex}.no_of_optional`}
                                        className="form-select"
                                      >
                                        <option value="">Select</option>
                                        {electiveBasket.map((elem) => (
                                          <option key={elem} value={elem}>
                                            {elem}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                  </div>

                                  <div className="col-md-12">
                                    <label className="form-label">
                                      <span className="label-dot" />
                                      Optional Subject
                                    </label>
                                    <FieldArray
                                      name={`optional_groups.${groupIndex}.optional_subject`}
                                    >
                                      {({ push, remove }) => (
                                        <div className="row g-2">
                                          {(group.optional_subject || []).map((_, index) => (
                                            <div key={index} className="col-md-4">
                                              <div className="as-field-with-actions">
                                                <div className="icon-field">
                                                  <span className="icon">
                                                    <Icon icon="solar:book-2-bold-duotone" width="18" />
                                                  </span>
                                                  <Field
                                                    as="select"
                                                    name={`optional_groups.${groupIndex}.optional_subject.${index}.optional_subject`}
                                                    className="form-select"
                                                  >
                                                    <option value="">Optional Subject</option>
                                                    {sujects.map((sub) => (
                                                      <option key={sub.id} value={sub.id}>
                                                        {sub.value}
                                                      </option>
                                                    ))}
                                                  </Field>
                                                </div>
                                                <div className="as-row-actions">
                                                  {index ===
                                                    (group.optional_subject?.length || 0) - 1 && (
                                                    <button
                                                      type="button"
                                                      className="as-icon-btn as-icon-add"
                                                      onClick={() =>
                                                        push({ optional_subject: "" })
                                                      }
                                                    >
                                                      <Icon
                                                        icon="solar:add-circle-bold-duotone"
                                                        width="22"
                                                      />
                                                    </button>
                                                  )}
                                                  {(group.optional_subject?.length || 0) > 1 && (
                                                    <button
                                                      type="button"
                                                      className="as-icon-btn as-icon-remove"
                                                      onClick={() => remove(index)}
                                                    >
                                                      <Icon
                                                        icon="solar:trash-bin-trash-bold-duotone"
                                                        width="20"
                                                      />
                                                    </button>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </FieldArray>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  )}
                </div>

                <div className="actions mt-4">
                  <button
                    type="submit"
                    className="btn btn-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Icon icon="line-md:loading-loop" width="16" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Icon icon="solar:check-circle-bold-duotone" width="18" />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AssignSubject;
