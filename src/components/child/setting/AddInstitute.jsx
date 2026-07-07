import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";
import "../../../assets/css/mastercom.css";
import "../../../assets/css/loader.css";
import "../../../assets/css/editdelete.css";

const AddInstitute = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const initialValues = {
    name: "",
    code: "",
    logo: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Institute name is required"),
    code: Yup.string().required("Institute code is required"),
    logo: Yup.mixed().required("Institute logo is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      setMessage("Adding institute...");

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("code", values.code);
      formData.append("logo", values.logo);

      await axios.post(`${baseURL}/api/institute`, formData);
      alert('Institue is added successfully')

      resetForm();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:buildings-3-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Add Institute</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="form-area">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, isSubmitting, resetForm }) => (
                <Form
                  className="chfi-root"
                  encType="multipart/form-data"
                >
                 

                  {/* Institute Name */}
                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Institute Name
                    </label>

                    <div className="icon-field">
                      <span className="icon">
                        <Icon
                          icon="solar:buildings-3-bold-duotone"
                          width="18"
                        />
                      </span>

                      <Field
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter institute name"
                      />
                    </div>

                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  {/* Institute Code */}
                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Institute Code
                    </label>

                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:hashtag-bold-duotone" width="18" />
                      </span>

                      <Field
                        type="text"
                        name="code"
                        className="form-control"
                        placeholder="Enter institute code"
                      />
                    </div>

                    <ErrorMessage
                      name="code"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  {/* Institute Logo */}
                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Institute Logo
                    </label>

                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:gallery-bold-duotone" width="18" />
                      </span>

                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                          setFieldValue("logo", e.target.files[0]);
                        }}
                      />
                    </div>

                    <ErrorMessage
                      name="logo"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  {/* Actions */}
                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn-reset"
                      onClick={() => resetForm()}
                      disabled={isSubmitting || loading}
                    >
                      <Icon
                        icon="solar:restart-bold-duotone"
                        width="16"
                      />
                      Reset
                    </button>

                    <button
                      type="submit"
                      className="btn btn-submit"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? (
                        <>
                          <Icon
                            icon="line-md:loading-loop"
                            width="16"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Icon
                            icon="solar:check-circle-bold-duotone"
                            width="18"
                          />
                          Save Institute
                        </>
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      {loading && (
                    <div className="loader-overlay">
                        <Loader message={message} />
                    </div>
                )}
    </div>
  );
};

export default AddInstitute;