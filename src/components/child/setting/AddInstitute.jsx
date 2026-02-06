import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";

const AddInstitute = () => {

  const initialValues = {
    name: "",
    code: "",
    logo: null
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("name is required"),
    code: Yup.string().required("code is required"),
    logo: Yup.mixed().required("logo is required"),
  });

  return (
    <div className="container mt-5">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {

          const formData = new FormData();
          formData.append("name", values.name);
          formData.append("code", values.code);
          formData.append("logo", values.logo);

          await axios.post(`${baseURL}/api/institute`, formData);

          alert("Institute Added");
          resetForm();
        }}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>

            {/* Name */}
            <div className="row mb-3">
             <h5>Add Institute</h5>
              <div className="col-5">
                <Field
                  name="name"
                  className="form-control"
                  placeholder="Institute Name"
                />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>
            </div>

            {/* Code */}
            <div className="row mb-3">
              <div className="col-5">
                <Field
                  name="code"
                  className="form-control"
                  placeholder="Institute Code"
                />
                <ErrorMessage name="code" component="div" className="text-danger" />
              </div>
            </div>

            {/* Logo */}
            <div className="row mb-3">
              <div className="col-5">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("logo", e.target.files[0]);
                  }}
                />
                <ErrorMessage name="logo" component="div" className="text-danger" />
              </div>
            </div>

            <button
              type="submit"
              className="mb-3 btn btn-success px-5"
              disabled={isSubmitting}
            >
              Submit
            </button>

          </Form>
        )}
      </Formik>

    </div>
  );
};

export default AddInstitute;
