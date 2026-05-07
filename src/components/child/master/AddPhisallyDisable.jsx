import { Icon } from "@iconify/react/dist/iconify.js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/mastercom.css";

const validationSchema = Yup.object().shape({
  value: Yup.string().trim().required("Disability name is required"),
});

const AddPhisallyDisable = () => {
  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:accessibility-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Add Disability</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="form-area">
            <Formik
              initialValues={{ value: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  await axios.post(`${baseURL}/api/physically-disable`, { value: values.value });
                  resetForm();
                  alert("Disability saved successfully!");
                } catch (e) {
                  console.error("Failed to save disability:", e);
                  alert("Failed to save disability. Please try again.");
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
                      Disablity Name
                    </label>

                    <div className="cast-inline">
                      <div className="cast-input">
                        <div className="icon-field">
                          <span className="icon">
                            <Icon icon="solar:accessibility-bold-duotone" width="18" />
                          </span>
                          <Field
                            type="text"
                            name="value"
                            className="form-control"
                            placeholder="Enter disability name"
                          />
                        </div>
                      </div>

                      <div className="actions actions-inline">
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
                              Save
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <ErrorMessage name="value" component="div" className="text-danger field-error" />
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

export default AddPhisallyDisable;
