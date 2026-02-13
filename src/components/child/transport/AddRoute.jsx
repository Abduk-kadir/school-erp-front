import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import baseURL from '../../../utils/baseUrl';
const routeSchema = Yup.object().shape({
  route_name: Yup.string()
    .required('Route name is required'),
});

const AddRoute = () => {
  return (
    <div className="mt-5 mb-5">
      

              <Formik
                initialValues={{ route_name: '' }}
                validationSchema={routeSchema}
                onSubmit={async(values, { setSubmitting, resetForm }) => {
                  try{
                  await axios.post(`${baseURL}/api/routes`,values)
                   alert('route added successfully')
                   resetForm()
                  }
                  catch(err){
                    alert('not added route')
                  }
                  
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="row">
                      {/* Input takes col-3 (or adjust as needed) */}
                      <div className="col-3">
                        <Field
                          type="text"
                          name="route_name"
                          className="form-control"
                          placeholder="enter route name"
                        />
                        <ErrorMessage
                          name="route_name"
                          component="div"
                          className="text-danger small mt-1"
                        />
                      </div>

                      {/* Button takes col-3 */}
                      <div className="col-3">
                        <button
                          type="submit"
                          className="btn btn-success px-5"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Adding...' : 'Add Route'}
                        </button>
                      </div>

                      {/* The rest of the row is empty → acts as flexible space */}
                      <div className="col-6"></div>
                    </div>
                  </Form>
                )}
              </Formik>
           
      
     
    </div>
  );
};

export default AddRoute;