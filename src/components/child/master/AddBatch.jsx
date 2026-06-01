import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import baseURL from '../../../utils/baseUrl';
import Loader from '../../../helper/Loader';
import '../../../assets/css/mastercom.css';

const initialValues = {
  batch_name: '',
};

const validationSchema = Yup.object({
  batch_name: Yup.string()
    .trim()
    .required('Batch name is required')
    .min(2, 'Minimum 2 characters'),
});

const getApiMessage = (payload) => {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;
  return payload.message || payload.error || payload.msg || payload.data?.message || '';
};

const AddBatch = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setLoading(true);
    setMessage('Saving batch...');
    setSuccessMsg('');
    setErrorMsg('');

    try {
      setSubmitting(true);
      const res = await axios.post(`${baseURL}/api/batches`, values);
      setSuccessMsg(getApiMessage(res?.data) || 'Batch saved successfully');
      resetForm();
    } catch (error) {
      console.error('Failed to save batch:', error);
      const msg =
        getApiMessage(error.response?.data) ||
        error.message ||
        'Failed to save batch. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:diploma-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Add Batch</h5>
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
                onClick={() => setSuccessMsg('')}
              />
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMsg}
              <button
                type="button"
                className="btn-close"
                onClick={() => setErrorMsg('')}
              />
            </div>
          )}

          <div className="form-area">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, resetForm }) => (
                <Form className="chfi-root">
                  {loading && <Loader message={message} />}

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Batch Name
                    </label>
                    <div className="cast-inline">
                      <div className="cast-input">
                        <div className="icon-field">
                          <span className="icon">
                            <Icon icon="solar:notebook-bookmark-bold-duotone" width="18" />
                          </span>
                          <Field
                            type="text"
                            name="batch_name"
                            className="form-control"
                            placeholder="e.g. Batch 2025"
                          />
                        </div>
                      </div>

                      <div className="actions actions-inline">
                        <button
                          type="button"
                          className="btn btn-reset"
                          onClick={() => resetForm()}
                          disabled={isSubmitting || loading}
                        >
                          <Icon icon="solar:restart-bold-duotone" width="16" />
                          Reset
                        </button>
                        <button
                          type="submit"
                          className="btn btn-submit"
                          disabled={isSubmitting || loading}
                        >
                          {isSubmitting || loading ? (
                            <>
                              <Icon icon="line-md:loading-loop" width="16" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Icon icon="solar:check-circle-bold-duotone" width="18" />
                              Save Batch
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <ErrorMessage
                      name="batch_name"
                      component="div"
                      className="text-danger field-error"
                    />
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

export default AddBatch;
