import React, { useEffect, useState, useCallback } from "react";
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
        <div className="card shadow mb-2">
            <div className="card-header py-2 bg-primary-subtle text-primary border-bottom border-primary border-opacity-25">
                <h6 className="mb-0 fw-semibold">Assigned Fine</h6>
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
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form>
                            <div className="row justify-content-start">
                                <div className="col-12 col-md-8 col-lg-6">
                                    <div className="mb-2">
                                        <label className="form-label mb-1">Class</label>
                                        <Field name="class_id">
                                            {({ field }) => (
                                                <select
                                                    {...field}
                                                    className="form-select form-select-sm"
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
                                        <div className="text-danger small">
                                            <ErrorMessage name="class_id" />
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label mb-1">Student</label>
                                        <Field
                                            as="select"
                                            name="student_reg_no"
                                            className="form-select form-select-sm"
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
                                        {studentsError && (
                                            <div className="text-warning small">{studentsError}</div>
                                        )}
                                        <div className="text-danger small">
                                            <ErrorMessage name="student_reg_no" />
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label mb-1">Fine for month</label>
                                        <Field
                                            as="select"
                                            name="fine_for_month"
                                            className="form-select form-select-sm"
                                        >
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

                                    <div className="mb-2">
                                        <label className="form-label mb-1">Fine pay till date</label>
                                        <Field
                                            type="date"
                                            name="fine_pay_till_date"
                                            className="form-control form-control-sm"
                                        />
                                        <div className="text-danger small">
                                            <ErrorMessage name="fine_pay_till_date" />
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label mb-1">Remark</label>
                                        <Field
                                            as="textarea"
                                            name="remark"
                                            className="form-control form-control-sm"
                                            rows={2}
                                            placeholder="enter remark"
                                        />
                                        <div className="text-danger small">
                                            <ErrorMessage name="remark" />
                                        </div>
                                    </div>

                                    <div className="text-start pt-1">
                                        <button
                                            type="submit"
                                            className="btn btn-success btn-sm"
                                            disabled={
                                                isSubmitting || classesLoading || studentsLoading
                                            }
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

export default AssignedFined;
