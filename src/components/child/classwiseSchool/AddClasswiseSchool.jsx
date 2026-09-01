import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import axios from "axios";
import "../../../assets/css/mastercom.css";

const initialValues = {
  school_name: "",
  address: "",
  contact_number: "",
  email: "",
  gst_number: "",
  logo: null,
  allSelectedClasses: [{ class_id: "" }],
};

const normalizeListResponse = (res) => {
  const payload = res?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getClassId = (item) => item?.id ?? item?._id ?? "";

const AddClasswiseSchool = () => {
  const [classes, setClasses] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${baseURL}/api/classes`);
        setClasses(normalizeListResponse(res));
      } catch (err) {
        console.error("Failed to load classes", err);
        setErrorMsg("Failed to load class list. Please try again later.");
      }
    }
    fetchData();
  }, []);

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:buildings-3-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Add Class Wise School</h5>
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
              onSubmit={async (values, { resetForm, setSubmitting, setFieldValue }) => {
                setSubmitting(true);
                setSuccessMsg("");
                setErrorMsg("");
                try {
                  const formData = new FormData();
                  formData.append("school_name", values.school_name);
                  formData.append("address", values.address);
                  formData.append("contact_number", values.contact_number);
                  formData.append("email", values.email);
                  formData.append("gst_number", values.gst_number);

                  if (values.logo) {
                    formData.append("logo", values.logo);
                  }

                  formData.append(
                    "class_id",
                    JSON.stringify(values.allSelectedClasses)
                  );

                  await axios.post(`${baseURL}/api/classwise-institute`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });

                  resetForm({ values: initialValues });
                  setFieldValue("logo", null);
                  setSuccessMsg("Class wise school added successfully!");
                } catch (err) {
                  console.error(err);
                  setErrorMsg(
                    err.response?.data?.message ||
                      err.response?.data?.error ||
                      "Failed to submit form. Please try again."
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, values, setFieldValue, resetForm }) => (
                <Form className="chfi-root dynamic-form">
                  <FieldArray name="allSelectedClasses">
                    {({ push, remove }) => {
                      const classRows =
                        values.allSelectedClasses?.length > 0
                          ? values.allSelectedClasses
                          : [{ class_id: "" }];
                      const isLastRow = classRows.length === 1;

                      return (
                        <div className="field-row">
                          <label className="form-label">
                            <span className="label-dot" />
                            Class Name
                          </label>
                          <div className="class-array-box">
                            {classRows.map((_, index) => (
                              <div className="class-array-row" key={index}>
                                <div className="icon-field" style={{ flex: 1 }}>
                                  <span className="icon">
                                    <Icon
                                      icon="solar:square-academic-cap-bold-duotone"
                                      width="18"
                                    />
                                  </span>
                                  <Field
                                    as="select"
                                    name={`allSelectedClasses.${index}.class_id`}
                                    className="form-select"
                                  >
                                    <option value="">Select Class</option>
                                    {classes.map((cls) => {
                                      const id = getClassId(cls);
                                      return (
                                        <option key={id} value={id}>
                                          {cls.class_name || cls.name}
                                        </option>
                                      );
                                    })}
                                  </Field>
                                </div>
                                <button
                                  type="button"
                                  className="btn-icon btn-icon-add"
                                  onClick={() => push({ class_id: "" })}
                                  aria-label="Add class row"
                                  title="Add"
                                >
                                  <Icon icon="solar:add-circle-bold-duotone" width="22" />
                                </button>
                                <button
                                  type="button"
                                  className="btn-icon btn-icon-remove"
                                  onClick={() => remove(index)}
                                  disabled={isLastRow}
                                  aria-label={`Remove class row ${index + 1}`}
                                  title="Remove"
                                >
                                  <Icon icon="solar:trash-bin-trash-bold-duotone" width="22" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }}
                  </FieldArray>

                  {[
                    {
                      label: "School Name",
                      name: "school_name",
                      type: "text",
                      placeholder: "Enter school name",
                      icon: "solar:buildings-3-bold-duotone",
                    },
                    {
                      label: "Address",
                      name: "address",
                      type: "text",
                      placeholder: "Enter address",
                      icon: "solar:map-point-bold-duotone",
                    },
                    {
                      label: "Contact Number",
                      name: "contact_number",
                      type: "text",
                      placeholder: "Enter contact number",
                      icon: "solar:phone-bold-duotone",
                    },
                    {
                      label: "Email",
                      name: "email",
                      type: "email",
                      placeholder: "Enter email",
                      icon: "solar:letter-bold-duotone",
                    },
                    {
                      label: "GST Number",
                      name: "gst_number",
                      type: "text",
                      placeholder: "Enter GST number",
                      icon: "solar:document-text-bold-duotone",
                    },
                  ].map((field) => (
                    <div className="field-row" key={field.name}>
                      <label className="form-label" htmlFor={field.name}>
                        <span className="label-dot" />
                        {field.label}
                      </label>
                      <div className="icon-field">
                        <span className="icon">
                          <Icon icon={field.icon} width="18" />
                        </span>
                        <Field
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          className="form-control"
                          placeholder={field.placeholder}
                        />
                      </div>
                      <ErrorMessage
                        name={field.name}
                        component="div"
                        className="text-danger field-error"
                      />
                    </div>
                  ))}

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Logo
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:gallery-bold-duotone" width="18" />
                      </span>
                      <input
                        type="file"
                        name="logo"
                        className="form-control"
                        accept="image/*"
                        onChange={(event) => {
                          setFieldValue("logo", event.currentTarget.files[0]);
                        }}
                      />
                    </div>
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn-reset"
                      onClick={() => {
                        resetForm({ values: initialValues });
                        setFieldValue("logo", null);
                      }}
                      disabled={isSubmitting}
                    >
                      <Icon icon="solar:restart-bold-duotone" width="16" />
                      Reset
                    </button>
                    <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Icon icon="line-md:loading-loop" width="16" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:check-circle-bold-duotone" width="18" />
                          Save School
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

export default AddClasswiseSchool;
