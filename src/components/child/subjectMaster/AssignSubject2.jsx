import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { PlusCircle, Trash } from "@phosphor-icons/react";
import baseURL from "../../../utils/baseUrl";
import axios from "axios";

const AssignSubject2 = () => {
    const [classes, setClasses] = useState([]);
    const [sujects, setSubjects] = useState([])
    const [programs,setPrograms]=useState([])
    const [semester,setSemester]=useState([1,2,3,4,5,6])

    const initialValues = {

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
    console.log('subject is:', sujects)
    return (
        <div className="container mt-5 mb-5">
            <h3 className="mb-4">Assign Subject</h3>

            <Formik
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                    console.log('values is:', values)

                }}
            >
                {({ isSubmitting, values }) => (
                    <Form>
                        <div className="row g-3">


                            <div className="col-md-12">
                                <label className="form-label">Complusary Subject</label>

                                <FieldArray name="compulsory_subject">
                                    {({ push, remove }) => (
                                        <div className="row g-2 border p-2">
                                            {values.compulsory_subject.map((item, index) => (
                                                <div key={index} className="row g-2 align-items-center">

                                                    {/* CLASS SELECT */}
                                                    <div className="col-md-3">
                                                        <Field
                                                            as="select"
                                                            name={`compulsory_subject.${index}.class_id`}
                                                            className="form-select"
                                                        >
                                                            <option value="">Select Class</option>
                                                            {classes.map((cls) => (
                                                                <option key={cls.id} value={cls.id}>
                                                                    {cls.class_name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                    </div>
                                                     <div className="col-md-3">
                                                        <Field
                                                            as="select"
                                                            name={`compulsory_subject.${index}.subject_id`}
                                                            className="form-select"
                                                        >
                                                            <option value="">Program Name</option>
                                                            {programs.map((prog) => (
                                                                <option key={prog.id} value={prog.id}>
                                                                    {prog.program_name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                    </div>
                                                      <div className="col-md-2">
                                                        <Field
                                                            as="select"
                                                            name={`compulsory_subject.${index}.subject_id`}
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

                                                    {/* SUBJECT SELECT */}
                                                    <div className="col-md-2">
                                                        <Field
                                                            as="select"
                                                            name={`compulsory_subject.${index}.subject_id`}
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
                                                   

                                                    {/* ADD / REMOVE BUTTONS */}
                                                    <div className="col-md-2 d-flex gap-2">
                                                        {index === values.compulsory_subject.length - 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => push({ class_id: "", subject_id: "" })}
                                                            >
                                                                <PlusCircle size={20} />
                                                            </button>
                                                        )}

                                                        {values.compulsory_subject.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => remove(index)}
                                                            >
                                                                <Trash size={20} />
                                                            </button>
                                                        )}
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>


                            </div>






                        </div>





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

export default AssignSubject2;