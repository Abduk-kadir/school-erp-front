import { Icon } from "@iconify/react/dist/iconify.js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/mastercom.css";

const validationSchema = Yup.object().shape({
  division_name: Yup.string().trim().required("Division Name is required"),
  division_code: Yup.string().trim().required("Division Code is required"),
});

const AddDivision = () => {
  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:layers-minimalistic-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Add Division</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="form-area">
            <Formik
              initialValues={{ division_name: "", division_code: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  await axios.post(`${baseURL}/api/divisions`, values);
                  resetForm();
                  alert("Division saved successfully!");
                } catch (e) {
                  console.error("Failed to save division:", e);
                  alert("Failed to save division. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, resetForm }) => (
                <Form className="chfi-root">
                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Division Name
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:notebook-bookmark-bold-duotone" width="18" />
                      </span>
                      <Field
                        type="text"
                        name="division_name"
                        className="form-control"
                        placeholder="e.g. Division A"
                      />
                    </div>
                    <ErrorMessage
                      name="division_name"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Division Code
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:hashtag-square-bold-duotone" width="18" />
                      </span>
                      <Field
                        type="text"
                        name="division_code"
                        className="form-control"
                        placeholder="e.g. DIV-A"
                      />
                    </div>
                    <ErrorMessage
                      name="division_code"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn-reset"
                      onClick={() => resetForm()}
                      disabled={isSubmitting}
                    >
                      <Icon icon="solar:restart-bold-duotone" width="16" />
                      Reset
                    </button>
                    <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Icon icon="line-md:loading-loop" width="16" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:check-circle-bold-duotone" width="18" />
                          Save Division
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
    </div>
  );
};

export default AddDivision;
