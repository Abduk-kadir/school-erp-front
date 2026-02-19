import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';           // ← make sure this is imported
import FormWizard from './FormWizard';
import baseURL from '../../utils/baseUrl';
import { useSelector } from 'react-redux';

const validationSchema = Yup.object({
  is_taken: Yup.string()
    .oneOf(['yes', 'no'], 'Please select Yes or No')
    .required('This field is required'),
});

const TransportDetailStage = () => {
  const [searchParams] = useSearchParams();
  const [subroutes, setSubRoutes] = useState([]);
  const [personalData, setPersonalData] = useState({})
  const navigate = useNavigate();
  const reg_no = useSelector((state) => state?.registrationNo?.reg_no);
  const currentStep = Number(searchParams.get('step')) || 6; // fallback
  const [editData, setEditData] = useState({})
  const [edit, setEdit] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          axios.get(`${baseURL}/api/subroutes`),
          axios.get(`${baseURL}/api/student-transport/student/${reg_no}`),
          axios.get(`${baseURL}/api/personal-information/reg_no/${reg_no}`)
        ]);

        // subroutes response
        if (results[0].status === "fulfilled") {
          setSubRoutes(results[0].value.data?.data || []);
        }

        // transport response
        if (results[1].status === "fulfilled") {
          const transportData = results[1].value.data?.data;
          if (transportData) {
            setEditData(transportData);
            setEdit(true);
          }
        } 
         if (results[2].status === "fulfilled") {
           setPersonalData(results[2].value?.data?.data);
        } 
        
        else {
          
        }

      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    if (reg_no) {
      fetchData();
    }
  }, []);


  console.log('sub routes,', subroutes)
  console.log('edit data:', editData)
  // get unique routes from subroutes
  const uniqueRoutes = [
    ...new Map(subroutes.map(item => [item.Route.id, item.Route])).values()
  ];
  console.log('uniqur route', uniqueRoutes)

  return (
    <div className="container ">
      <FormWizard currentStep={currentStep} />

      <div className="d-flex justify-content-center">

        <div className="card p-3" style={{ width: '80%' }}>
          <div className=''> 
          <div className="d-flex justify-content-between gap-3 mb-3">
                    <h6 className="">Transport Detail</h6>

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
                </div>
          <Formik
            enableReinitialize
            initialValues={{
              reg_no: reg_no,
              is_taken: editData?.is_taken || '',
              route_id: editData?.route_id || null,
              sub_route_id: editData?.sub_route_id || null
            }}

            onSubmit={async (values) => {

              console.log('Form submitted:', values);

              try {
                if (!edit) {
                  await axios.post(`${baseURL}/api/student-transport`, values)
                  let formStatusPayload = { current_step: 7, reg_no: reg_no }
                  await axios.post(`${baseURL}/api/form-status/upsert`, formStatusPayload)
                  alert('transport details are saved')
                  navigate(`/other-information-stage?step=7`)
                }
                if (edit) {

                  await axios.patch(`${baseURL}/api/student-transport/${editData?.id}`, values)
                  navigate(`/other-information-stage?step=7`)
                  alert('transport updated success fully')

                }
              }
              catch (err) {
                // alert(err)
              }

            }}
          >
            {({ isValid, dirty, values, handleSubmit, setFieldValue }) => (
              <Form>
                <div className="row mb-5 align-items-center">
                  <div className="col-6">
                    <h6 className="mb-0">Do you want Transport Service?</h6>
                  </div>

                  <div className="col-4">
                    <Field as="select" name="is_taken" className="form-select">
                      <option value="">Select Route </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </Field>
                    <ErrorMessage
                      name="is_taken"
                      component="div"
                      className="text-danger small mt-1"
                    />
                  </div>
                </div>


                {values.is_taken == 'yes' && <div className="row mb-5 align-items-center">
                  <div className="col-6">
                    <h6 className="mb-0">Select Route</h6>
                  </div>
                  <div className='col-4'>
                    <Field as="select" name="route_id" className="form-select">
                      <option value="">Select Route</option>
                      {uniqueRoutes.map(route => (
                        <option key={route.id} value={String(route.id)}>
                          {route.route_name}
                        </option>
                      ))}
                    </Field>

                  </div>
                </div>
                }

                {values.is_taken == 'yes' && <div className="row mb-5 align-items-center">
                  <div className="col-6">
                    <h6 className="mb-0">Select Sub Routes</h6>
                  </div>
                  <div className='col-4'>
                    <Field as="select" name="sub_route_id" className="form-select">
                      <option value=''>Select Sub Route</option>
                      {
                        subroutes.map(elem => {

                          if (elem.route_id == values.route_id) {
                            return <option value={elem.id}>{elem.sub_route_name}</option>
                          }

                        }

                        )
                      }

                    </Field>
                  </div>
                </div>
                }





                {/* We don't use form submit button → we control Next ourselves */}
                <div className="d-flex justify-content-end gap-3 mt-5">
                  <button
                    type="button"
                    className="btn btn-success px-5"
                    onClick={() => navigate(`/parent-particular-stage?step=5`)}
                  >
                    Prev
                  </button>

                  <button
                    type="button"
                    className="btn btn-success px-5"

                    onClick={handleSubmit} // ← this triggers validation + onSubmit
                  >
                    Next
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default TransportDetailStage;