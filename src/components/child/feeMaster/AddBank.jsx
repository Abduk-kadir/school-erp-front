import React,{useState} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import axios from "axios";
import Loader from "../../../helper/Loader";
import "../../../assets/css/mastercom.css";


const AddBank = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const initialValues = {
        bank_name: "",
        status: ""
    };
    const validationSchema = Yup.object({
        bank_name: Yup.string()
            .required("Bank name is required")
            .min(2, "Minimum 2 characters"),

        status: Yup.string()
            .required("Status is required")
    });

    const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      setMessage("Adding bank...");

      await axios.post(`${baseURL}/api/banks`, values);

    
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="chfi-wrapper mb-3">
            <div className="chfi-card">
                <div className="card-header">
                    <div className="header-row">
                        <span className="header-icon">
                            <Icon icon="solar:bank-bold-duotone" width="24" />
                        </span>
                        <div>
                            <h5 className="card-title">Add Bank</h5>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div className="form-area">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, resetForm }) => (
                                <Form className="chfi-root">
                                    {loading && <Loader message={message} />}

                                    {/* Bank Name */}
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Bank Name
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:bank-bold-duotone" width="18" />
                                            </span>
                                            <Field
                                                type="text"
                                                name="bank_name"
                                                className="form-control"
                                                placeholder="Enter bank name"
                                            />
                                        </div>
                                        <ErrorMessage name="bank_name" component="div" className="text-danger field-error" />
                                    </div>

                                    {/* Status */}
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Status
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:shield-check-bold-duotone" width="18" />
                                            </span>
                                            <Field as="select" name="status" className="form-select">
                                                <option value="">Select Status</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </Field>
                                        </div>
                                        <ErrorMessage name="status" component="div" className="text-danger field-error" />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="actions">
                                        <button
                                            type="button"
                                            className="btn btn-reset"
                                            onClick={() => resetForm()}
                                            disabled={isSubmitting || loading}
                                        >
                                            <Icon icon="solar:restart-bold-duotone" width="16" />
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-submit"
                                            disabled={isSubmitting || loading}
                                        >
                                            {isSubmitting || loading ? (
                                                <>
                                                    <Icon icon="line-md:loading-loop" width="16" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Icon icon="solar:check-circle-bold-duotone" width="18" />
                                                    Save Bank
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

export default AddBank;
