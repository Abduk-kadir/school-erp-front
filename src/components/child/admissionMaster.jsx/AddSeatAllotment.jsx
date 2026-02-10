
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
        items: categories.map((c) => ({ id: c.id, selected: false, seats: '', allot: 'no' })),
    }

    const validationSchema = Yup.object({
        items: Yup.array().of(
            Yup.object({
                id: Yup.number().required(),
                selected: Yup.boolean(),
                seats: Yup.number()
                    .when('selected', {
                        is: true,
                        then: Yup.number().typeError('Must be a number').min(0, 'Minimum 0').required('Required when selected'),
                        otherwise: Yup.number().notRequired(),
                    }),
                allot: Yup.string().oneOf(['yes', 'no']).required(),
            })
        ),
    })

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // adapt this as needed to call your API
            console.log('Submitting seat allotment', values)
            // example: await axios.post(`${baseURL}/api/seat-allotment`, values)
        } catch (err) {
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="container card ">
            <h4 className="mb-3">Seat Allotment</h4>
            <div className="col-3 mb-3">
                <select className="form-select" aria-label="Default select example">
                    <option selected>Select Class</option>
                    {
                        classes.map(elem => (
                            <option key={elem?.id} value={elem?.id}>{elem?.class_name}</option>
                        ))
                    }
                </select>
            </div>


            <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, isSubmitting }) => (
                    <Form>
                        <div className="row py-2 fw-bold  align-items-center">
                            <div className="col-3">Admission Category</div>
                            <div className="col-3">No Of Seats</div>
                            <div className="col-3">Is it Merit List</div>
                        </div>

                        {values.items.map((item, idx) => {
                            const cat = categories.find((c) => c.id === item.id) || {}
                            return (
                                <div className="row  py-2 align-items-center gap-2" key={item.id}>
                                    <div className="col-3 border d-flex align-items-center" style={{ height: "50px" }}>
                                        <div className="form-check">
                                            <Field className="form-check-input mt-1 me-1" type="checkbox" name={`items.${idx}.selected`} id={`check-${item.id}`} />
                                            <label className="form-check-label fw-bold" htmlFor={`check-${item.id}`}>
                                                {cat.name}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-3 border d-flex align-items-center" style={{ height: "50px" }}>
                                        <Field name={`items.${idx}.seats`} className='fw-bold' type="number" placeholder="0" />
                                        <div className="text-danger small"><ErrorMessage name={`items.${idx}.seats`} /></div>
                                    </div>

                                    <div className="col-3 border d-flex align-items-center " style={{ height: "50px" }}>
                                        <div className="form-check form-check-inline">
                                            <Field className="form-check-input" type="radio" name={`items.${idx}.allot`} id={`allot-yes-${item.id}`} value="yes" />
                                            <label className="form-check-label fw-bold" htmlFor={`allot-yes-${item.id}`}>Yes</label>
                                        </div>
                                        <div className="form-check form-check-inline ">
                                            <Field className="form-check-input" type="radio" name={`items.${idx}.allot`} id={`allot-no-${item.id}`} value="no" />
                                            <label className="form-check-label fw-bold" htmlFor={`allot-no-${item.id}`}>No</label>
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
