import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { PlusCircle, Trash } from "@phosphor-icons/react";
import baseURL from "../../../../utils/baseUrl";
import axios from "axios";
const AddDocument = () => {
   
    const initialValues = {
        name: ""
    };
    const validationSchema = Yup.object({
       name: Yup.string().required("document is required"),

    });
  
    
    
    return (
        <div className="container mt-5 mb-5">
            <h5 className="mb-4">Add Document</h5>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                    console.log('values is:', values)
                    await axios.post(`${baseURL}/api/document-types`,values)
                    resetForm()

                }}
            >
                {({ isSubmitting, values }) => (
                    <Form>
                        <div className="row g-3">

                           


                            
                            <div className="col-md-4 ">
                                <label className="form-label">Document Name</label>
                                <Field name="name" className="form-control" />
                                <ErrorMessage name="name" component="div" className="text-danger small mt-1" />
                            </div>

                            

                        </div>


                        {/* ── Compulsory Subjects ──────────────────────────────────── */}


                        <div className=" mt-3">
                            <button
                                type="submit"
                                className="btn btn-primary px-5"
                                disabled={isSubmitting}
                            >
                                Submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddDocument;