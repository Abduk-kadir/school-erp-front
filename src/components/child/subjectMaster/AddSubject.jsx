
import { useEffect, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PenNibStraight } from "@phosphor-icons/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import axios from "axios";
import "../../../assets/css/mastercom.css";
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
        <div className="chfi-wrapper mb-3">
            <div className="chfi-card">
                <div className="card-header">
                    <div className="header-row">
                        <span className="header-icon">
                            <Icon icon="solar:book-bookmark-bold-duotone" width="24" />
                        </span>
                        <div>
                            <h5 className="card-title">Add Subject</h5>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div className="form-area">
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
                            {({ isSubmitting, resetForm }) => (
                                <Form className="chfi-root">
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Subject Name
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:notebook-bookmark-bold-duotone" width="18" />
                                            </span>
                                            <Field name="value" type="text" className='form-control' placeholder="Enter Subject Name" />
                                        </div>
                                        <ErrorMessage
                                            name="value"
                                            component="div"
                                            className="text-danger field-error"
                                        />
                                    </div>

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Subject Code
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:hashtag-square-bold-duotone" width="18" />
                                            </span>
                                            <Field name="subject_code" type="text" className='form-control' placeholder="Enter Subject Code" />
                                        </div>
                                        <ErrorMessage
                                            name="subject_code"
                                            component="div"
                                            className="text-danger field-error"
                                        />
                                    </div>

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Abbreviation Name
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:text-bold-duotone" width="18" />
                                            </span>
                                            <Field name="abbreviation_name" type="text" className='form-control' placeholder="Enter Abbreviation" />
                                        </div>
                                        <ErrorMessage
                                            name="abbreviation_name"
                                            component="div"
                                            className="text-danger field-error"
                                        />
                                    </div>

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Subject Pattern
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:calendar-bold-duotone" width="18" />
                                            </span>
                                            <Field as="select" name='subject_pattern' className="form-select">
                                                <option value="">Select pattern</option>
                                                <option value='Annual'>Annual</option>
                                                <option value='Semester'>Semester</option>
                                            </Field>
                                        </div>
                                        <ErrorMessage
                                            name="subject_pattern"
                                            component="div"
                                            className="text-danger field-error"
                                        />
                                    </div>

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Status
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:shield-check-bold-duotone" width="18" />
                                            </span>
                                            <Field as="select" name='status' className="form-select">
                                                <option value="">Select Status</option>
                                                <option value='Active'>Active</option>
                                                <option value='In Active'>In Active</option>
                                            </Field>
                                        </div>
                                        <ErrorMessage
                                            name="status"
                                            component="div"
                                            className="text-danger field-error"
                                        />
                                    </div>

                                    <div className="actions">
                                        <button
                                            type="button"
                                            className="btn btn-reset"
                                            onClick={() => resetForm()}
                                            disabled={isSubmitting}
                                        >
                                            <Icon icon="solar:restart-bold-duotone" width="16" />
                                            Reset
                                        </button>
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
        </div>
    );
};

export default AddSubject;
