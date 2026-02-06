import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FormWizard from './FormWizard';
import axios from 'axios';
import baseURL from '../../utils/baseUrl';
import { useNavigate } from "react-router-dom";
const registrationSchema = Yup.object().shape({
  sirName: Yup.string()
    .trim()
    .min(2, 'Too short')
    .max(50, 'Too long')
    .required('Sir Name is required'),

  firstName: Yup.string()
    .trim()
    .min(2, 'Too short')
    .max(50, 'Too long')
    .required('First Name is required'),

  fatherName: Yup.string()
    .trim()
    .min(2, 'Too short')
    .max(80, 'Too long')
    .required('Father Name is required'),

  motherName: Yup.string()
    .trim()
    .min(2, 'Too short')
    .max(80, 'Too long')
    .required('Mother Name is required'),

  classPromoted: Yup.string()
    .oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 'Please select a valid class')
    .required('Please select the class'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  mobile: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')
    .required('Mobile Number is required'),

  otpVerified: Yup.boolean().oneOf([true], 'Please verify OTP'),
});

const Registration = () => {
    const navigate = useNavigate();
  return (
    <div className='container mt-5'>
         <FormWizard currentStep={1}/> 
    <div className="card p-10 shadow">
      
      <h6 className="text-md text-neutral-500 mb-3">Registration</h6>

      <Formik
        initialValues={{
          sirName: '',
          firstName: '',
          fatherName: '',
          motherName: '',
          classPromoted: '',
          email: '',
          mobile: '',
          otpVerified: false,
        }}
       // validationSchema={registrationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
         
          alert('Registration data submitted! (check console)');
          navigate('/personal-information')

         
         
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="row gy-3">
              {/* Sir Name → assuming surname / last name */}
              <div className="col-sm-6">
                <label className="form-label">Sir Name*</label>
                <Field
                  type="text"
                  name="sirName"
                  className="form-control"
                  placeholder="Enter Sir Name / Surname"
                />
                <ErrorMessage name="sirName" component="div" className="text-danger small mt-1" />
              </div>

              {/* First Name */}
              <div className="col-sm-6">
                <label className="form-label">First Name*</label>
                <Field
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="Enter First Name"
                />
                <ErrorMessage name="firstName" component="div" className="text-danger small mt-1" />
              </div>

              {/* Father Name */}
              <div className="col-sm-6">
                <label className="form-label">Father Name*</label>
                <Field
                  type="text"
                  name="fatherName"
                  className="form-control"
                  placeholder="Enter Father's Name"
                />
                <ErrorMessage name="fatherName" component="div" className="text-danger small mt-1" />
              </div>

              {/* Mother Name */}
              <div className="col-sm-6">
                <label className="form-label">Mother Name*</label>
                <Field
                  type="text"
                  name="motherName"
                  className="form-control"
                  placeholder="Enter Mother's Name"
                />
                <ErrorMessage name="motherName" component="div" className="text-danger small mt-1" />
              </div>

              {/* Class selection */}
              <div className="col-sm-12">
                <label className="form-label">Class for child promoted to*</label>
                <Field as="select" name="classPromoted" className="form-select">
                  <option value="">Select Class</option>
                  <option value="1">Class 1</option>
                  <option value="2">Class 2</option>
                  <option value="3">Class 3</option>
                  <option value="4">Class 4</option>
                  <option value="5">Class 5</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </Field>
                <ErrorMessage name="classPromoted" component="div" className="text-danger small mt-1" />
              </div>

              {/* Email */}
              <div className="col-sm-6">
                <label className="form-label">Email*</label>
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                />
                <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                <small className="text-danger d-block mt-1">
                  Note: Emails are sent to this address
                </small>
              </div>

              {/* Mobile + OTP section */}
              <div className="col-sm-6">
                <label className="form-label">Mobile Number*</label>
                <div className="input-group">
                  <Field
                    type="tel"
                    name="mobile"
                    className="form-control"
                    placeholder="Enter 10-digit number"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    disabled={!values.mobile || isSubmitting}
                    onClick={() => {
                      // In real app → call send OTP API
                      alert(`OTP would be sent to: ${values.mobile}`);
                      // After successful OTP send → you can enable verify field or show input
                    }}
                  >
                    Send OTP
                  </button>
                </div>
                <ErrorMessage name="mobile" component="div" className="text-danger small mt-1" />
                <small className="text-danger d-block mt-1">
                  Note: Messages / OTP will be sent to this number
                </small>
              </div>

              {/* For simplicity — in real app you would show OTP input after sending */}
              {/* <div className="col-sm-12 mt-2">
                <label className="form-label">Enter OTP</label>
                <Field type="text" name="otp" className="form-control" placeholder="Enter received OTP" />
                <ErrorMessage name="otp" component="div" className="text-danger small mt-1" />
              </div> */}

              {/* Submit */}
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-success px-5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Register'}
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