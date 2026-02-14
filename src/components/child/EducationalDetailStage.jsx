import React from 'react'
import FormWizard from './FormWizard'
import { useNavigate,useSearchParams } from 'react-router-dom'
import { useEffect,useMemo } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PenNibStraight } from "@phosphor-icons/react";
import { getPersonalInformationForm } from '../../redux/slices/dynamicForm/personalInfoFormSlice'

const EducationalDetailStage = () => {
   
     const [searchParams] = useSearchParams();
      const dispatch=useDispatch()
      const navigate=useNavigate()
       const wholeForm = useSelector(
            (state) => state?.personalInfoForms?.personalInfoForm?.data
        );
        let personalFormfields = wholeForm ? wholeForm[2]?.fields : [];
        
    
       useEffect(() => {
             dispatch(getPersonalInformationForm());
            
           
          }, [dispatch]);
    
       let initialValues = useMemo(() => {
              // if (stageData) return stageData;
       
              let  values={}
               personalFormfields.forEach((elem) => {
                   values[elem.name] = "";
               });
               return values;
           }, [personalFormfields]);   
    
    return (
          <div className="container mt-5">
            <FormWizard currentStep={Number(searchParams.get('step'))}/>
            <div className="card p-4 shadow">
                <h6 className="mb-4">Other Information</h6>

                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                   // validationSchema={validationSchema}
                    onSubmit={async(values, { resetForm }) => {
                          /*  try {
                             let { data } = await axios.put(`${baseURL}/api/personal-information/reg_no/${reg_no}`, values)
                             let formStatusPayload = { current_step: 3, reg_no: reg_no}
                             await axios.post(`${baseURL}/api/form-status/upsert`, formStatusPayload)
                             alert("Form updated successfully!")

                            }
                            catch(err){
                                console.log('error is:', err)
                            }*/
                       navigate('/subject-stage?step=4')
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
                                onClick={() => navigate(`/personal-information?step=2`) }
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

export default EducationalDetailStage
