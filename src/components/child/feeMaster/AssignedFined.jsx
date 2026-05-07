import React, { useEffect, useState, useCallback } from "react";
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

const initialValues = {
    class_id: "",
    student_reg_no: "",
    fine_for_month: "",
    fine_amount: "",
    fine_pay_till_date: "",
    remark: "",
};

const validationSchema = Yup.object({
    class_id: Yup.string().required("Please select a class"),
    student_reg_no: Yup.string().required("Please select a student"),
    fine_for_month: Yup.string().required("Please select a month"),
    fine_amount: Yup.number()
        .typeError("Fine amount must be a number")
        .positive("Fine amount must be greater than zero")
        .required("Fine amount is required"),
    fine_pay_till_date: Yup.string().required("Fine pay till date is required"),
    remark: Yup.string().max(500, "Remark is too long"),
});

const AssignedFined = () => {
    const [classes, setClasses] = useState([]);
    const [classesLoading, setClassesLoading] = useState(true);
    const [classesError, setClassesError] = useState("");

    const [students, setStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [studentsError, setStudentsError] = useState("");

    const [submitSuccess, setSubmitSuccess] = useState("");
    const [submitError, setSubmitError] = useState("");

    const classOptionValue = (c) => c?.id ?? c?._id ?? "";
    const classOptionLabel = (c) =>
        c?.name ?? c?.class_name ?? c?.className ?? `Class ${classOptionValue(c)}`;

    const fetchStudents = useCallback(async (classId) => {
        if (!classId) {
            setStudents([]);
            setStudentsError("");
            return;
        }
        setStudentsLoading(true);
        setStudentsError("");
        try {
            const res = await axios.get(
                `${baseURL}/api/parmanent-personal-information?class=${classId}`
            );
            const list = res.data?.data ?? res.data ?? [];
            setStudents(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error("Failed to load students:", err);
            setStudents([]);
            setStudentsError("Failed to load students. Please try again.");
        } finally {
            setStudentsLoading(false);
        }
    }, []);

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

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitSuccess("");
        setSubmitError("");
        const payload = {
            class_id: Number(values.class_id),
            student_reg_no: Number(values.student_reg_no),
            fine_for_month: values.fine_for_month,
            fine_amount: Number(values.fine_amount),
            fine_pay_till_date: values.fine_pay_till_date,
            remark: values.remark?.trim() ?? "",
        };
        try {
            await axios.post(`${baseURL}/api/fine-assigned`, payload);
            setSubmitSuccess("Assigned fine saved successfully.");
            resetForm();
            setStudents([]);
        } catch (err) {
            console.error("Failed to save assigned fine:", err);
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to save. Please try again.";
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
                            <Icon icon="solar:bill-list-bold-duotone" width="24" />
                        </span>
                        <div>
                            <h5 className="card-title">Assigned Fine</h5>
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
                            {({ isSubmitting, values, setFieldValue, resetForm }) => (
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
                                            <Field name="class_id">
                                                {({ field }) => (
                                                    <select
                                                        {...field}
                                                        className="form-select"
                                                        disabled={classesLoading}
                                                        onChange={(e) => {
                                                            const v = e.target.value;
                                                            setFieldValue("class_id", v);
                                                            setFieldValue("student_reg_no", "");
                                                            fetchStudents(v);
                                                        }}
                                                    >
                                                        <option value="">
                                                            {classesLoading
                                                                ? "Loading classes..."
                                                                : "Select class"}
                                                        </option>
                                                        {classes.map((c) => {
                                                            const cv = classOptionValue(c);
                                                            if (cv === "" || cv == null) return null;
                                                            return (
                                                                <option key={String(cv)} value={String(cv)}>
                                                                    {classOptionLabel(c)}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                )}
                                            </Field>
                                        </div>
                                        <ErrorMessage name="class_id" component="div" className="text-danger field-error" />
                                    </div>

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Student
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:user-id-bold-duotone" width="18" />
                                            </span>
                                            <Field
                                                as="select"
                                                name="student_reg_no"
                                                className="form-select"
                                                disabled={
                                                    !values.class_id ||
                                                    studentsLoading ||
                                                    students.length === 0
                                                }
                                            >
                                                <option value="">
                                                    {!values.class_id
                                                        ? "Select class first"
                                                        : studentsLoading
                                                          ? "Loading students..."
                                                          : students.length === 0
                                                            ? "No students in this class"
                                                            : "Select student"}
                                                </option>
                                                {students.map((s) => {
                                                    const reg = s?.reg_no;
                                                    if (reg === "" || reg == null) return null;
                                                    const label = [s.first_name, s.last_name]
                                                        .filter(Boolean)
                                                        .join(" ")
                                                        .trim();
                                                    return (
                                                        <option key={s.id ?? reg} value={String(reg)}>
                                                            {label || `Reg ${reg}`} ({reg})
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                        </div>
                                        {studentsError && (
                                            <div className="text-warning small" style={{ gridColumn: 2 }}>
                                                {studentsError}
                                            </div>
                                        )}
                                        <ErrorMessage name="student_reg_no" component="div" className="text-danger field-error" />
                                    </div>

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Fine for month
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:calendar-bold-duotone" width="18" />
                                            </span>
                                            <Field
                                                as="select"
                                                name="fine_for_month"
                                                className="form-select"
                                            >
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

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Fine pay till date
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:calendar-date-bold-duotone" width="18" />
                                            </span>
                                            <Field
                                                type="date"
                                                name="fine_pay_till_date"
                                                className="form-control"
                                            />
                                        </div>
                                        <ErrorMessage name="fine_pay_till_date" component="div" className="text-danger field-error" />
                                    </div>

                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Remark
                                        </label>
                                        <Field
                                            as="textarea"
                                            name="remark"
                                            className="form-control"
                                            rows={2}
                                            placeholder="enter remark"
                                            style={{
                                                borderRadius: 10,
                                                fontSize: "0.88rem",
                                                border: "1px solid rgba(148,163,184,0.45)",
                                                padding: "8px 12px",
                                            }}
                                        />
                                        <ErrorMessage name="remark" component="div" className="text-danger field-error" />
                                    </div>

                                    <div className="actions">
                                        <button
                                            type="button"
                                            className="btn btn-reset"
                                            onClick={() => {
                                                resetForm();
                                                setStudents([]);
                                            }}
                                            disabled={isSubmitting || classesLoading || studentsLoading}
                                        >
                                            <Icon icon="solar:restart-bold-duotone" width="16" />
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-submit"
                                            disabled={
                                                isSubmitting || classesLoading || studentsLoading
                                            }
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

export default AssignedFined;
