import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";
import "../../../assets/css/mastercom.css";

const initialValues = { name: "" };

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Fees type name is required")
    .min(2, "Minimum 2 characters"),
});

const AddFeesType = ({ className = "" }) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(`${baseURL}/api/fees-types`, {
        name: values.name.trim(),
      });
      setSuccessMsg("Fees type added successfully.");
      resetForm();
    } catch (error) {
      console.error("Error adding fees type:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add fees type. Please try again.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to add fees type.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className={`chfi-wrapper mb-3 ${className}`.trim()}>
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:tag-price-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Add Fees Type</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          {successMsg && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMsg}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccessMsg("")}
                aria-label="Close"
              />
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMsg}
              <button
                type="button"
                className="btn-close"
                onClick={() => setErrorMsg("")}
                aria-label="Close"
              />
            </div>
          )}

          <div className="form-area">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, resetForm }) => (
                <Form className="chfi-root">
                  {loading && <Loader message="Saving fees type…" />}

                  <div className="field-row">
                    <label className="form-label" htmlFor="fees-type-name">
                      <span className="label-dot" />
                      Name
                    </label>

                    <div className="cast-inline">
                      <div className="cast-input">
                        <div className="icon-field">
                          <span className="icon">
                            <Icon icon="solar:tag-price-bold-duotone" width="18" />
                          </span>
                          <Field
                            id="fees-type-name"
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="e.g. Tuition"
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      <div className="actions actions-inline">
                        <button
                          type="button"
                          className="btn btn-reset"
                          onClick={() => resetForm()}
                          disabled={isSubmitting || loading}
                        >
                          <Icon icon="solar:restart-bold-duotone" width="16" />
                          Reset
                        </button>
                        <button
                          type="submit"
                          className="btn btn-submit"
                          disabled={isSubmitting || loading}
                        >
                          {isSubmitting || loading ? (
                            <>
                              <Icon icon="line-md:loading-loop" width="16" />
                              Saving…
                            </>
                          ) : (
                            <>
                              <Icon icon="solar:check-circle-bold-duotone" width="18" />
                              Save
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <ErrorMessage name="name" component="div" className="text-danger field-error" />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFeesType;
