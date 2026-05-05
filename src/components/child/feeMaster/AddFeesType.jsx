import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";

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
    <div className={`fees-type-root card shadow ${className}`.trim()}>
      <style>
        {`
          .fees-type-root{
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(148,163,184,0.18);
            margin-bottom: 1rem;
          }
          .fees-type-root .card-header{
            border: 0;
            padding: 14px 18px;
            background: linear-gradient(135deg, rgba(16,185,129,0.14), rgba(34,197,94,0.12), rgba(20,184,166,0.12));
          }
          .fees-type-root .card-body{ padding: 18px; }
          .fees-type-root{
            --ft-control-h: 44px;
          }
          .fees-type-root .form-control{
            height: var(--ft-control-h);
          }
          .fees-type-root .btn-match-input{
            height: var(--ft-control-h);
            padding-top: 0;
            padding-bottom: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>

      <div className="card-header">
        <h6 className="mb-0">Add fees type</h6>
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

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {loading && <Loader message="Saving fees type…" />}

              <div className="row g-3 align-items-end">
                <div className="col-md-8 col-lg-6">
                  <label className="form-label fw-bold" htmlFor="fees-type-name">
                    Name
                  </label>
                  <Field
                    id="fees-type-name"
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Tuition"
                    autoComplete="off"
                  />
                  <ErrorMessage name="name" component="div" className="text-danger small mt-1" />
                </div>

                <div className="col-md-4 col-lg-3 d-flex justify-content-md-start justify-content-lg-start">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm px-5 btn-match-input"
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting || loading ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddFeesType;

