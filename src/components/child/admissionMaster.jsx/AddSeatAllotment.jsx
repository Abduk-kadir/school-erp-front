
import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'

const AddSeatAllotment = () => {
    const [categories, setCategories] = useState([])
    const [classes, setClasses] = useState([])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/categories`)
                const res2 = await axios.get(`${baseURL}/api/classes`)
                setCategories(res.data?.data || [])
                setClasses(res2.data?.data || [])
            } catch (err) {
                console.error(err)
            }
        }
        fetchData()
    }, [])

    // build initial values from categories
    const initialValues = {
       
        items: categories.map((c) => ({ admission_category: c.id, class_id: '', no_seat: '',  is_merit_list: false })),
    }

   
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // adapt this as needed to call your API
            console.log('Submitting seat allotment', values.items)
            await axios.post(`${baseURL}/api/seat-allotments/bulk`, values.items)
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="container card ">
           


            <Formik enableReinitialize initialValues={initialValues}  onSubmit={handleSubmit}>
                {({ values, isSubmitting, setFieldValue }) => (
                    <Form>
                         <h4 className="mb-3">Seat Allotment</h4>
            <div className="col-3 mb-3">
                <select className="form-select" value={values.class_id} onChange={(e) => { 
                    setFieldValue('class_id', e.target.value); 
                    values.items.forEach((_, idx) => setFieldValue(`items.${idx}.class_id`, e.target.value)); 
                }} aria-label="Default select example">
                    <option value="">Select Class</option>
                    {
                        classes.map(elem => (
                            <option key={elem?.id} value={elem?.id}>{elem?.class_name}</option>
                        ))
                    }
                </select>
            </div>
                        <div className="row py-2 fw-bold  align-items-center">
                            <div className="col-3">Admission Category</div>
                            <div className="col-3">No Of Seats</div>
                            <div className="col-3">Is it Merit List</div>
                        </div>

                        {values.items.map((item, idx) => {
                            const cat = categories.find((c) => c.id === item.id) || {}
                            return (
                                <div className="row  py-2 align-items-center gap-2" key={item.admission_category}>
                                    <div className="col-3 border d-flex align-items-center" style={{ height: "50px" }}>
                                        <div className="form-check">
                                            <Field className="form-check-input mt-1 me-1" type="checkbox" name={`items.${idx}.selected`} id={`check-${item.admission_category}`} />
                                            <label className="form-check-label fw-bold" htmlFor={`check-${item.admission_category}`}>
                                                {cat.name}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-3 border d-flex align-items-center" style={{ height: "50px" }}>
                                        <Field name={`items.${idx}.no_seat`} className='fw-bold' type="number" placeholder="0" />
                                        <div className="text-danger small"><ErrorMessage name={`items.${idx}.no_seat`} /></div>
                                    </div>

                                    <div className="col-3 border d-flex align-items-center " style={{ height: "50px" }}>
                                        <div className="form-check form-check-inline">
                                            <Field className="form-check-input" type="radio" name={`items.${idx}.is_merit_list`} id={`allot-yes-${item.admission_category}`} value="yes" />
                                            <label className="form-check-label fw-bold" htmlFor={`allot-yes-${item.admission_category}`}>Yes</label>
                                        </div>
                                        <div className="form-check form-check-inline ">
                                            <Field className="form-check-input" type="radio" name={`items.${idx}.is_merit_list`} id={`allot-no-${item.admission_category}`} value="no" />
                                            <label className="form-check-label fw-bold" htmlFor={`allot-no-${item.admission_category}`}>No</label>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        <div className="d-flex justify-content-end mt-3">
                            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Allotment'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddSeatAllotment
