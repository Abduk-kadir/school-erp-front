import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Carousel } from "react-bootstrap";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";
import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../../assets/css/starmark.css";

const buildCarsoulImageUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${baseURL}${path}`;
};

let initialValues = {
  surname: "",
  firstname: "",
  father_name: "",
  mother_name: "",
  title: "",
  dob: "",
  gender: "",
  email: "",
  mobile_number: "",
  departmentid: "",
  designationid: "",
  staff_photo: null,
  staff_sig_photo: null,
  userType: "staff",
  address: "",
  date_of_join: "",
  emergency_contact_number: "",
  password: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  surname: Yup.string().trim().required("Surname is required").min(2, "Too short"),
  firstname: Yup.string().trim().required("First name is required").min(2, "Too short"),
  father_name: Yup.string().trim().required("Father name is required").min(2, "Too short"),
  mother_name: Yup.string().trim().required("Mother name is required").min(2, "Too short"),
  title: Yup.string().required("Title is required"),
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
  departmentid: Yup.string().required("Department is required"),
  designationid: Yup.string().required("Designation is required"),
  staff_photo: Yup.mixed().required("Staff photo is required"),
  staff_sig_photo: Yup.mixed().required("Staff signature photo is required"),
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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please re-enter password"),
});

const normalizeListResponse = (res) => {
  const payload = res?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

const getOptionId = (item) =>
  item?.id ?? item?._id ?? item?.departmentid ?? item?.designationid ?? item?.titleid ?? item?.value ?? "";

const getDepartmentLabel = (item) =>
  item?.department_name ?? item?.name ?? item?.label ?? "";

const getDesignationLabel = (item) =>
  item?.designation_name ?? item?.name ?? item?.label ?? "";

const getTitleLabel = (item) =>
  item?.title_name ?? item?.title ?? item?.name ?? item?.label ?? "";

const StaffRegistrationComponent = ({ carouselImages = [] }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: string }
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [titleOptions, setTitleOptions] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const {genericEditData,for_page} = useSelector((state) => state.genericEdit);

 useEffect(()=>{
 
  let editdata=genericEditData?.data
  if(for_page=='staff-edit'){
    initialValues=editdata
  }
 })

  useEffect(() => {
    const fetchWorkOptions = async () => {
      try {
        const [departmentRes, designationRes, titleRes] = await Promise.all([
          axios.get(`${baseURL}/api/departments`),
          axios.get(`${baseURL}/api/designations`),
          axios.get(`${baseURL}/api/titles`),
        ]);

        setDepartmentOptions(normalizeListResponse(departmentRes));
        setDesignationOptions(normalizeListResponse(designationRes));
        setTitleOptions(normalizeListResponse(titleRes));
      } catch (error) {
        console.error("Failed to fetch department/designation/title options", error);
        setFeedback({
          type: "error",
          text: error.message||error.response.data.message||"Failed to load departments, designations, and titles.",
        });
      }
    };

    fetchWorkOptions();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      setLoaderMessage("Registering staff...");
      setFeedback(null);

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "confirmPassword") return;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      if(for_page=='staff-edit' || initialValues?.id){
        await axios.put(`${baseURL}/api/staff/${initialValues.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setLoading(false);
        navigate("/dashboard/staff-master", { replace: true });
        return;
      }else{
        await axios.post(`${baseURL}/api/staff/registration`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setFeedback({
          type: "success",
          text: "Staff registered successfully.",
        });
        resetForm();
        setFileInputKey((key) => key + 1);
      }
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
            background: #ffffff;
            overflow: hidden;
          }
          .staff-reg-root .reg-image-col .reg-carousel {
            position: absolute;
            inset: 0;
            height: 100%;
          }
          .staff-reg-root .reg-image-col .carousel,
          .staff-reg-root .reg-image-col .carousel-inner,
          .staff-reg-root .reg-image-col .carousel-item {
            height: 100%;
          }
          .staff-reg-root .reg-image-col .reg-image {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-color: transparent;
          }
          .staff-reg-root .reg-image-col .carousel-caption {
            z-index: 3;
          }
          .staff-reg-root .reg-image-col .carousel-indicators {
            z-index: 3;
            margin-bottom: 0.75rem;
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
            margin-bottom: 0;
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
            line-height: 1.5;
            min-height: 2.15rem;
            color: #334155;
            background-color: #f8fafc;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
          }
          .staff-reg-root .form-select {
            padding-right: 2.25rem;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 16px 12px;
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
          .staff-reg-root .form-select:focus {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 16px 12px;
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
          {/* Left: carousel from API */}
          <div className='col-lg-5 reg-image-col'>
            {carouselImages.length > 0 ? (
              <div className="reg-carousel">
                <Carousel
                  fade
                  controls={false}
                  indicators={carouselImages.length > 1}
                  interval={4500}
                  pause={false}
                  ride="carousel"
                >
                  {carouselImages.map((image) => {
                    const src = buildCarsoulImageUrl(image.image_url);
                    const hasTitle = Boolean(image.title);
                    const hasHeading = Boolean(image.heading);
                    const hasSubheading = Boolean(image.subheading);
                    const showCaption =
                      hasTitle || hasHeading || hasSubheading;

                    return (
                      <Carousel.Item key={image.id} interval={5000}>
                        <div
                          className="reg-image"
                          style={{ backgroundImage: `url(${src})` }}
                        />
                        {showCaption && (
                          <Carousel.Caption>
                            {hasTitle && <h3>{image.title}</h3>}
                            {hasHeading && <h5>{image.heading}</h5>}
                            {hasSubheading && <p>{image.subheading}</p>}
                          </Carousel.Caption>
                        )}
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              </div>
            ) : null}
          </div>

          {/* Right: registration form */}
          <div className='col-lg-7 reg-form-col'>
            <div className='d-flex align-items-start justify-content-between flex-wrap gap-2 mb-1'>
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
              enableReinitialize={true}
              onSubmit={handleSubmit}
            >
              {({ resetForm, isSubmitting, setFieldValue }) => (
                <Form noValidate encType='multipart/form-data'>
                  <div className='row g-2'>
                    <div className='col-md-4'>
                      <label className='form-label starmark'>Title</label>
                      <Field as='select' name='title' className='form-select'>
                        <option value=''>Select Title</option>
                        {titleOptions.map((titleItem, index) => (
                          <option
                            key={`${getOptionId(titleItem)}-${index}`}
                            value={getOptionId(titleItem)}
                          >
                            {getTitleLabel(titleItem)}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name='title'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label starmark'>First Name</label>
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
                      <label className='form-label starmark'>Surname</label>
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
                      <label className='form-label starmark'>Father Name</label>
                      <Field
                        type='text'
                        name='father_name'
                        className='form-control'
                        placeholder='e.g. John'
                      />
                      <ErrorMessage
                        name='father_name'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label starmark'>Mother Name</label>
                      <Field
                        type='text'
                        name='mother_name'
                        className='form-control'
                        placeholder='e.g. Mary'
                      />
                      <ErrorMessage
                        name='mother_name'
                        component='div'
                        className='field-error'
                      />
                    </div>

                    <div className='col-md-4'>
                      <label className='form-label starmark'>Date of Birth</label>
                      <Field type='date' name='dob' className='form-control' />
                      <ErrorMessage
                        name='dob'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label starmark'>Gender</label>
                      <Field as='select' name='gender' className='form-select'>
                        <option value=''>Select Gender</option>
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
                      <label className='form-label starmark'>Email</label>
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
                  <div className='row g-2'>
                    <div className='col-md-4'>
                      <label className='form-label starmark'>Mobile Number</label>
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
                      <label className='form-label starmark'>Emergency Contact</label>
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
                      <label className='form-label starmark'>Date of Joining</label>
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
                      <label className='form-label starmark'>Address</label>
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
                  <div className='row g-2'>
                    <div className='col-md-4'>
                      <label className='form-label starmark'>Department</label>
                      <Field
                        as='select'
                        name='departmentid'
                        className='form-select'
                      >
                        <option value=''>Select Department</option>
                        {departmentOptions.map((department, index) => (
                          <option
                            key={`${getOptionId(department)}-${index}`}
                            value={getOptionId(department)}
                          >
                            {getDepartmentLabel(department)}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name='departmentid'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label starmark'>Designation</label>
                      <Field
                        as='select'
                        name='designationid'
                        className='form-select'
                      >
                        <option value=''>Select Designation</option>
                        {designationOptions.map((designation, index) => (
                          <option
                            key={`${getOptionId(designation)}-${index}`}
                            value={getOptionId(designation)}
                          >
                            {getDesignationLabel(designation)}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name='designationid'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label starmark'>Staff Photo (≤ 1 MB)</label>
                      <input
                        key={`staff-photo-${fileInputKey}`}
                        type='file'
                        name='staff_photo'
                        className='form-control'
                        accept='image/*'
                        onChange={(event) =>
                          setFieldValue(
                            "staff_photo",
                            event.currentTarget.files?.[0] || null
                          )
                        }
                      />
                      {for_page === "staff-edit" &&
                        typeof initialValues?.staff_photo === "string" &&
                        initialValues.staff_photo && (
                          <label className='form-label mt-1 mb-0 text-muted'>
                            Uploaded photo: {initialValues.staff_photo}
                          </label>
                        )}
                      <ErrorMessage
                        name='staff_photo'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      
                      <label className='form-label starmark'>Staff Signature Photo (≤ 1 MB)</label>
                      <input
                        key={`staff-signature-${fileInputKey}`}
                        type='file'
                        name='staff_sig_photo'
                        className='form-control'
                        accept='image/*'
                        onChange={(event) =>
                          setFieldValue(
                            "staff_sig_photo",
                            event.currentTarget.files?.[0] || null
                          )
                        }
                      />
                      {for_page === "staff-edit" &&
                        typeof initialValues?.staff_sig_photo === "string" &&
                        initialValues.staff_sig_photo && (
                          <label className='form-label mt-1 mb-0 text-muted'>
                            Uploaded signature: {initialValues.staff_sig_photo}
                          </label>
                        )}
                      <ErrorMessage
                        name='staff_sig_photo'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label starmark'>Password</label>
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
                    <div className='col-md-4'>
                      <label className='form-label starmark'>Re-enter Password</label>
                      <div className='input-group'>
                        <Field
                          type={showConfirmPassword ? "text" : "password"}
                          name='confirmPassword'
                          className='form-control'
                          placeholder='Re-enter the same password'
                        />
                        <span
                          className='input-group-text'
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          role='button'
                          aria-label='Toggle confirm password visibility'
                        >
                          <Icon
                            icon={
                              showConfirmPassword
                                ? "solar:eye-closed-bold"
                                : "solar:eye-bold"
                            }
                            width='18'
                          />
                        </span>
                      </div>
                      <ErrorMessage
                        name='confirmPassword'
                        component='div'
                        className='field-error'
                      />
                    </div>
                    <div className='col-md-4'>
                      <label className='form-label starmark'>User Type</label>
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
                        setFileInputKey((key) => key + 1);
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
      {/*
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
      </div>*/}
    </div>
  );
};

export default StaffRegistrationComponent;
