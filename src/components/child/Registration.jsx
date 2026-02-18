import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FormWizard from './FormWizard';
import axios from 'axios';
import baseURL from '../../utils/baseUrl';
import { useNavigate } from "react-router-dom";
import { setRegistrationNo } from '../../redux/slices/registrationNo';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getRegistrationNo } from "../../redux/slices/registrationNo";
import { useState } from 'react';


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

  class: Yup.string()
    
    .required('Please select the class'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  contact_number: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian contact_number number')
    .required('contact_number Number is required'),

 // otpVerified: Yup.boolean().oneOf([true], 'Please verify OTP'),
});

const Registration = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const reg_no = useSelector((state) => state?.registrationNo?.reg_no);
  const [reistrationData, setReistrationData] = React.useState(null);
   const [allClasses,setClasses]=useState([])
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
          setClasses(data?.data||[])
          
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
            email: reistrationData?.email || '',
            contact_number: reistrationData?.contact_number || '',
            otpVerified: false,
          }}
          validationSchema={registrationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              if(!reistrationData){
              let { data } = await axios.post(`${baseURL}/api/personal-information`, values)

              let formStatusPayload = { current_step: 2, reg_no: Number(data?.data?.reg_no) }
              console.log('formStatusPayload:', formStatusPayload)
              await axios.post(`${baseURL}/api/form-status/upsert`, formStatusPayload)
              dispatch(setRegistrationNo({ reg_no: data?.data?.reg_no }))
              alert("Form submitted successfully!")
              }
              if(reistrationData){
                let { data } = await axios.put(`${baseURL}/api/personal-information/reg_no/${reg_no}`, values)
                alert("Form updated successfully!")

              }
              
              navigate(`/personal-information?current_step=2`);
            }
            catch (err) {
              console.log('error is:', err)
              alert("Error submitting form. Please try again.")
            }


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
                    name="last_name"
                    className="form-control"
                    placeholder="Enter Sir Name / Surname"
                  />
                  <ErrorMessage name="last_name" component="div" className="text-danger small mt-1" />
                </div>

                {/* First Name */}
                <div className="col-sm-6">
                  <label className="form-label">First Name*</label>
                  <Field
                    type="text"
                    name="first_name"
                    className="form-control"
                    placeholder="Enter First Name"
                  />
                  <ErrorMessage name="first_name" component="div" className="text-danger small mt-1" />
                </div>

                {/* Father Name */}
                <div className="col-sm-6">
                  <label className="form-label">Father Name*</label>
                  <Field
                    type="text"
                    name="father_name"
                    className="form-control"
                    placeholder="Enter Father's Name"
                  />
                  <ErrorMessage name="father_name" component="div" className="text-danger small mt-1" />
                </div>

                {/* Mother Name */}
                <div className="col-sm-6">
                  <label className="form-label">Mother Name*</label>
                  <Field
                    type="text"
                    name="mother_name"
                    className="form-control"
                    placeholder="Enter Mother's Name"
                  />
                  <ErrorMessage name="mother_name" component="div" className="text-danger small mt-1" />
                </div>

                {/* Class selection */}
                <div className="col-sm-6">
                  <label className="form-label">Class </label>
                  <Field as="select" name="class" className="form-select">
                    <option value="">Select Class</option>
                    {allClasses.map(elem=>(
                      <option key={elem.id} value={elem.id}>{elem.class_name}</option>
                    ))}
                    
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

                {/* contact_number + OTP section */}
                <div className="col-sm-6">
                  <label className="form-label">contact_number Number*</label>
                  <div className="input-group">
                    <Field
                      type="tel"
                      name="contact_number"
                      className="form-control"
                      placeholder="Enter 10-digit number"
                    />
                    <button
                      type="button"
                      className="btn btn-success"

                      onClick={() => {
                        // In real app → call send OTP API
                        alert(`OTP would be sent to: ${values.contact_number}`);
                        // After successful OTP send → you can enable verify field or show input
                      }}
                    >
                      Send OTP
                    </button>
                  </div>
                  <ErrorMessage name="contact_number" component="div" className="text-danger small mt-1" />
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