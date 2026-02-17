import React from 'react'
import FormWizard from './FormWizard'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PenNibStraight } from "@phosphor-icons/react";
import { getPersonalInformationForm } from '../../redux/slices/dynamicForm/personalInfoFormSlice'
import axios from 'axios'
import baseURL from '../../utils/baseUrl'

const EducationalDetailStage = () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [educationalDeatailData, setEducationalDetailData] = useState(null);
    const [edit, setEdit] = useState(false)
    const reg_no = useSelector((state) => state?.registrationNo?.reg_no);
    const wholeForm = useSelector(
        (state) => state?.personalInfoForms?.personalInfoForm?.data
    );
    console.log('whole form is:', wholeForm)
    let personalFormfields = wholeForm?.find(elem => elem.name === 'Education Detail')?.fields || [];


    useEffect(() => {
        let fetchData = async () => {
            try {
                if (reg_no) {
                    let { data } = await axios.get(`${baseURL}/api/educational-detail/${reg_no}`)
                    setEducationalDetailData(data?.data)
                    setEdit(true)
                    console.log('registration data is:', data?.data)
                }
            }
            catch (err) {
                console.log('error in other information ')
            }
        }
        fetchData()

    }, [])

    

    let initialValues = useMemo(() => {
        // if (stageData) return stageData;

        let values = { reg_no: Number(reg_no) }
        personalFormfields.forEach((elem) => {
            values[elem.name] = "";
        });
        return values;
    }, [personalFormfields]);

    initialValues = educationalDeatailData || initialValues;

    return (
        <div className="container mt-5">
            <FormWizard currentStep={Number(searchParams.get('step'))} />
            <div className="card p-4 shadow">
                <h6 className="mb-4">Educational Detail</h6>
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
                                let { data } = await axios.post(`${baseURL}/api/educational-detail`, payload)
                                let formStatusPayload = { current_step: 4, reg_no: reg_no }
                                await axios.post(`${baseURL}/api/form-status/upsert`, formStatusPayload)
                                alert("education detail added successfully!")
                                 navigate('/subject-stage?step=4')
                            }
                            if (edit) {

                                let { data } = await axios.put(`${baseURL}/api/educational-detail/${reg_no}`, payload)
                                alert("Update  successfully!")
                                 navigate('/subject-stage?step=4')

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
                                    onClick={() => navigate(`/personal-information?step=2`)}
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
