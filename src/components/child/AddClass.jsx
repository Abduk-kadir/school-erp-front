import { Icon } from "@iconify/react/dist/iconify.js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../utils/baseUrl";
import "../../assets/css/mastercom.css";

const validationSchema = Yup.object().shape({
  class_name: Yup.string().trim().required("Class Name is required"),
  class_code: Yup.string().trim().required("Class Code is required"),
  status: Yup.number()
    .typeError("Status is required")
    .oneOf([0, 1], "Status is invalid")
    .required("Status is required"),
 
  admission_form_fee: Yup.number()
    .typeError("Admission Form Fee must be a number")
    .min(0, "Admission Form Fee must be 0 or more")
    .required("Admission Form Fee is required"),
});

const AddClass = () => {
  return (
    <div className='chfi-wrapper mb-3'>
      <div className='chfi-card'>
        <div className='card-header'>
          <div className='header-row'>
            <span className='header-icon'>
              <Icon icon='solar:square-academic-cap-bold-duotone' width='24' />
            </span>
            <div>
              <h5 className='card-title'>Add Class</h5>
              <div className='card-subtitle'>Create a new class with fall_in_category &amp; admission fee</div>
            </div>
          </div>
        </div>
        <div className='card-body'>
         <div className='form-area'>
          <Formik
            initialValues={{
              class_name: "",
              class_code: "",
              status: 1,
            
              admission_form_fee: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const payload = { ...values, status: Number(values.status) };
                await axios.post(`${baseURL}/api/classes`, payload);
                resetForm();
                alert("Class saved successfully!");
              } catch (e) {
                console.error("Failed to save class:", e);
                alert(e.response.data.message||e.message);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, resetForm }) => (
              <Form className="chfi-root">
                <div className='field-row'>
                  <label className='form-label'>
                    <span className='label-dot' />
                    Class Name
                  </label>
                  <div className='icon-field'>
                    <span className='icon'>
                      <Icon icon='solar:notebook-bookmark-bold-duotone' width='18' />
                    </span>
                    <Field
                      type='text'
                      name='class_name'
                      className='form-control'
                      placeholder='e.g. Class 10 - A'
                    />
                  </div>
                  <ErrorMessage name="class_name" component="div" className="text-danger field-error" />
                </div>

                <div className='field-row'>
                  <label className='form-label'>
                    <span className='label-dot' />
                    Class Code
                  </label>
                  <div className='icon-field'>
                    <span className='icon'>
                      <Icon icon='solar:hashtag-square-bold-duotone' width='18' />
                    </span>
                    <Field
                      type='text'
                      name='class_code'
                      className='form-control'
                      placeholder='e.g. CLS-10A'
                    />
                  </div>
                  <ErrorMessage name="class_code" component="div" className="text-danger field-error" />
                </div>

                <div className='field-row'>
                  <label className='form-label'>
                    <span className='label-dot' />
                    Status
                  </label>
                  <div className='icon-field'>
                    <span className='icon'>
                      <Icon icon='solar:shield-check-bold-duotone' width='18' />
                    </span>
                    <Field as="select" name="status" className='form-select'>
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </Field>
                  </div>
                  <ErrorMessage name="status" component="div" className="text-danger field-error" />
                </div>

               

                <div className='field-row'>
                  <label className='form-label'>
                    <span className='label-dot' />
                    Admission Form Fee
                  </label>
                  <div className='icon-field'>
                    <span className='icon'>
                      <Icon icon='solar:wallet-money-bold-duotone' width='18' />
                    </span>
                    <Field
                      type='text'
                      name='admission_form_fee'
                      className='form-control'
                      inputMode="numeric"
                      placeholder='e.g. 500'
                    />
                  </div>
                  <ErrorMessage name="admission_form_fee" component="div" className="text-danger field-error" />
                </div>

                <div className='actions'>
                  <button
                    type='button'
                    className='btn btn-reset'
                    onClick={() => resetForm()}
                    disabled={isSubmitting}
                  >
                    <Icon icon='solar:restart-bold-duotone' width='16' />
                    Reset
                  </button>
                  <button type='submit' className='btn btn-submit' disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Icon icon='line-md:loading-loop' width='16' />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Icon icon='solar:check-circle-bold-duotone' width='18' />
                        Save Class
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

export default AddClass;
