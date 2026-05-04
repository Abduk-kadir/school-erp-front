import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";

const SCHOOL_IMAGE_URL =
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80";

const initialValues = {
  surname: "",
  firstname: "",
  lastname: "",
  dob: "",
  gender: "",
  email: "",
  mobile_number: "",
  department: "",
  designation: "",
  userType: "staff",
  address: "",
  date_of_join: "",
  emergency_contact_number: "",
  password: "",
};

const validationSchema = Yup.object({
  surname: Yup.string().trim().required("Surname is required").min(2, "Too short"),
  firstname: Yup.string().trim().required("First name is required").min(2, "Too short"),
  lastname: Yup.string().trim().required("Last name is required").min(2, "Too short"),
  dob: Yup.date()
    .typeError("Enter a valid date")
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Select a valid gender")
    .required("Gender is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  mobile_number: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  department: Yup.string().required("Department is required"),
  designation: Yup.string().required("Designation is required"),
  userType: Yup.string().required(),
  address: Yup.string().trim().required("Address is required").min(5, "Too short"),
  date_of_join: Yup.date()
    .typeError("Enter a valid date")
    .required("Date of joining is required"),
  emergency_contact_number: Yup.string()
    .matches(/^[0-9]{10}$/, "Emergency contact must be 10 digits")
    .required("Emergency contact is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/[0-9]/, "Must include a number")
    .required("Password is required"),
});

const departments = [
  "Science",
  "Mathematics",
  "English",
  "Social Studies",
  "Computer Science",
  "Physical Education",
  "Arts",
  "Administration",
];

const designations = [
  "Teacher",
  "Senior Teacher",
  "Head of Department",
  "Principal",
  "Vice Principal",
  "Coordinator",
  "Counselor",
  "Librarian",
  "Lab Assistant",
  "Administrator",
];

const StaffRegistrationComponent = () => {
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: string }
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      setLoaderMessage("Registering staff...");
      setFeedback(null);

      await axios.post(`${baseURL}/api/staff/registration`, values);

      setFeedback({
        type: "success",
        text: "Staff registered successfully.",
      });
      resetForm();
    } catch (error) {
      const text =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      setFeedback({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='staff-reg-root'>
      <style>
        {`
          .staff-reg-root {
            padding: clamp(1rem, 2.5vw, 1.75rem);
          }
          .staff-reg-root .reg-card {
            border: 1px solid rgba(148, 163, 184, 0.18);
            border-radius: 1.25rem;
            overflow: hidden;
            background: #ffffff;
            box-shadow: 0 12px 28px -14px rgba(15, 23, 42, 0.18),
              0 30px 60px -24px rgba(79, 70, 229, 0.18);
          }
          .staff-reg-root .reg-image-col {
            position: relative;
            min-height: 180px;
            background: #0f172a;
            overflow: hidden;
          }
          .staff-reg-root .reg-image-col .reg-image {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            transform: scale(1.04);
            transition: transform 8s ease-out;
          }
          .staff-reg-root .reg-card:hover .reg-image-col .reg-image {
            transform: scale(1);
          }
          .staff-reg-root .reg-image-col::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(165deg, rgba(15,23,42,0.18) 0%, transparent 38%, rgba(15,23,42,0.65) 100%),
              linear-gradient(45deg, rgba(79,70,229,0.30), rgba(217,70,239,0.18));
          }
          .staff-reg-root .reg-image-overlay {
            position: absolute;
            inset: 0;
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1.5rem;
            color: #fff;
          }
          .staff-reg-root .reg-brand {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.4rem 0.9rem;
            border-radius: 999px;
            background: rgba(255,255,255,0.16);
            border: 1px solid rgba(255,255,255,0.28);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            font-weight: 700;
            font-size: 0.8rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            width: fit-content;
            box-shadow: 0 6px 18px rgba(15,23,42,0.25);
          }
          .staff-reg-root .reg-tagline h3 {
            color: #fff;
            font-weight: 700;
            line-height: 1.2;
            text-shadow: 0 2px 16px rgba(15,23,42,0.55);
            margin-bottom: 0.5rem;
            font-size: clamp(1.3rem, 2vw, 1.7rem);
          }
          .staff-reg-root .reg-tagline p {
            color: rgba(255,255,255,0.9);
            margin: 0;
            font-size: 0.95rem;
            text-shadow: 0 2px 12px rgba(15,23,42,0.45);
          }
          .staff-reg-root .reg-form-col {
            padding: 1.1rem clamp(1rem, 2.2vw, 1.5rem);
          }
          .staff-reg-root .reg-title {
            background: linear-gradient(120deg, #4338ca 0%, #7c3aed 45%, #db2777 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: 700;
            letter-spacing: -0.01em;
            font-size: clamp(1.2rem, 2vw, 1.5rem);
            margin: 0;
          }
          .staff-reg-root .reg-subtitle {
            color: #64748b;
            font-size: 0.9rem;
            margin-top: 0.25rem;
          }
          .staff-reg-root .reg-section-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.74rem;
            font-weight: 700;
            color: #475569;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin: 0.8rem 0 0.35rem;
          }
          .staff-reg-root .reg-section-label::after {
            content: "";
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, rgba(99,102,241,0.25), transparent);
          }
          .staff-reg-root .form-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: #334155;
            margin-bottom: 0.2rem;
          }
          .staff-reg-root .form-control,
          .staff-reg-root .form-select {
            border-radius: 0.5rem;
            border: 1px solid #e2e8f0;
            padding: 0.38rem 0.75rem;
            font-size: 0.875rem;
            background-color: #f8fafc;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
          }
          .staff-reg-root .form-control:hover,
          .staff-reg-root .form-select:hover {
            border-color: #c7d2fe;
            background-color: #fff;
          }
          .staff-reg-root .form-control:focus,
          .staff-reg-root .form-select:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
            background-color: #fff;
          }
          .staff-reg-root .input-group .form-control {
            border-right: none;
          }
          .staff-reg-root .input-group .input-group-text {
            background: #fff;
            border: 1px solid #e2e8f0;
            border-left: none;
            color: #64748b;
            cursor: pointer;
          }
          .staff-reg-root textarea.form-control {
            min-height: 60px;
            resize: vertical;
          }
          .staff-reg-root .field-error {
            color: #dc2626;
            font-size: 0.78rem;
            margin-top: 0.25rem;
          }
          .staff-reg-root .reg-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: flex-end;
            margin-top: 0.75rem;
          }
          .staff-reg-root .btn-submit {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
            color: #fff;
            border: none;
            font-weight: 600;
            border-radius: 0.5rem;
            padding: 0.45rem 1.2rem;
            box-shadow: 0 6px 18px rgba(124,58,237,0.32);
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
          }
          .staff-reg-root .btn-submit:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 10px 26px rgba(124,58,237,0.4);
            filter: brightness(1.02);
          }
          .staff-reg-root .btn-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .staff-reg-root .btn-reset {
            background: #f1f5f9;
            color: #334155;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 0.45rem 1rem;
            font-weight: 600;
          }
          .staff-reg-root .btn-reset:hover {
            background: #e2e8f0;
          }
          .staff-reg-root .alert-feedback {
            padding: 0.7rem 0.95rem;
            border-radius: 0.55rem;
            font-size: 0.88rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .staff-reg-root .alert-success {
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            color: #065f46;
          }
          .staff-reg-root .alert-error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
          }
          /* ----- Page header ----- */
          .staff-reg-root .reg-header {
            position: relative;
            border-radius: 1.25rem;
            padding: 1.25rem 1.5rem;
            margin-bottom: 1.25rem;
            color: #fff;
            background: linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #db2777 100%);
            box-shadow: 0 12px 28px -14px rgba(79,70,229,0.45);
            overflow: hidden;
          }
          .staff-reg-root .reg-header::before,
          .staff-reg-root .reg-header::after {
            content: "";
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
          }
          .staff-reg-root .reg-header::before {
            width: 220px; height: 220px;
            right: -60px; top: -90px;
            background: radial-gradient(closest-side, rgba(255,255,255,0.22), transparent 70%);
          }
          .staff-reg-root .reg-header::after {
            width: 160px; height: 160px;
            left: -40px; bottom: -70px;
            background: radial-gradient(closest-side, rgba(255,255,255,0.18), transparent 70%);
          }
          .staff-reg-root .reg-header-inner {
            position: relative;
            z-index: 1;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
          }
          .staff-reg-root .reg-header-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.18);
            border: 1px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          .staff-reg-root .reg-header h2 {
            color: #fff;
            font-weight: 700;
            margin: 0;
            font-size: clamp(1.15rem, 2vw, 1.45rem);
            letter-spacing: -0.01em;
          }
          .staff-reg-root .reg-header .reg-breadcrumb {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            color: rgba(255,255,255,0.85);
            font-size: 0.78rem;
            margin-bottom: 0.25rem;
          }
          .staff-reg-root .reg-breadcrumb a {
            color: inherit;
            text-decoration: none;
          }
          .staff-reg-root .reg-breadcrumb a:hover {
            color: #fff;
            text-decoration: underline;
          }
          .staff-reg-root .reg-header-actions {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }
          .staff-reg-root .reg-header-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.4rem 0.8rem;
            border-radius: 999px;
            background: rgba(255,255,255,0.18);
            border: 1px solid rgba(255,255,255,0.3);
            color: #fff;
            font-weight: 600;
            font-size: 0.78rem;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }

          /* ----- Page footer ----- */
          .staff-reg-root .reg-footer {
            margin-top: 1.25rem;
            border-radius: 1.25rem;
            padding: 1.1rem 1.5rem;
            background: #fff;
            border: 1px solid rgba(148,163,184,0.18);
            box-shadow: 0 8px 22px -16px rgba(15,23,42,0.18);
          }
          .staff-reg-root .reg-footer-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1rem;
          }
          .staff-reg-root .reg-footer-item {
            display: flex;
            gap: 0.6rem;
            align-items: flex-start;
          }
          .staff-reg-root .reg-footer-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #4f46e5;
            background: rgba(99,102,241,0.12);
            flex-shrink: 0;
          }
          .staff-reg-root .reg-footer-item h6 {
            font-size: 0.88rem;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 0.15rem;
          }
          .staff-reg-root .reg-footer-item p {
            margin: 0;
            color: #64748b;
            font-size: 0.8rem;
            line-height: 1.4;
          }
          .staff-reg-root .reg-footer-bottom {
            margin-top: 0.85rem;
            padding-top: 0.75rem;
            border-top: 1px dashed #e2e8f0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.78rem;
            color: #64748b;
          }
          .staff-reg-root .reg-footer-bottom a {
            color: #4f46e5;
            font-weight: 600;
            text-decoration: none;
            margin-left: 0.25rem;
          }
          .staff-reg-root .reg-footer-bottom a:hover {
            text-decoration: underline;
          }

          @media (max-width: 991.98px) {
            .staff-reg-root .reg-image-col {
              min-height: 200px;
            }
            .staff-reg-root .reg-footer-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      {/* ===== Page header ===== */}
      <div className='reg-header'>
        <div className='reg-header-inner'>
          <div className='d-flex align-items-center gap-3'>
            <span className='reg-header-icon'>
              <Icon icon='solar:user-plus-bold-duotone' width='24' />
            </span>
            <div>
              <div className='reg-breadcrumb'>
                <Icon icon='solar:home-2-bold' width='12' />
                <a href='/'>Dashboard</a>
                <Icon icon='solar:alt-arrow-right-linear' width='12' />
                <a href='/staff'>Staff</a>
                <Icon icon='solar:alt-arrow-right-linear' width='12' />
                <span>Registration</span>
              </div>
              <h2>Add New Staff Member</h2>
            </div>
          </div>

          <div className='reg-header-actions'>
            <span className='reg-header-pill'>
              <Icon icon='solar:shield-check-bold' width='14' /> Secure form
            </span>
            <span className='reg-header-pill'>
              <Icon icon='solar:bolt-bold' width='14' /> Auto validation
            </span>
          </div>
        </div>
      </div>

      <div className='reg-card'>
        <div className='row g-0'>
          {/* Left: school image with overlay */}
          <div className='col-lg-5 reg-image-col'>
            <div
              className='reg-image'
              style={{ backgroundImage: `url(${SCHOOL_IMAGE_URL})` }}
            />
            <div className='reg-image-overlay'>
              <span className='reg-brand'>
                <Icon icon='solar:bag-smile-bold-duotone' width='18' /> EduPortal
              </span>
              <div className='reg-tagline'>
                <h3>Join our teaching family.</h3>
                <p>Register staff details to set up access and assignments.</p>
              </div>
            </div>
          </div>

          {/* Right: registration form */}
          <div className='col-lg-7 reg-form-col'>
            <div className='d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3'>
              <div>
                <h4 className='reg-title'>Staff Registration</h4>
                <p className='reg-subtitle'>
                  Fill in the details below to add a new staff member.
                </p>
              </div>
              <span
                className='badge'
                style={{
                  background: "rgba(99,102,241,0.12)",
                  color: "#4f46e5",
                  fontWeight: 600,
                  padding: "0.4rem 0.7rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                }}
              >
                <Icon
                  icon='solar:shield-user-bold-duotone'
                  width='14'
                  style={{ verticalAlign: "-2px", marginRight: 4 }}
                />
                Role: Staff
              </span>
            </div>

            {loading && <Loader message={loaderMessage} />}

            {feedback && !loading && (
              <div
                className={`alert-feedback ${
                  feedback.type === "success" ? "alert-success" : "alert-error"
                } mb-3`}
              >
                <Icon
                  icon={
                    feedback.type === "success"
                      ? "solar:check-circle-bold"
                      : "solar:danger-triangle-bold"
                  }
                  width='18'
                />
                {feedback.text}
              </div>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ resetForm, isSubmitting }) => (
                <Form noValidate>
                  {/* Personal Info */}
                  <div className='reg-section-label'>
                    <Icon icon='solar:user-id-bold-duotone' width='16' />
                    Personal Information
                  </div>

                  <div className='row g-2'>
                    <div className='col-md-4'>
                      <label className='form-label'>Surname</label>
                      <Field
                        type='text'
                        name='surname'
                        className='form-control'
                        placeholder='e.g. Doe'
                      />
                      <ErrorMessage
                        name='surname'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>First Name</label>
                      <Field
                        type='text'
                        name='firstname'
                        className='form-control'
                        placeholder='e.g. Jane'
                      />
                      <ErrorMessage
                        name='firstname'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Last Name</label>
                      <Field
                        type='text'
                        name='lastname'
                        className='form-control'
                        placeholder='e.g. Smith'
                      />
                      <ErrorMessage
                        name='lastname'
                        component='div'
                        className='field-error'
                      />
                    </div>

                    <div className='col-md-4'>
                      <label className='form-label'>Date of Birth</label>
                      <Field type='date' name='dob' className='form-control' />
                      <ErrorMessage
                        name='dob'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Gender</label>
                      <Field as='select' name='gender' className='form-select'>
                        <option value=''>Select gender</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                        <option value='other'>Other</option>
                      </Field>
                      <ErrorMessage
                        name='gender'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Email</label>
                      <Field
                        type='email'
                        name='email'
                        className='form-control'
                        placeholder='name@school.com'
                      />
                      <ErrorMessage
                        name='email'
                        component='div'
                        className='field-error'
                      />
                    </div>
                  </div>

                  {/* Contact */}
                  <div className='reg-section-label'>
                    <Icon icon='solar:phone-bold-duotone' width='16' />
                    Contact &amp; Address
                  </div>
                  <div className='row g-2'>
                    <div className='col-md-4'>
                      <label className='form-label'>Mobile Number</label>
                      <Field
                        type='tel'
                        name='mobile_number'
                        className='form-control'
                        placeholder='10-digit mobile'
                        maxLength={10}
                      />
                      <ErrorMessage
                        name='mobile_number'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Emergency Contact</label>
                      <Field
                        type='tel'
                        name='emergency_contact_number'
                        className='form-control'
                        placeholder='10-digit number'
                        maxLength={10}
                      />
                      <ErrorMessage
                        name='emergency_contact_number'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label'>Date of Joining</label>
                      <Field
                        type='date'
                        name='date_of_join'
                        className='form-control'
                      />
                      <ErrorMessage
                        name='date_of_join'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-12'>
                      <label className='form-label'>Address</label>
                      <Field
                        as='textarea'
                        name='address'
                        className='form-control'
                        placeholder='Street, City, State, PIN'
                      />
                      <ErrorMessage
                        name='address'
                        component='div'
                        className='field-error'
                      />
                    </div>
                  </div>

                  {/* Work */}
                  <div className='reg-section-label'>
                    <Icon icon='solar:case-round-minimalistic-bold-duotone' width='16' />
                    Work Details
                  </div>
                  <div className='row g-2'>
                    <div className='col-md-6'>
                      <label className='form-label'>Department</label>
                      <Field
                        as='select'
                        name='department'
                        className='form-select'
                      >
                        <option value=''>Select department</option>
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name='department'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-6'>
                      <label className='form-label'>Designation</label>
                      <Field
                        as='select'
                        name='designation'
                        className='form-select'
                      >
                        <option value=''>Select designation</option>
                        {designations.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name='designation'
                        component='div'
                        className='field-error'
                      />
                    </div>
                  </div>

                  {/* Account */}
                  <div className='reg-section-label'>
                    <Icon icon='solar:lock-keyhole-bold-duotone' width='16' />
                    Account
                  </div>
                  <div className='row g-2'>
                    <div className='col-md-6'>
                      <label className='form-label'>Password</label>
                      <div className='input-group'>
                        <Field
                          type={showPassword ? "text" : "password"}
                          name='password'
                          className='form-control'
                          placeholder='Min 8 chars, mix upper, lower, number'
                        />
                        <span
                          className='input-group-text'
                          onClick={() => setShowPassword((v) => !v)}
                          role='button'
                          aria-label='Toggle password visibility'
                        >
                          <Icon
                            icon={
                              showPassword
                                ? "solar:eye-closed-bold"
                                : "solar:eye-bold"
                            }
                            width='18'
                          />
                        </span>
                      </div>
                      <ErrorMessage
                        name='password'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-6'>
                      <label className='form-label'>User Type</label>
                      <Field
                        type='text'
                        name='userType'
                        className='form-control'
                        readOnly
                      />
                    </div>
                  </div>

                  <div className='reg-actions'>
                    <button
                      type='button'
                      className='btn-reset'
                      onClick={() => {
                        resetForm();
                        setFeedback(null);
                      }}
                      disabled={loading}
                    >
                      Reset
                    </button>
                    <button
                      type='submit'
                      className='btn-submit'
                      disabled={loading || isSubmitting}
                    >
                      <Icon icon='solar:user-plus-bold' width='18' />
                      {loading ? "Saving..." : "Register Staff"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* ===== Page footer ===== */}
      <div className='reg-footer'>
        <div className='reg-footer-grid'>
          <div className='reg-footer-item'>
            <span className='reg-footer-icon'>
              <Icon icon='solar:document-text-bold-duotone' width='18' />
            </span>
            <div>
              <h6>Required documents</h6>
              <p>
                Keep ID proof, qualification, and joining letter ready for upload after this step.
              </p>
            </div>
          </div>
          <div className='reg-footer-item'>
            <span className='reg-footer-icon'>
              <Icon icon='solar:lock-keyhole-bold-duotone' width='18' />
            </span>
            <div>
              <h6>Privacy &amp; security</h6>
              <p>
                Personal details are encrypted in transit and used only for staff onboarding.
              </p>
            </div>
          </div>
          <div className='reg-footer-item'>
            <span className='reg-footer-icon'>
              <Icon icon='solar:phone-calling-bold-duotone' width='18' />
            </span>
            <div>
              <h6>Need help?</h6>
              <p>
                Reach the admin office or email <strong>support@school.com</strong> for assistance.
              </p>
            </div>
          </div>
        </div>

        <div className='reg-footer-bottom'>
          <span>
            &copy; {new Date().getFullYear()} EduPortal. All rights reserved.
          </span>
          <span>
            By registering, you agree to the
            <a href='#'>Terms</a>
            and
            <a href='#'>Privacy Policy</a>.
          </span>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistrationComponent;
