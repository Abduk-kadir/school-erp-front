import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react/dist/iconify.js';
import '../../../assets/css/mastercom.css';

const DepartmentAndDesignation = ({
  initialFields = [],
  initialValues = {},
  onSubmit,
  submitButtonText = "Submit",
  resetButtonText = "Reset",
  handleReset,
  successMsg,
  errorMsg,
  setSuccessMsg,
  setErrorMsg,
  cardTitle = 'Master',
  cardIcon = 'solar:document-text-bold-duotone',
}) => {
  const [fields, setFields] = React.useState(initialFields);

  // Generate Yup validation schema dynamically
  const generateValidationSchema = (formFields) => {
    const schemaFields = {};

    formFields.forEach((field) => {
      let validator;

      switch (field.type) {
        case 'email':
          validator = Yup.string().email('Invalid email address');
          break;
        case 'number':
          validator = Yup.number().typeError('Must be a number');
          break;
        case 'textarea':
        case 'text':
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
      case 'textarea':
        return (
          <Field
            as="textarea"
            name={field.name}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className="form-control"
          />
        );

      case 'select':
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

      case 'checkbox':
        return (
          <div className="form-check">
            <Field type="checkbox" name={field.name} className="form-check-input" id={field.name} />
            <label className="form-check-label" htmlFor={field.name}>
              {field.label}
            </label>
          </div>
        );

      default:
        return (
          <Field
            type={field.type || 'text'}
            name={field.name}
            placeholder={field.placeholder}
            className="form-control"
          />
        );
    }
  };

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon={cardIcon} width="24" />
            </span>
            <div>
              <h5 className="card-title">Add {cardTitle}</h5>
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
                onClick={() => setSuccessMsg?.('')}
              />
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMsg}
              <button
                type="button"
                className="btn-close"
                onClick={() => setErrorMsg?.('')}
              />
            </div>
          )}
          <div className="form-area">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                try {
                  await onSubmit(values);
                  resetForm();
                } finally {
                  setSubmitting(false);
                }
              }}
              enableReinitialize
            >
              {({ isSubmitting, resetForm, values }) => (
                <Form className="chfi-root dynamic-form">
                  {fields.map((field) => {
                    const icon = field.icon || 'solar:document-text-bold-duotone';
                    return (
                      <div key={field.name} className="field-row">
                        {field.type !== 'checkbox' && (
                          <label htmlFor={field.name} className="form-label">
                            <span className="label-dot" />
                            {field.label}
                            {field.required && <span className="text-danger"> *</span>}
                          </label>
                        )}

                        {field.type === 'checkbox' ? (
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
                      onClick={() => {
                        resetForm();
                        handleReset?.(values);
                      }}
                      disabled={isSubmitting}
                    >
                      <Icon icon="solar:restart-bold-duotone" width="16" />
                      {resetButtonText}
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
      </div>
    </div>
  );
};

export default DepartmentAndDesignation;