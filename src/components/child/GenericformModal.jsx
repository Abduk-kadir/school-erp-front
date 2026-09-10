import React from "react";
import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../../assets/css/mastercom.css";

const GenericformModal = ({
  show,
  onClose,
  initialFields = [],
  initialValues = {},
  onSubmit,
  submitButtonText = "Submit",
  successMsg,
  errorMsg,
  setSuccessMsg,
  setErrorMsg,
  cardTitle = "Assign Class and Div",
  cardIcon = "solar:document-text-bold-duotone",
}) => {
  const [fields, setFields] = React.useState(initialFields);

  React.useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  if (!show) return null;

  const generateValidationSchema = (formFields) => {
    const schemaFields = {};

    formFields.forEach((field) => {
      let validator;

      switch (field.type) {
        case "email":
          validator = Yup.string().email("Invalid email address");
          break;
        case "number":
          validator = Yup.number().typeError("Must be a number");
          break;
        case "select":
        case "textarea":
        case "text":
        default:
          validator = Yup.string();
      }

      if (field.required) {
        validator = validator.required(`${field.label} is required`);
      }

      if (field.min) validator = validator.min(field.min);
      if (field.max) validator = validator.max(field.max);

      schemaFields[field.name] = validator;
    });

    return Yup.object().shape(schemaFields);
  };

  const validationSchema = generateValidationSchema(fields);

  const renderField = (field) => {
    switch (field.type) {
      case "textarea":
        return (
          <Field
            as="textarea"
            name={field.name}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className="form-control"
          />
        );

      case "select":
        return (
          <Field name={field.name} as="select" className="form-select">
            <option value="">Select {field.label}</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        );

      case "checkbox":
        return (
          <div className="form-check">
            <Field
              type="checkbox"
              name={field.name}
              className="form-check-input"
              id={field.name}
            />
            <label className="form-check-label" htmlFor={field.name}>
              {field.label}
            </label>
          </div>
        );

      default:
        return (
          <Field
            type={field.type || "text"}
            name={field.name}
            placeholder={field.placeholder}
            className="form-control"
          />
        );
    }
  };

  return (
    <>
      <div className="chfi-modal-backdrop" onClick={onClose} />
      <div className="chfi-modal-wrap" role="dialog" aria-modal="true">
        <div className="chfi-wrapper chfi-modal">
          <section className="chfi-card" aria-label={cardTitle}>
            <div className="card-header">
              <div className="header-row">
                <div className="header-row" style={{ gap: 8, minWidth: 0 }}>
                  <span className="header-icon">
                    <Icon icon={cardIcon} width="22" />
                  </span>
                  <div className="min-w-0">
                    <h5 className="card-title">{cardTitle}</h5>
                  </div>
                </div>
                <button
                  type="button"
                  className="chfi-modal-close"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <Icon icon="solar:close-circle-bold-duotone" width="22" />
                </button>
              </div>
            </div>

            <div className="card-body">
              {successMsg && (
                <div
                  className="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  {successMsg}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccessMsg?.("")}
                  />
                </div>
              )}

              {errorMsg && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  {errorMsg}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setErrorMsg?.("")}
                  />
                </div>
              )}

              <div className="form-area" style={{ maxWidth: "100%" }}>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      if (onSubmit) await onSubmit(values);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  enableReinitialize
                >
                  {({ isSubmitting }) => (
                    <Form
                      id="generic-form-modal"
                      className="chfi-root dynamic-form"
                    >
                      {fields.map((field) => {
                        const icon =
                          field.icon || "solar:document-text-bold-duotone";
                        return (
                          <div key={field.name} className="field-row">
                            {field.type !== "checkbox" && (
                              <label
                                htmlFor={field.name}
                                className="form-label"
                              >
                                <span className="label-dot" />
                                {field.label}
                                {field.required && (
                                  <span className="text-danger"> *</span>
                                )}
                              </label>
                            )}

                            {field.type === "checkbox" ? (
                              renderField(field)
                            ) : (
                              <div className="icon-field">
                                <span className="icon">
                                  <Icon icon={icon} width="18" />
                                </span>
                                {renderField(field)}
                              </div>
                            )}

                            <ErrorMessage
                              name={field.name}
                              component="div"
                              className="text-danger field-error"
                            />
                          </div>
                        );
                      })}

                      <div className="actions">
                        <button
                          type="button"
                          className="btn btn-reset"
                          onClick={onClose}
                          disabled={isSubmitting}
                        >
                          <Icon icon="solar:close-circle-bold-duotone" width="16" />
                          Close
                        </button>
                        <button
                          type="submit"
                          className="btn btn-submit"
                          form="generic-form-modal"
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
                              {submitButtonText}
                            </>
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default GenericformModal;
