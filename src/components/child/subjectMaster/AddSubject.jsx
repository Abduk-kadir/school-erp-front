
import { useEffect, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PenNibStraight } from "@phosphor-icons/react";
import baseURL from "../../../utils/baseUrl";
import axios from "axios";
const AddSubject = () => {




    const initialValues = {
        value: "", subject_code: "", abbreviation_name: "", subject_pattern: "", status: ""
    };


    const validationSchema = Yup.object(
        {
            value: Yup.string().required("First name is required"),
            subject_code: Yup.string().required("subject code is required"),
            abbreviation_name: Yup.string().required("abbreviation_name is required"),
            subject_pattern: Yup.string().required("suject category is required"),
            status: Yup.string().required("status is required"),

        }
    );


    return (
        <div className="container mt-5 mb-5">

            <h3 className="mb-4">Add Subject</h3>

            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                    console.log('selected value:', values);
                    await axios.post(`${baseURL}/api/subjects`, values)
                    alert("Form submitted successfully!");
                    resetForm();
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="row">
                            <div className="col-6 mb-1">
                                <label className="form-label">Subject Name</label>
                                <Field name="value" type="text" className='form-control' />
                                <ErrorMessage
                                    name="value"
                                    component="div"
                                    className="text-danger mt-1"
                                />

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Subject Code</label>
                                <Field name="subject_code" type="text" className='form-control' />

                                <ErrorMessage
                                    name="subject_code"
                                    component="div"
                                    className="text-danger mt-1"
                                />

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Abbreviation Name</label>
                                <Field name="abbreviation_name" type="text" className='form-control' />

                                <ErrorMessage
                                    name="abbreviation_name"
                                    component="div"
                                    className="text-danger mt-1"
                                />

                            </div>
                            <div className="col-6 mb-1">
                                <label className="form-label">Subject Pattern</label>
                                <Field as="select" name='subject_pattern' className="form-select">
                                    <option value="">Select pattern</option>

                                    <option value='Annual'>
                                        Annual
                                    </option>

                                    <option value='Semester'>
                                        Semester
                                    </option>

                                </Field>
                                <ErrorMessage
                                    name="subject_pattern"
                                    component="div"
                                    className="text-danger mt-1"
                                />

                            </div>
                              <div className="col-6 mb-1">
                                <label className="form-label">Status</label>
                                <Field as="select" name='status' className="form-select">
                                    <option value="">Select Status</option>

                                    <option value='Active'>
                                        Active
                                    </option>

                                    <option value='In Active'>
                                        In Active
                                    </option>

                                </Field>
                                <ErrorMessage
                                    name="status"
                                    component="div"
                                    className="text-danger mt-1"
                                />

                            </div>
                            

                        </div>

                        <div className="d-flex justify-content-end">
                            <button
                                type="submit"
                                className="btn btn-primary mt-1 px-5"
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

export default AddSubject;
