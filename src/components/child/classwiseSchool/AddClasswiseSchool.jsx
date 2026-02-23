import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { PlusCircle, Trash } from "@phosphor-icons/react";
import baseURL from "../../../utils/baseUrl";
import axios from "axios";

const AddClasswiseSchool = () => {
  const [classes, setClasses] = useState([]);

  const initialValues = {
    school_name: "",
    address: "",
    contact_number: "",
    email: "",
    gst_number: "",
    logo: null,
    allSelectedClasses: [{ class_id: "" }],
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(`${baseURL}/api/classes`);
        setClasses(data?.data || []);
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mt-5 mb-5">
      <h3 className="mb-4">Add class wise school</h3>

      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { resetForm, setSubmitting, setFieldValue }) => {
          setSubmitting(true);
          try {
            const formData = new FormData();

            // Normal fields
            formData.append("school_name", values.school_name);
            formData.append("address", values.address);
            formData.append("contact_number", values.contact_number);
            formData.append("email", values.email);
            formData.append("gst_number", values.gst_number);

            // File
            if (values.logo) {
              formData.append("logo", values.logo);
            }

            // Array
            formData.append(
              "class_id",
              JSON.stringify(values.allSelectedClasses)
            );

            await axios.post(`${baseURL}/api/classwise-institute`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            // Reset form properly
            resetForm({
              values: initialValues,
            });

            // Reset file manually
            setFieldValue("logo", null);

            // Success message (only once)
            alert("Form submitted successfully!");
          } catch (err) {
            console.error(err);
            alert("Failed to submit form!");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            {/* Class selection */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Class Name</label>
                <FieldArray name="allSelectedClasses">
                  {({ push, remove }) => (
                    <div className="row g-2 border">
                      {values.allSelectedClasses.map((_, index) => (
                        <div key={index} className="position-relative col-4">
                          <Field
                            as="select"
                            name={`allSelectedClasses.${index}.class_id`}
                            className="form-select pe-5"
                          >
                            <option value="">Select Class</option>
                            {classes.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.class_name}
                              </option>
                            ))}
                          </Field>

                          <div className="position-absolute top-50 end-0 translate-middle-y pe-3 d-flex gap-2">
                            {index === values.allSelectedClasses.length - 1 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-success p-0"
                                onClick={() => push({ class_id: "" })}
                              >
                                <PlusCircle size={22} />
                              </button>
                            )}

                            {values.allSelectedClasses.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-danger p-0"
                                onClick={() => remove(index)}
                              >
                                <Trash size={22} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>
              </div>
            </div>

            {/* Other fields */}
            {[
              { label: "School Name", name: "school_name", type: "text" },
              { label: "Address", name: "address", type: "text" },
              { label: "Contact Number", name: "contact_number", type: "number" },
              { label: "Email", name: "email", type: "email" },
              { label: "GST Number", name: "gst_number", type: "text" },
            ].map((field) => (
              <div className="row g-3" key={field.name}>
                <div className="col-md-6">
                  <label className="form-label">{field.label}</label>
                  <Field
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="form-control"
                  />
                  <ErrorMessage
                    name={field.name}
                    component="div"
                    style={{ color: "red" }}
                  />
                </div>
              </div>
            ))}

            {/* Logo field */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Logo</label>
                <input
                  type="file"
                  name="logo"
                  className="form-control"
                  value={undefined} // important to reset properly
                  onChange={(event) => {
                    setFieldValue("logo", event.currentTarget.files[0]);
                  }}
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="d-flex justify-content-end mt-4">
              <button
                type="submit"
                className="btn btn-success px-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddClasswiseSchool;