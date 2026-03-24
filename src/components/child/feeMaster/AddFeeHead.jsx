import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";

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

                            {/* IFSC Code */}
                            <div className="col-6">
                                <label className="form-label fw-bold">Fee Head</label>
                                <Field
                                    type="text"
                                    name="fee_head_name"
                                    className="form-control"
                                    placeholder="enter fee head"
                                   
                                />
                                <ErrorMessage name="fee_head_name" component="div" className="text-danger small mt-1" />
                            </div>

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

                            {/*refundable section*/}
                            <div className="col-6">
                                <label className="form-label">Is Refundable</label>
                                <Field as="select" name="is_refundable" className="form-select">
                                    <option value="">Is refundable</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">NO</option>
                                </Field>

                                <div className="text-danger">
                                    <ErrorMessage name="is_refundable" />
                                </div>
                            </div>

                            {/* Status */}

                            <div className="col-6 mb-3">
                                <label className="form-label">Status</label>
                                <Field as="select" name="status" className="form-select">
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Field>

                                <div className="text-danger">
                                    <ErrorMessage name="status" />
                                </div>
                            </div>




                            <button
                                type="submit"
                                className="btn btn-success px-4"
                                disabled={isSubmitting || loading}
                            >
                                {isSubmitting || loading ? "Saving..." : "Save Head"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddFeeHead;