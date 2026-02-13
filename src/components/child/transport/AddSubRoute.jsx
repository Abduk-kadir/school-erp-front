import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import baseURL from '../../../utils/baseUrl'

// Yup validation
const routeSchema = Yup.object().shape({
  route_id: Yup.string().required('Please select a route'),
  sub_route_name: Yup.string().required('Sub-route name is required'),
})

const AddSubRoute = () => {
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/routes`)
        setRoutes(data?.data || [])
      } catch (err) {
        console.log('Error fetching routes:', err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="mt-5 mb-5">
      <Formik
        initialValues={{ route_id: '', sub_route_name: '' }}
        validationSchema={routeSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await axios.post(`${baseURL}/api/subroutes`, values)
            alert('Sub-route added successfully')
            resetForm()
          } catch (err) {
            alert('Failed to add sub-route')
            console.log(err)
          }
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="row mb-3">
              {/* Route Dropdown */}
              <div className="col-3">
                <Field as="select" name="route_id" className="form-control">
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.route_name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="route_id"
                  component="div"
                  className="text-danger small mt-1"
                />
              </div>

              {/* Sub-route Name Input */}
              <div className="col-3">
                <Field
                  type="text"
                  name="sub_route_name"
                  className="form-control"
                  placeholder="Enter sub-route name"
                />
                <ErrorMessage
                  name="sub_route_name"
                  component="div"
                  className="text-danger small mt-1"
                />
              </div>

              {/* Submit Button */}
              <div className="col-3">
                <button
                  type="submit"
                  className="btn btn-success px-5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Sub-route'}
                </button>
              </div>

              {/* Flexible space */}
              <div className="col-3"></div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddSubRoute
