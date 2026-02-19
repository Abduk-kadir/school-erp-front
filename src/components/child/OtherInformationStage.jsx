import React, { useState } from 'react'
import FormWizard from './FormWizard'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PenNibStraight } from "@phosphor-icons/react";
import { getPersonalInformationForm } from '../../redux/slices/dynamicForm/personalInfoFormSlice'
import axios from 'axios'
import baseURL from '../../utils/baseUrl'

const OtherInformationStage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [otherInformationData, setotherInformationData] = useState(null);
  const [personalData, setPersonalData] = useState({})
  const [edit, setEdit] = useState(false)
  const reg_no = useSelector((state) => state?.registrationNo?.reg_no);
  const wholeForm = useSelector(
    (state) => state?.personalInfoForms?.personalInfoForm?.data
  );

  let personalFormfields = wholeForm?.find(elem => elem.name === 'Other Information')?.fields || [];





  useEffect(() => {
    let fetchData = async () => {
      try {
        if (reg_no) {
         
          const results = await Promise.allSettled([
            axios.get(`${baseURL}/api/other-information/${reg_no}`),
            axios.get(`${baseURL}/api/personal-information/reg_no/${reg_no}`)
          ]);

          if (results[0].status === "fulfilled") {

            setotherInformationData(results[0].value?.data?.data)
            setEdit(true)



          }
          if (results[1].status === "fulfilled") {

            console.log('personal Data**********', results[1].value?.data?.data)
            setPersonalData(results[1].value?.data?.data);
          }



        }
      }
      catch (err) {
        console.log('error in other information ')
      }
    }
    fetchData()

  }, [reg_no])


  let initialValues = useMemo(() => {
    // if (stageData) return stageData;

    let values = { reg_no: reg_no }
    personalFormfields.forEach((elem) => {
      values[elem.name] = "";
    });
    return values;
  }, []);
  initialValues = otherInformationData || initialValues;

  /*   const validationSchema = Yup.object(
             personalFormfields.reduce((schema, field) => {
     
                 schema[field.name] = Yup.string().required(`${field.label} is required`);
     
     
                 return schema;
             },
             ));   
   */

  return (


    <div className="container mt-5">
      <FormWizard currentStep={Number(searchParams.get('step'))} />
      <div className="card p-10 shadow">
        <div className="d-flex justify-content-between gap-3 ">
          <h6 className="mb-4">Other Information</h6>

          <button
            type="Next"
            className="btn btn-success"
            onClick={() => navigate('/')}

          >
            Logout
          </button>
        </div>
        <div className='row mb-5'>
          <div className='col-3'>
            <label className="form-label">Reg NO</label>
            <input className='form-control' value={reg_no} disabled />
          </div>
          <div className='col-3'>
            <label className="form-label">First Name</label>
            <input className='form-control' value={personalData?.first_name} disabled />

          </div>
          <div className='col-3'>
            <label className="form-label">Last Name</label>
            <input className='form-control' value={personalData?.last_name} disabled />
          </div>
          <div className='col-3'>
            <label className="form-label">Class</label>
            <input className='form-control' value={personalData?.class} disabled />
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          // validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {

            const payload = { ...values };// this thing i used beacuse when edit created and updated date come
            delete payload?.createdAt;
            delete payload?.updatedAt;

            try {
              if (!edit) {

                let { data } = await axios.post(`${baseURL}/api/other-information`, payload)
                let formStatusPayload = { current_step: 8, reg_no: reg_no }

                await axios.post(`${baseURL}/api/form-status/upsert`, formStatusPayload)
                alert("Other information is added successfully!")
                navigate('/declaration-stage?step=8')
              }
              else {

                let { data } = await axios.patch(`${baseURL}/api/other-information/${reg_no}`, payload)
                alert("Update  successfully!")
                navigate('/declaration-stage?step=8')
              }
            }
            catch (err) {
              console.log('error is:', err)
            }


          }}


        >
          {({ isSubmitting }) => (
            <Form>
              <div className="row">










                {personalFormfields.map((elem) => (
                  <div className="col-3 mb-3" key={elem.name}>
                    <label className="form-label">{elem.label}</label>

                    {elem.type === "dropdown" ? (
                      <Field as="select" name={elem.name} className="form-select">
                        <option value="">{elem.placeholder}</option>
                        {elem.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.value}
                          </option>
                        ))}
                      </Field>
                    ) : (
                      <Field
                        name={elem.name}
                        className="form-control"
                        placeholder={elem.placeholder}
                      />
                    )}

                    <ErrorMessage
                      name={elem.name}
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end gap-3 mb-10">
                <button
                  type="Previous"
                  className="btn btn-success mt-3 px-5"
                  onClick={() => navigate(`/transport-detail-stage?step=6`)}
                >
                  Prev
                </button>
                <button
                  type="Next"
                  className="btn btn-success mt-3 px-5"
                  disabled={isSubmitting}
                >
                  Next
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>


  )
}

export default OtherInformationStage
