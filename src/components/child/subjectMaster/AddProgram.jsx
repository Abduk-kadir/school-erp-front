
import { useEffect, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PenNibStraight } from "@phosphor-icons/react";
import baseURL from "../../../utils/baseUrl";
import axios from "axios";
const AddProgram = () => {
    const initialValues = {
         program_name: ""
    };

    const validationSchema = Yup.object(
        {
            program_name: Yup.string().required("prgram name is required"),
           
        }
    );


    return (
        <div className="container mt-5 mb-5">

            <h3 className="mb-6">Add Program </h3>
            <label className="form-label">Program Name</label>

            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                    console.log('selected value:', values);
                    await axios.post(`${baseURL}/api/programs`, values)
                    alert("Form submitted successfully!");
                    resetForm();
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="row gap-4">
                            <div className="col-5 mb-1">
                               
                                <Field name="program_name" type="text" className='form-control' />
                                <ErrorMessage
                                    name="program_name"
                                    component="div"
                                    className="text-danger mt-1"
                                />

                            </div>
                            <div className="col-2">
                                <button
                                type="submit"
                                className="btn btn-primary px-5"
                                disabled={isSubmitting}
                            >
                                Submit
                            </button>

                            </div>
                            
                            

                        </div>

                       
                    </Form>
                )}
            </Formik>

        </div>
    );
};

export default AddProgram;
