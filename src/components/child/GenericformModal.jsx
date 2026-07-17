import React from "react";
import * as Yup from 'yup';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { Icon } from '@iconify/react';



const GenericformModal = ({ show,

    onClose,
    initialFields = [],
    initialValues = {},
    onSubmit,
    submitButtonText = "Submit",
    successMsg,
    errorMsg,
    setSuccessMsg,
    cardTitle = 'Assign Class and Div',
    cardIcon = 'solar:document-text-bold-duotone',


}) => {
    if (!show) return null;
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
        <>
            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{cardTitle}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>

                        <div className="modal-body">
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

                  
                </Form>
              )}
            </Formik>
                            
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Close
                            </button>

                            <button
                                className="btn btn-primary"
                                type="submit"
                                onClick={onSubmit}

                            >
                                {submitButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default GenericformModal;