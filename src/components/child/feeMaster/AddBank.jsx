import React,{useState} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import baseURL from "../../../utils/baseUrl";
import axios from "axios";
import Loader from "../../../helper/Loader";


const AddBank = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const initialValues = {
        bank_name: "",
        status: ""
    };
    const validationSchema = Yup.object({
        bank_name: Yup.string()
            .required("Bank name is required")
            .min(2, "Minimum 2 characters"),

        status: Yup.string()
            .required("Status is required")
    });

    const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      setMessage("Adding bank...");

      await axios.post(`${baseURL}/api/banks`, values);

    
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

    return (
       
         
            <div className="card shadow">
                <div className="card-header">
                    <h6 className="mb-0">Add Bank</h6>
                </div>

                <div className="card-body">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        <Form>

                            {/* Bank Name */}
                            <div className="row">
                                   {loading && <Loader message={message} />}
                                <div className="col-6">
                                    <label className="form-label">Bank Name</label>
                                    <Field
                                        type="text"
                                        name="bank_name"
                                        className="form-control"
                                        placeholder="Enter bank name"
                                    />
                                    <div className="text-danger">
                                        <ErrorMessage name="bank_name" />
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="row mb-3">
                                <div className="col-6">
                                    <label className="form-label">Status</label>
                                    <Field as="select" name="status" className="form-select">
                                        <option value="">Select Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </Field>

                                    <div className="text-danger">
                                        <ErrorMessage name="status" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-success">
                                Save Bank
                            </button>

                        </Form>
                    </Formik>
                </div>
            </div>
       
    );
};

export default AddBank;