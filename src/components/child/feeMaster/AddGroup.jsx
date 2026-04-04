import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";

const initialValues = {
  groupname: "",
};

const validationSchema = Yup.object({
  groupname: Yup.string()
    .trim()
    .required("Group name is required")
    .min(1, "Group name is required"),
});

const AddGroup = ({ className = "" }) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const payload = { groupname: values.groupname.trim() };

    try {
      await axios.post(`${baseURL}/api/fee-groups`, payload);
      setSuccessMsg("Fee group added successfully.");
      resetForm();
    } catch (error) {
      console.error("Error adding fee group:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add fee group. Please try again.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to add fee group.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className={`card shadow ${className}`.trim()}>
      <div className="card-header">
        <h6 className="mb-0">Add fee group</h6>
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
              {loading && <Loader message="Saving fee group…" />}

              <div className="col-md-6">
                <label className="form-label fw-bold" htmlFor="fee-group-name">
                  Group name
                </label>
                <Field
                  id="fee-group-name"
                  type="text"
                  name="groupname"
                  className="form-control"
                  placeholder="e.g. Standard A"
                  autoComplete="off"
                />
                <ErrorMessage name="groupname" component="div" className="text-danger small mt-1" />
              </div>

              <div className="mt-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? "Saving…" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddGroup;
