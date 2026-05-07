
import { useEffect, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PenNibStraight } from "@phosphor-icons/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import axios from "axios";
import "../../../assets/css/mastercom.css";
const AddProgram = () => {
    const initialValues = {
         program_name: ""
    };

    const validationSchema = Yup.object(
        {
            program_name: Yup.string().required("prgram name is required"),
           
        }
    );


    return (
        <div className="chfi-wrapper mb-3">
            <div className="chfi-card">
                <div className="card-header">
                    <div className="header-row">
                        <span className="header-icon">
                            <Icon icon="solar:diploma-bold-duotone" width="24" />
                        </span>
                        <div>
                            <h5 className="card-title">Add Program</h5>
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
                                await axios.post(`${baseURL}/api/programs`, values)
                                alert("Form submitted successfully!");
                                resetForm();
                            }}
                        >
                            {({ isSubmitting, resetForm }) => (
                                <Form className="chfi-root">
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Program Name
                                        </label>
                                        <div className="cast-inline">
                                            <div className="cast-input">
                                                <div className="icon-field">
                                                    <span className="icon">
                                                        <Icon icon="solar:diploma-bold-duotone" width="18" />
                                                    </span>
                                                    <Field
                                                        name="program_name"
                                                        type="text"
                                                        className='form-control'
                                                        placeholder="Enter Program Name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="actions actions-inline">
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
                                        </div>
                                        <ErrorMessage
                                            name="program_name"
                                            component="div"
                                            className="text-danger field-error"
                                        />
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

export default AddProgram;
