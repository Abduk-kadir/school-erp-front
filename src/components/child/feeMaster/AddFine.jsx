import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/mastercom.css";

const MONTHS = [
    { value: "apr", label: "Apr" },
    { value: "may", label: "May" },
    { value: "jun", label: "Jun" },
    { value: "jul", label: "Jul" },
    { value: "aug", label: "Aug" },
    { value: "sep", label: "Sep" },
    { value: "oct", label: "Oct" },
    { value: "nov", label: "Nov" },
    { value: "dec", label: "Dec" },
    { value: "jan", label: "Jan" },
    { value: "feb", label: "Feb" },
    { value: "mar", label: "Mar" },
];

const FINE_TYPES = [
    { value: "daily", label: "Daily" },
    { value: "monthly", label: "Monthly" },
    { value: "weekly", label: "Weekly" },
    { value: "onetime", label: "Onetime" },
];

const AddFine = () => {
    const [classes, setClasses] = useState([]);
    const [classesLoading, setClassesLoading] = useState(true);
    const [classesError, setClassesError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [submitError, setSubmitError] = useState("");

    const initialValues = {
        class_id: "",
        fine_for_month: "",
        fine_type: "",
        fine_start_date: "",
        fine_amount: "",
    };

    const validationSchema = Yup.object({
        class_id: Yup.string().required("Please select a class"),
        fine_for_month: Yup.string().required("Please select a month"),
        fine_type: Yup.string().required("Please select fine type"),
        fine_start_date: Yup.string().required("Fine start date is required"),
        fine_amount: Yup.number()
            .typeError("Fine amount must be a number")
            .positive("Fine amount must be greater than zero")
            .required("Fine amount is required"),
    });

    useEffect(() => {
        const fetchClasses = async () => {
            setClassesLoading(true);
            setClassesError("");
            try {
                const res = await axios.get(`${baseURL}/api/classes`);
                const list = res.data?.data ?? res.data ?? [];
                setClasses(Array.isArray(list) ? list : []);
            } catch (err) {
                console.error("Failed to load classes:", err);
                setClassesError("Failed to load classes. Please try again.");
            } finally {
                setClassesLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const classOptionValue = (c) => c?.id ?? c?._id ?? "";
    const classOptionLabel = (c) =>
        c?.name ?? c?.class_name ?? c?.className ?? `Class ${classOptionValue(c)}`;

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitSuccess("");
        setSubmitError("");
        try {
            await axios.post(`${baseURL}/api/fines`, {
                ...values,
                fine_amount: Number(values.fine_amount),
            });
            setSubmitSuccess("Fine saved successfully.");
            resetForm();
        } catch (err) {
            console.error("Failed to save fine:", err);
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to save fine. Please try again.";
            setSubmitError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="chfi-wrapper mb-3">
            <div className="chfi-card">
                <div className="card-header">
                    <div className="header-row">
                        <span className="header-icon">
                            <Icon icon="solar:bill-cross-bold-duotone" width="24" />
                        </span>
                        <div>
                            <h5 className="card-title">Add Fine</h5>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    {classesError && (
                        <div className="alert alert-warning py-2 mb-2" role="alert">
                            {classesError}
                        </div>
                    )}

                    {submitSuccess && (
                        <div className="alert alert-success py-2 mb-2" role="alert">
                            {submitSuccess}
                        </div>
                    )}

                    {submitError && (
                        <div className="alert alert-danger py-2 mb-2" role="alert">
                            {submitError}
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
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Class
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:square-academic-cap-bold-duotone" width="18" />
                                            </span>
                                            <Field
                                                as="select"
                                                name="class_id"
                                                className="form-select"
                                                disabled={classesLoading}
                                            >
                                                <option value="">
                                                    {classesLoading ? "Loading classes..." : "Select class"}
                                                </option>
                                                {classes.map((c) => {
                                                    const v = classOptionValue(c);
                                                    if (v === "" || v == null) return null;
                                                    return (
                                                        <option key={String(v)} value={String(v)}>
                                                            {classOptionLabel(c)}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                        </div>
                                        <ErrorMessage name="class_id" component="div" className="text-danger field-error" />
                                    </div>

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Month
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:calendar-bold-duotone" width="18" />
                                            </span>
                                            <Field as="select" name="fine_for_month" className="form-select">
                                                <option value="">Select month</option>
                                                {MONTHS.map((m) => (
                                                    <option key={m.value} value={m.value}>
                                                        {m.label}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>
                                        <ErrorMessage name="fine_for_month" component="div" className="text-danger field-error" />
                                    </div>

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Fine type
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:bookmark-bold-duotone" width="18" />
                                            </span>
                                            <Field as="select" name="fine_type" className="form-select">
                                                <option value="">Select fine type</option>
                                                {FINE_TYPES.map((t) => (
                                                    <option key={t.value} value={t.value}>
                                                        {t.label}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>
                                        <ErrorMessage name="fine_type" component="div" className="text-danger field-error" />
                                    </div>

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Fine start date
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:calendar-date-bold-duotone" width="18" />
                                            </span>
                                            <Field
                                                type="date"
                                                name="fine_start_date"
                                                className="form-control"
                                            />
                                        </div>
                                        <ErrorMessage name="fine_start_date" component="div" className="text-danger field-error" />
                                    </div>

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Fine amount
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:wallet-money-bold-duotone" width="18" />
                                            </span>
                                            <Field
                                                type="number"
                                                name="fine_amount"
                                                className="form-control"
                                                placeholder="Enter amount"
                                                min="0"
                                                step="any"
                                            />
                                        </div>
                                        <ErrorMessage name="fine_amount" component="div" className="text-danger field-error" />
                                    </div>

                                    <div className="actions">
                                        <button
                                            type="button"
                                            className="btn btn-reset"
                                            onClick={() => resetForm()}
                                            disabled={isSubmitting || classesLoading}
                                        >
                                            <Icon icon="solar:restart-bold-duotone" width="16" />
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-submit"
                                            disabled={isSubmitting || classesLoading}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Icon icon="line-md:loading-loop" width="16" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Icon icon="solar:check-circle-bold-duotone" width="18" />
                                                    Save
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

export default AddFine;
