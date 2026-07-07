import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../../utils/baseUrl";
import "../../../../assets/css/mastercom.css";

const AssignDocument = () => {
  const [classes, setClasses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [documents, setDocuments] = useState([]);

  const initialValues = {
    document_type_id: "",
    class_id: "",
    category_id: "",
    condition_attribute: "",
    condition_value: "",
    is_mandatory: "",
  };

  const validationSchema = Yup.object({
    document_type_id: Yup.string().required("Document is required"),
    class_id: Yup.string().required("Class is required"),
    is_mandatory: Yup.string().required("Mandatory field is required"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, categoriesRes, docsRes] = await Promise.all([
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/categories`),
          axios.get(`${baseURL}/api/document-types`),
        ]);

        setClasses(classesRes?.data?.data || []);
        setCategories(categoriesRes?.data?.data || []);
        setDocuments(docsRes?.data?.data || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const payload = {
        document_type_id: values.document_type_id || null,
        class_id: values.class_id || null,
        category_id: values.category_id || null,
        condition_attribute: values.condition_attribute?.trim() || null,
        condition_value: values.condition_value?.trim() || null,
        is_mandatory: values.is_mandatory,
      };

      await axios.post(`${baseURL}/api/requirement-documents`, payload);

      alert("Document requirement assigned successfully!");
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      alert(
        "Failed to assign document: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:clipboard-check-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Assign Document Requirement</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="form-area">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, resetForm }) => (
                <Form className="chfi-root">
                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Class
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon
                          icon="solar:square-academic-cap-bold-duotone"
                          width="18"
                        />
                      </span>
                      <Field as="select" name="class_id" className="form-select">
                        <option value="">Select class</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.class_name}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage
                      name="class_id"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Document
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:document-add-bold-duotone" width="18" />
                      </span>
                      <Field
                        as="select"
                        name="document_type_id"
                        className="form-select"
                      >
                        <option value="">Select document</option>
                        {documents.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage
                      name="document_type_id"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Category
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:widget-bold-duotone" width="18" />
                      </span>
                      <Field
                        as="select"
                        name="category_id"
                        className="form-select"
                      >
                        <option value="">All categories (optional)</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Condition Attribute
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:code-bold-duotone" width="18" />
                      </span>
                      <Field
                        name="condition_attribute"
                        className="form-control"
                        placeholder="e.g. has_sibling, marital_status"
                      />
                    </div>
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Condition Value
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:text-field-bold-duotone" width="18" />
                      </span>
                      <Field
                        name="condition_value"
                        className="form-control"
                        placeholder="e.g. yes, married, true"
                      />
                    </div>
                  </div>

                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Is Mandatory
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:shield-check-bold-duotone" width="18" />
                      </span>
                      <Field
                        as="select"
                        name="is_mandatory"
                        className="form-select"
                      >
                        <option value="">Select</option>
                        <option value="true">Yes (Mandatory)</option>
                        <option value="false">No (Optional)</option>
                      </Field>
                    </div>
                    <ErrorMessage
                      name="is_mandatory"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn-reset"
                      onClick={() => resetForm()}
                      disabled={isSubmitting}
                    >
                      <Icon icon="solar:restart-bold-duotone" width="16" />
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-submit"
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
                          Assign Document
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

export default AssignDocument;
