import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react/dist/iconify.js';
import FormWizard from './FormWizard';
import axios from 'axios';
import baseURL from '../../utils/baseUrl';
import { useNavigate } from "react-router-dom";
import { setRegistrationNo } from '../../redux/slices/registrationNo';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getRegistrationNo } from "../../redux/slices/registrationNo";
import { useState } from 'react';
import '../../assets/css/registrationstage.css';


const registrationSchema = Yup.object().shape({
  last_name: Yup.string()
    .trim()
    .min(2, 'Too short')
    .max(50, 'Too long')
    .required('Sir Name is required'),

  first_name: Yup.string()
    .trim()
    .min(2, 'Too short')
    .max(50, 'Too long')
    .required('First Name is required'),

  father_name: Yup.string()
    .trim()
    .min(2, 'Too short')
    .max(80, 'Too long')
    .required('Father Name is required'),

  mother_name: Yup.string()
    .trim()
    .min(2, 'Too short')
    .max(80, 'Too long')
    .required('Mother Name is required'),

  class: Yup.string().required('Please select the class'),

  student_type: Yup.string().required('Please select student type'),

  gender: Yup.string()
    .oneOf(['male', 'female', 'both'], 'Please select gender')
    .required('Gender is required'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  contact_number: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian contact number')
    .required('Contact Number is required'),

 // otpVerified: Yup.boolean().oneOf([true], 'Please verify OTP'),
});

const Registration = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const reg_no = useSelector((state) => state?.registrationNo?.reg_no);
  const [reistrationData, setReistrationData] = React.useState(null);
  const [allClasses, setClasses] = useState([])
  console.log('registration no:', reg_no)
  useEffect(() => {
    let fetchData = async () => {
      try {
        if (reg_no) {
          console.log('in registration get regsitration by reg no api called')
          let { data } = await axios.get(`${baseURL}/api/personal-information/reg_no/${reg_no}`)
          setReistrationData(data?.data)
          console.log('registration data is:', data?.data)
        }
      }
      catch (err) {

      }
    }
    fetchData()

  }, [])

  useEffect(() => {
    let fetchData = async () => {
      try {
        let { data } = await axios.get(`${baseURL}/api/classes`)
        setClasses(data?.data || [])
      }
      catch (err) {

      }
    }
    fetchData()

  }, [])

  return (
    <div className='container mt-5'>
      <FormWizard currentStep={1} />
      <div className="card p-10 shadow">

        <h6 className="text-md text-neutral-500 mb-3">Registration</h6>
        <Formik
          enableReinitialize={true}
          initialValues={{
            last_name: reistrationData?.last_name || '',
            first_name: reistrationData?.first_name || '',
            father_name: reistrationData?.father_name || '',
            mother_name: reistrationData?.mother_name || '',
            class: reistrationData?.class || '',
            student_type: reistrationData?.student_type || '',
            gender: reistrationData?.gender || '',
            email: reistrationData?.email || '',
            contact_number: reistrationData?.contact_number || '',
          }}
          validationSchema={registrationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              if (!reistrationData) {
                let { data } = await axios.post(`${baseURL}/api/personal-information`, values)
                let formStatusPayload = { current_step: 2, reg_no: Number(data?.data?.reg_no) }
                console.log('formStatusPayload:', formStatusPayload)
                await axios.post(`${baseURL}/api/form-status/upsert`, formStatusPayload)
                dispatch(setRegistrationNo({ reg_no: data?.data?.reg_no }))
                alert("Form submitted successfully!")
                navigate(`/personal-information?current_step=2`);
              }
              if (reistrationData) {
                let { data } = await axios.put(`${baseURL}/api/personal-information/reg_no/${reg_no}`, values)
                alert("Form updated successfully!")
                navigate(`/personal-information?current_step=2`);
              }
            }
            catch (err) {
              console.log('error is:', err)
              alert("Error submitting form. Please try again.")
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>

              <div className="row gy-3 reg-form">
                {/* Sir Name → assuming surname / last name */}
                <div className="col-12 col-sm-6 col-md-4">
                  <label className="form-label">Sir Name*</label>
                  <div className="input-group">
                    <span className="input-group-text input-icon">
                      <Icon icon="mdi:account-outline" width="18" />
                    </span>
                    <Field
                      type="text"
                      name="last_name"
                      className="form-control"
                      placeholder="Enter Sir Name / Surname"
                    />
                  </div>
                  <ErrorMessage name="last_name" component="div" className="text-danger small mt-1" />
                </div>

                {/* First Name */}
                <div className="col-12 col-sm-6 col-md-4">
                  <label className="form-label">First Name*</label>
                  <div className="input-group">
                    <span className="input-group-text input-icon">
                      <Icon icon="mdi:account-circle-outline" width="18" />
                    </span>
                    <Field
                      type="text"
                      name="first_name"
                      className="form-control"
                      placeholder="Enter First Name"
                    />
                  </div>
                  <ErrorMessage name="first_name" component="div" className="text-danger small mt-1" />
                </div>

                {/* Father Name */}
                <div className="col-12 col-sm-6 col-md-4">
                  <label className="form-label">Father Name*</label>
                  <div className="input-group">
                    <span className="input-group-text input-icon">
                      <Icon icon="mdi:human-male" width="18" />
                    </span>
                    <Field
                      type="text"
                      name="father_name"
                      className="form-control"
                      placeholder="Enter Father's Name"
                    />
                  </div>
                  <ErrorMessage name="father_name" component="div" className="text-danger small mt-1" />
                </div>

                {/* Mother Name */}
                <div className="col-12 col-sm-6 col-md-4">
                  <label className="form-label">Mother Name*</label>
                  <div className="input-group">
                    <span className="input-group-text input-icon">
                      <Icon icon="mdi:human-female" width="18" />
                    </span>
                    <Field
                      type="text"
                      name="mother_name"
                      className="form-control"
                      placeholder="Enter Mother's Name"
                    />
                  </div>
                  <ErrorMessage name="mother_name" component="div" className="text-danger small mt-1" />
                </div>

                {/* Class selection */}
                <div className="col-12 col-sm-6 col-md-4">
                  <label className="form-label">Class*</label>
                  <div className="input-group">
                    <span className="input-group-text input-icon">
                      <Icon icon="mdi:school-outline" width="18" />
                    </span>
                    <Field as="select" name="class" className="form-select">
                      <option value="">Select Class</option>
                      {allClasses.map(elem => (
                        <option key={elem.id} value={elem.id}>{elem.class_name}</option>
                      ))}
                    </Field>
                  </div>
                  <ErrorMessage name="class" component="div" className="text-danger small mt-1" />
                </div>

                {/* Student Type */}
                <div className="col-12 col-sm-6 col-md-4">
                  <label className="form-label">Student Type*</label>
                  <div className="input-group">
                    <span className="input-group-text input-icon">
                      <Icon icon="mdi:account-tag-outline" width="18" />
                    </span>
                    <Field as="select" name="student_type" className="form-select">
                      <option value="">Select student type</option>
                      <option value="added">added</option>
                      <option value="unAdded">unAdded</option>
                    </Field>
                  </div>
                  <ErrorMessage name="student_type" component="div" className="text-danger small mt-1" />
                </div>

                {/* Gender */}
                <div className="col-12 col-md-4">
                  <label className="form-label d-block">Gender*</label>
                  <div className="gender-group d-flex flex-wrap gap-2 align-items-center mt-1">
                    {["male", "female", "both"].map((opt) => (
                      <label
                        key={opt}
                        htmlFor={`gender-${opt}`}
                        className={`gender-pill ${
                          values.gender === opt ? "is-active" : ""
                        }`}
                      >
                        <Field
                          as="input"
                          type="radio"
                          name="gender"
                          id={`gender-${opt}`}
                          value={opt}
                        />
                        <span className="gender-pill-text">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </div>

                {/* Email */}
                <div className="col-12 col-sm-6 col-md-4">
                  <label className="form-label">
                    Email*
                    <span
                      className="info-icon"
                      tabIndex={0}
                      data-tooltip="Mails are sent to this email"
                      aria-label="Mails are sent to this email"
                    >
                      <Icon icon="mdi:information-outline" width="16" />
                    </span>
                  </label>
                  <div
                    className="input-group field-tip"
                    data-tooltip="Mails are sent to this email"
                  >
                    <span className="input-group-text input-icon">
                      <Icon icon="mdi:email-outline" width="18" />
                    </span>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter Email"
                      title="Mails are sent to this email"
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                </div>

                {/* contact_number + OTP section */}
                <div className="col-12 col-sm-6 col-md-4">
                  <label className="form-label">
                    Contact Number*
                    <span
                      className="info-icon"
                      tabIndex={0}
                      data-tooltip="Messages are sent to this number"
                      aria-label="Messages are sent to this number"
                    >
                      <Icon icon="mdi:information-outline" width="16" />
                    </span>
                  </label>
                  <div
                    className="input-group field-tip"
                    data-tooltip="Messages are sent to this number"
                  >
                    <span className="input-group-text input-icon">
                      <Icon icon="mdi:phone-outline" width="18" />
                    </span>
                    <Field
                      type="tel"
                      name="contact_number"
                      className="form-control"
                      placeholder="Enter 10-digit number"
                      title="Messages are sent to this number"
                    />
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        alert(`OTP would be sent to: ${values.contact_number}`);
                      }}
                    >
                      <Icon icon="mdi:shield-key-outline" width="16" className="me-1" />
                      Send OTP
                    </button>
                  </div>
                  <ErrorMessage name="contact_number" component="div" className="text-danger small mt-1" />
                </div>

                {/* For simplicity — in real app you would show OTP input after sending */}
                {/* <div className="col-sm-12 mt-2">
                <label className="form-label">Enter OTP</label>
                <Field type="text" name="otp" className="form-control" placeholder="Enter received OTP" />
                <ErrorMessage name="otp" component="div" className="text-danger small mt-1" />
              </div> */}

                {/* Submit */}
                <div className="col-12 d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-success px-5 d-inline-flex align-items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Icon icon="line-md:loading-loop" width="16" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Icon icon="mdi:account-plus-outline" width="16" />
                        Register
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

    </div>
  );
};

export default Registration;
