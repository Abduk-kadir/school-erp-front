import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";
import "../../../assets/css/mastercom.css";

const AddFeeHead = () => {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [banks, setBanks] = useState([]); // renamed from classes → clearer

    const initialValues = {
        bank_id: "",           // renamed to match backend convention (bank_id)
        fee_head_name: "",
        is_refundable:"",
        status: "",
        // account_holder_name: "",   // ← add if your backend accepts it
    };

    const validationSchema = Yup.object({
        bank_id: Yup.string().required("Please select a bank"),
        fee_head_name: Yup.string()
            .required("IFSC code is required"),

        is_refundable: Yup.string().required("is refundable is required"),    
        status: Yup.string()
            .required("status is required"),    

        
    });

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/banks`); // ← correct endpoint
                setBanks(res.data.data || res.data || []); // adjust based on your API response shape
            } catch (err) {
                console.error("Failed to load banks:", err);
                setErrorMsg("Failed to load bank list. Please try again later.");
            }
        };

        fetchBanks();
    }, []);

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");
        console.log('values is:', values)
        try {


            await axios.post(`${baseURL}/api/fee-heads`, values); // ← correct endpoint!

            setSuccessMsg("Bank detail added successfully!");
            resetForm();
        } catch (error) {
            console.error("Error adding bank detail:", error);
            const msg =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to add bank detail. Please try again.";
            setErrorMsg(msg);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="chfi-wrapper mb-3">
            <div className="chfi-card">
                <div className="card-header">
                    <div className="header-row">
                        <span className="header-icon">
                            <Icon icon="solar:wallet-money-bold-duotone" width="24" />
                        </span>
                        <div>
                            <h5 className="card-title">Add Fee Head</h5>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    {successMsg && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {successMsg}
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setSuccessMsg("")}
                            ></button>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {errorMsg}
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setErrorMsg("")}
                            ></button>
                        </div>
                    )}

                    <div className="form-area">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, resetForm }) => (
                                <Form className="chfi-root">
                                    {loading && <Loader message="Saving bank detail..." />}

                                    {/* IFSC Code */}
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Fee Head
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:tag-price-bold-duotone" width="18" />
                                            </span>
                                            <Field
                                                type="text"
                                                name="fee_head_name"
                                                className="form-control"
                                                placeholder="enter fee head"
                                            />
                                        </div>
                                        <ErrorMessage name="fee_head_name" component="div" className="text-danger field-error" />
                                    </div>

                                    {/* Bank Selection */}
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Bank
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:card-bold-duotone" width="18" />
                                            </span>
                                            <Field as="select" name="bank_id" className="form-select">
                                                <option value="">-- Select Bank --</option>
                                                {banks.map((bank) => (
                                                    <option key={bank.id} value={bank.id}>
                                                        {bank.bank_name} {bank.short_name ? `(${bank.short_name})` : ""}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>
                                        <ErrorMessage name="bank_id" component="div" className="text-danger field-error" />
                                    </div>

                                    {/*refundable section*/}
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Is Refundable
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:refresh-circle-bold-duotone" width="18" />
                                            </span>
                                            <Field as="select" name="is_refundable" className="form-select">
                                                <option value="">Is refundable</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">NO</option>
                                            </Field>
                                        </div>
                                        <ErrorMessage name="is_refundable" component="div" className="text-danger field-error" />
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
                                                    Save Head
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

export default AddFeeHead;
