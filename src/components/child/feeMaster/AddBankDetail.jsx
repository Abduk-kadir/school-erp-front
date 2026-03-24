import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";

const AddBankDetail = () => {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [banks, setBanks] = useState([]); // renamed from classes → clearer

    const initialValues = {
        bank_id: "",           // renamed to match backend convention (bank_id)
        ifsc_code: "",
        account_number: "",
        // account_holder_name: "",   // ← add if your backend accepts it
    };

    const validationSchema = Yup.object({
        bank_id: Yup.string().required("Please select a bank"),
        ifsc_code: Yup.string()
            .required("IFSC code is required")
            .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/i, "Invalid IFSC format (e.g. SBIN0001234)"),
        account_number: Yup.string()
            .required("Account number is required")
            .min(6, "Too short")
            .max(20, "Too long")
            .matches(/^\d+$/, "Only numbers allowed"),
        // account_holder_name: Yup.string().trim().optional(),
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
        console.log('values is:',values)
        try {


            await axios.post(`${baseURL}/api/bank-details`, values); // ← correct endpoint!

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
        <div className="card shadow">
            <div className="card-header ">
                <h6 className="mb-0">Add Bank Account Detail</h6>
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

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            {loading && <Loader message="Saving bank detail..." />}

                            {/* Bank Selection */}
                            <div className="col-6">
                                <label className="form-label fw-bold">Bank</label>
                                <Field as="select" name="bank_id" className="form-select">
                                    <option value="">-- Select Bank --</option>
                                    {banks.map((bank) => (
                                        <option key={bank.id} value={bank.id}>
                                            {bank.bank_name} {bank.short_name ? `(${bank.short_name})` : ""}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="bank_id" component="div" className="text-danger small mt-1" />
                            </div>

                            {/* IFSC Code */}
                            <div className="col-6">
                                <label className="form-label fw-bold">IFSC Code</label>
                                <Field
                                    type="text"
                                    name="ifsc_code"
                                    className="form-control"
                                    placeholder="e.g. HDFC0000123"
                                    maxLength={11}
                                />
                                <ErrorMessage name="ifsc_code" component="div" className="text-danger small mt-1" />
                            </div>

                            {/* Account Number */}
                            <div className="col-6 mb-3">
                                <label className="form-label fw-bold">Account Number</label>
                                <Field
                                    type="text"
                                    name="account_number"
                                    className="form-control"
                                    placeholder="Enter account number"
                                />
                                <ErrorMessage name="account_number" component="div" className="text-danger small mt-1" />
                            </div>


                            <button
                                type="submit"
                                className="btn btn-success px-4"
                                disabled={isSubmitting || loading}
                            >
                                {isSubmitting || loading ? "Saving..." : "Save Bank Detail"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddBankDetail;