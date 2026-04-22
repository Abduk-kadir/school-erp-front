import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";

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
        <div className="card shadow mb-3">
            <div className="card-header py-2 bg-primary-subtle text-primary border-bottom border-primary border-opacity-25">
                <h6 className="mb-0 fw-semibold">Add Fine</h6>
            </div>

            <div className="card-body py-2">
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

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="row justify-content-start">
                                <div className="col-12 col-md-8 col-lg-6">
                                    <div className="mb-2">
                                        <label className="form-label mb-1">Class</label>
                                        <Field
                                            as="select"
                                            name="class_id"
                                            className="form-select form-select-sm"
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
                                        <div className="text-danger small">
                                            <ErrorMessage name="class_id" />
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label mb-1">Month</label>
                                        <Field as="select" name="fine_for_month" className="form-select form-select-sm">
                                            <option value="">Select month</option>
                                            {MONTHS.map((m) => (
                                                <option key={m.value} value={m.value}>
                                                    {m.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <div className="text-danger small">
                                            <ErrorMessage name="fine_for_month" />
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label mb-1">Fine type</label>
                                        <Field as="select" name="fine_type" className="form-select form-select-sm">
                                            <option value="">Select fine type</option>
                                            {FINE_TYPES.map((t) => (
                                                <option key={t.value} value={t.value}>
                                                    {t.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <div className="text-danger small">
                                            <ErrorMessage name="fine_type" />
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label mb-1">Fine start date</label>
                                        <Field
                                            type="date"
                                            name="fine_start_date"
                                            className="form-control form-control-sm"
                                        />
                                        <div className="text-danger small">
                                            <ErrorMessage name="fine_start_date" />
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label mb-1">Fine amount</label>
                                        <Field
                                            type="number"
                                            name="fine_amount"
                                            className="form-control form-control-sm"
                                            placeholder="Enter amount"
                                            min="0"
                                            step="any"
                                        />
                                        <div className="text-danger small">
                                            <ErrorMessage name="fine_amount" />
                                        </div>
                                    </div>

                                    <div className="text-start pt-1">
                                        <button
                                            type="submit"
                                            className="btn btn-success btn-sm"
                                            disabled={isSubmitting || classesLoading}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddFine;
