import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../../utils/baseUrl";
import axios from "axios";
import "../../../../assets/css/mastercom.css";

const AddDocument = () => {
  const initialValues = {
    name: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().trim().required("Document name is required"),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      await axios.post(`${baseURL}/api/document-types`, values);
      alert("Document added successfully");
      resetForm();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:document-add-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Add Document</h5>
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
              {({ isSubmitting, resetForm }) => (
                <Form className="chfi-root">
                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Document Name
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:file-text-bold-duotone" width="18" />
                      </span>
                      <Field
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter document name"
                      />
                    </div>
                    <ErrorMessage
                      name="name"
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
                    <button
                      type="submit"
                      className="btn btn-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Icon icon="line-md:loading-loop" width="16" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Icon
                            icon="solar:check-circle-bold-duotone"
                            width="18"
                          />
                          Save Document
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

export default AddDocument;
