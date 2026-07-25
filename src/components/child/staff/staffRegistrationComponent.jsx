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
import "../../../assets/css/loader.css";
import "../../../assets/css/staffRegistration.css";

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
  if(for_page=='staff-edit' && editdata){
    // Populate both password fields so re-enter match validation works in edit mode
    const passwordValue = editdata.password ?? "";
    initialValues={
      ...editdata,
      password: passwordValue,
      confirmPassword: passwordValue,
    }
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
    const isEdit = for_page == "staff-edit" || initialValues?.id;
    try {
      setLoading(true);
      setLoaderMessage(isEdit ? "Updating staff..." : "Registering staff...");
      setFeedback(null);

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "confirmPassword") return;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      if(isEdit){
        await axios.put(`${baseURL}/api/staff/${initialValues.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
      {loading && (
        <div className="loader-overlay">
          <Loader message={loaderMessage} />
        </div>
      )}
    </div>
  );
};

export default StaffRegistrationComponent;
