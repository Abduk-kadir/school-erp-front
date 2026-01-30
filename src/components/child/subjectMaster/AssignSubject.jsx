import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { PlusCircle, Trash } from "@phosphor-icons/react";
import baseURL from "../../../utils/baseUrl";
import axios from "axios";

const AssignSubject = () => {
    const [classes, setClasses] = useState([]);
    const [sujects, setSubjects] = useState([])
    const [programs, setPrograms] = useState([])
    const [semester, setSemester] = useState([1, 2, 3, 4, 5, 6])

    const initialValues = {
        batch: "",
        class_id: "",
        program_id:"",
        semester: "",
        is_optional: "",
        is_multiple_choice: "",
        optional_subject: [{}],
        compulsory_subject: [{}],

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
                const res = await axios.get(`${baseURL}/api/subjects`)
                const res2 = await axios.get(`${baseURL}/api/programs`)
                setClasses(data?.data || []);
                setSubjects(res?.data?.data || [])
                setPrograms(res2?.data?.data || [])
            } catch (err) {
                console.error("Failed to load classes", err);
            }
        }
        fetchData();
    }, []);
    //console.log('subject is:', sujects)
    return (
        <div className="container mt-5 mb-5">
            <h3 className="mb-4">Assign Subject</h3>

            <Formik
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                    let arr=[]
                    arr=values.compulsory_subject.map(elem=>{
                        return {
                            batch:values.batch,
                            classId:values.class_id,
                            programId:values.program_id,
                            semester:values.semester,
                            isCompulsory:true,
                            subjectId:elem.compulsory_subject
                        }
                    })
                    console.log('values is:', values)
                    console.log('finaldata:',arr)
                    await axios.post(`${baseURL}/api/program-subjects/bulk`, arr)
                    resetForm()
                    arr=[]
                     alert("Form submitted successfully!");

                }}
            >
                {({ isSubmitting, values }) => (
                    <Form>
                        <div className="row g-3">

                            <div className="col-md-3">
                                <label className="form-label">Batch</label>
                                <Field name="batch" className="form-control" />
                                <ErrorMessage name="batch" component="div" className="text-danger small mt-1" />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Class</label>
                                <Field as="select" name="class_id" className="form-select">
                                    <option value="">Select class</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.class_name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="class_id" component="div" className="text-danger small mt-1" />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Program</label>
                                <Field
                                    as="select"
                                    name='program_id'
                                    className="form-select"
                                >
                                    <option value="">Select Program</option>
                                    {programs.map((prog) => (
                                        <option key={prog.id} value={prog.id}>
                                            {prog.program_name}
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            <div className="col-md-3">
                                 <label className="form-label">Select Semester</label>
                                <Field
                                    as="select"
                                    name='semester'
                                    className="form-select"
                                >
                                    <option value="">Semester</option>
                                    {semester.map((sem) => (
                                        <option key={sem} value={sem}>
                                            {sem}
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            {values?.subject_pattern == 'Semester' && <div className="col-md-4">
                                <label className="form-label">Semester</label>
                                <Field as="select" name="subject_pattern" className="form-select">
                                    <option value="">Select semester</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                </Field>
                                <ErrorMessage name="semester" component="div" className="text-danger small mt-1" />
                            </div>}
                            <div className="col-md-12">
                                <label className="form-label">Complusary Subject</label>

                                <FieldArray name="compulsory_subject">
                                    {({ push, remove }) => (
                                        <div className="row g-2 border">
                                            {values.compulsory_subject.map((_, index) => (
                                                <div key={index} className="position-relative col-4">
                                                    <Field
                                                        as="select"
                                                        name={`compulsory_subject.${index}.compulsory_subject`}
                                                        className="form-select pe-5"
                                                    >
                                                        <option value="">Select Subject</option>
                                                        {sujects.map((sub) => (
                                                            <option key={sub.id} value={sub.id}>
                                                                {sub.value}
                                                            </option>
                                                        ))}
                                                    </Field>

                                                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3 d-flex gap-2">
                                                        {index === values.compulsory_subject.length - 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-link text-success p-0"
                                                                onClick={() => push({ compulsory_subject: "" })}
                                                            >
                                                                <PlusCircle size={22} />
                                                            </button>
                                                        )}

                                                        {values.compulsory_subject.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-link text-danger p-0"
                                                                onClick={() => remove(index)}
                                                            >
                                                                <Trash size={22} />
                                                            </button>
                                                        )}
                                                    </div>


                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>

                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Is Optional</label>
                                <Field as="select" name="is_optional" className="form-select">
                                    <option value="">Is Optional</option>
                                    <option value="Yes">Yes</option>
                                    <option value="NO">NO</option>
                                </Field>
                                <ErrorMessage name="subject_pattern" component="div" className="text-danger small mt-1" />
                            </div>
                            {values?.is_optional == 'Yes' && <div className="col-md-4">
                                <label className="form-label">Select number of optional Subject</label>
                                <Field as="select" name="is_multiple_choice" className="form-select">
                                    <option value="">Number of Optional</option>
                                    <option value="Yes">1</option>
                                    <option value="NO">2</option>
                                    <option value="Yes">3</option>
                                    <option value="NO">4</option>
                                </Field>
                                <ErrorMessage name="subject_pattern" component="div" className="text-danger small mt-1" />
                            </div>}
                            {
                                values?.is_optional == 'Yes' && <div className="col-md-12">
                                    <label className="form-label">Optional Subject</label>

                                    <FieldArray name="optional_subject">
                                        {({ push, remove }) => (
                                            <div className="row g-2 border">
                                                {values.optional_subject.map((_, index) => (
                                                    <div key={index} className="position-relative col-4">
                                                        <Field
                                                            as="select"
                                                            name={`optional_subject.${index}.optional_subject`}
                                                            className="form-select pe-5"
                                                        >
                                                            <option value="">Optional Subject</option>
                                                            {sujects.map((sub) => (
                                                                <option key={sub.id} value={sub.value}>
                                                                    {sub.value}
                                                                </option>
                                                            ))}
                                                        </Field>


                                                        <div className="position-absolute top-50 end-0 translate-middle-y pe-3 d-flex gap-2">
                                                            {index === values.optional_subject.length - 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-link text-success p-0"
                                                                    onClick={() => push({ optional_subject: "" })}
                                                                >
                                                                    <PlusCircle size={22} />
                                                                </button>
                                                            )}

                                                            {values.optional_subject.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-link text-danger p-0"
                                                                    onClick={() => remove(index)}
                                                                >
                                                                    <Trash size={22} />
                                                                </button>
                                                            )}
                                                        </div>


                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </FieldArray>

                                </div>
                            }



                        </div>


                        {/* ── Compulsory Subjects ──────────────────────────────────── */}


                        <div className="d-flex justify-content-end mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary px-5"
                                disabled={isSubmitting}
                            >
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AssignSubject;