import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";
import "../../../assets/css/mastercom.css";

const PAYMENT_GATEWAYS = [
    { value: "paypal", label: "PayPal" },
    { value: "atom", label: "Atom" },
    { value: "ccavenue", label: "CCAvenue" },
    { value: "razorpay", label: "Razorpay" },
    { value: "stripe", label: "Stripe" },
    { value: "payu", label: "PayU" },
];

const PaymentSetting = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [classes, setClasses] = useState([]);
    const [feeTypes, setFeeTypes] = useState([]);

    const initialValues = {
        paymentGate: "",
        class: [""],
        merchantId: "",
        key: "",
        accessCode: "",
        feeType: "",
        isSplit: "",
    };

    const validationSchema = Yup.object({
        paymentGate: Yup.string().required("Payment gateway is required"),
        class: Yup.array()
            .of(Yup.string().required("Select a class"))
            .min(1, "Select at least one class")
            .required("Class is required"),
        merchantId: Yup.string()
            .required("Merchant ID is required")
            .min(2, "Minimum 2 characters"),
        key: Yup.string()
            .required("Key is required")
            .min(2, "Minimum 2 characters"),
        accessCode: Yup.string()
            .required("Access code is required")
            .min(2, "Minimum 2 characters"),
        feeType: Yup.string().required("Fee type is required"),
        isSplit: Yup.string()
            .oneOf(["yes", "no"], "Select Yes or No")
            .required("Please choose split option"),
    });

    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [classRes, feeTypeRes] = await Promise.all([
                    axios.get(`${baseURL}/api/classes`),
                    axios.get(`${baseURL}/api/fees-types`),
                ]);
                setClasses(classRes.data?.data || classRes.data || []);
                setFeeTypes(feeTypeRes.data?.data || feeTypeRes.data || []);
            } catch (error) {
                console.error("Failed to load dropdowns", error);
            }
        };
        fetchDropdowns();
    }, []);

    const toNumberOrValue = (v) => {
        const n = Number(v);
        return Number.isFinite(n) && String(n) === String(v).trim() ? n : v;
    };

    const handleSubmit = async (values, { resetForm }) => {
        try {
            setLoading(true);
            setMessage("Saving payment settings...");

            const selectedClasses = (values.class || []).filter(
                (c) => c !== "" && c !== null && c !== undefined
            );

            const payload = selectedClasses.map((classId) => ({
                paymentGateway: values.paymentGate,
                classid: toNumberOrValue(classId),
                merchantId: toNumberOrValue(values.merchantId),
                key: values.key,
                accessCode: values.accessCode,
                feetype: toNumberOrValue(values.feeType),
                isSplit: values.isSplit === "yes",
            }));

            console.log("payload to send:", payload);

            await axios.post(`${baseURL}/api/payment-settings`, payload);

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
                            <Icon icon="solar:card-bold-duotone" width="24" />
                        </span>
                        <div>
                            <h5 className="card-title">Payment Setting</h5>
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

                                    {/* Payment Gateway */}
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Payment Gateway
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:wallet-bold-duotone" width="18" />
                                            </span>
                                            <Field as="select" name="paymentGate" className="form-select">
                                                <option value="">Select Payment Gateway</option>
                                                {PAYMENT_GATEWAYS.map((g) => (
                                                    <option key={g.value} value={g.value}>
                                                        {g.label}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>
                                        <ErrorMessage name="paymentGate" component="div" className="text-danger field-error" />
                                    </div>

                                    {/* Class (FieldArray) */}
                                    <FieldArray name="class">
                                        {({ push, remove, form }) => {
                                            const classValues =
                                                form.values.class && form.values.class.length > 0
                                                    ? form.values.class
                                                    : [""];
                                            const isLastRow = classValues.length === 1;
                                            return (
                                                <div className="field-row">
                                                    <label className="form-label">
                                                        <span className="label-dot" />
                                                        Class
                                                    </label>
                                                    <div className="class-array-box">
                                                        {classValues.map((_, index) => (
                                                            <div className="class-array-row" key={index}>
                                                                <div className="icon-field" style={{ flex: 1 }}>
                                                                    <span className="icon">
                                                                        <Icon
                                                                            icon="solar:square-academic-cap-bold-duotone"
                                                                            width="18"
                                                                        />
                                                                    </span>
                                                                    <Field
                                                                        as="select"
                                                                        name={`class.${index}`}
                                                                        className="form-select"
                                                                    >
                                                                        <option value="">Select Class</option>
                                                                        {classes.map((cls) => {
                                                                            const id = String(
                                                                                cls._id || cls.id || cls.class_name
                                                                            );
                                                                            const label =
                                                                                cls.class_name || cls.name || cls.title;
                                                                            return (
                                                                                <option key={id} value={id}>
                                                                                    {label}
                                                                                </option>
                                                                            );
                                                                        })}
                                                                    </Field>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="btn-icon btn-icon-add"
                                                                    onClick={() => push("")}
                                                                    aria-label="Add class row"
                                                                    title="Add"
                                                                >
                                                                    <Icon
                                                                        icon="solar:add-circle-bold-duotone"
                                                                        width="22"
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn-icon btn-icon-remove"
                                                                    onClick={() => remove(index)}
                                                                    disabled={isLastRow}
                                                                    aria-label={`Remove class row ${index + 1}`}
                                                                    title="Remove"
                                                                >
                                                                    <Icon
                                                                        icon="solar:trash-bin-trash-bold-duotone"
                                                                        width="22"
                                                                    />
                                                                </button>
                                                            </div>
                                                        ))}

                                                        <ErrorMessage
                                                            name="class"
                                                            component="div"
                                                            className="text-danger field-error"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    </FieldArray>

                                    {/* Merchant ID */}
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Merchant ID
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:shop-bold-duotone" width="18" />
                                            </span>
                                            <Field
                                                type="text"
                                                name="merchantId"
                                                className="form-control"
                                                placeholder="Enter merchant ID"
                                            />
                                        </div>
                                        <ErrorMessage name="merchantId" component="div" className="text-danger field-error" />
                                    </div>

                                    {/* Key */}
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Key
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:key-bold-duotone" width="18" />
                                            </span>
                                            <Field
                                                type="text"
                                                name="key"
                                                className="form-control"
                                                placeholder="Enter key"
                                            />
                                        </div>
                                        <ErrorMessage name="key" component="div" className="text-danger field-error" />
                                    </div>

                                    {/* Access Code */}
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Access Code
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:lock-password-bold-duotone" width="18" />
                                            </span>
                                            <Field
                                                type="text"
                                                name="accessCode"
                                                className="form-control"
                                                placeholder="Enter access code"
                                            />
                                        </div>
                                        <ErrorMessage name="accessCode" component="div" className="text-danger field-error" />
                                    </div>

                                    {/* Fee Type */}
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Fee Type
                                        </label>
                                        <div className="icon-field">
                                            <span className="icon">
                                                <Icon icon="solar:bill-list-bold-duotone" width="18" />
                                            </span>
                                            <Field as="select" name="feeType" className="form-select">
                                                <option value="">Select Fee Type</option>
                                                {feeTypes.map((ft) => (
                                                    <option
                                                        key={ft._id || ft.id || ft.fee_type}
                                                        value={ft._id || ft.id || ft.fee_type}
                                                    >
                                                        {ft.fee_type || ft.name || ft.title}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>
                                        <ErrorMessage name="feeType" component="div" className="text-danger field-error" />
                                    </div>

                                    {/* Is Split */}
                                    <div className="field-row">
                                        <label className="form-label">
                                            <span className="label-dot" />
                                            Is Split
                                        </label>
                                        <div
                                            role="group"
                                            aria-labelledby="isSplit-group"
                                            style={{ display: "flex", gap: "18px", alignItems: "center" }}
                                        >
                                            <div className="form-check form-check-inline">
                                                <Field
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="isSplit"
                                                    id="isSplit-yes"
                                                    value="yes"
                                                />
                                                <label className="form-check-label" htmlFor="isSplit-yes">
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <Field
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="isSplit"
                                                    id="isSplit-no"
                                                    value="no"
                                                />
                                                <label className="form-check-label" htmlFor="isSplit-no">
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                        <ErrorMessage name="isSplit" component="div" className="text-danger field-error" />
                                    </div>

                                    {/* Actions */}
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
                                                    Save Setting
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

export default PaymentSetting;
