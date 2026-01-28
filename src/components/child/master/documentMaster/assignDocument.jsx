import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../../../utils/baseUrl";

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
        is_mandatory: "", // we'll convert to boolean/number before send
    };
    const validationSchema = Yup.object({
        document_type_id: Yup.string().required("Document is required"),
        class_id: Yup.string().required("Class is required"),
        is_mandatory: Yup.string().required("Mandatory field is required"),
        // condition_attribute and condition_value are optional → no required
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
            // Transform values to match backend expectation
            const payload = {
                document_type_id: values.document_type_id || null, // important rename!
                class_id: values.class_id || null,
                category_id: values.category_id || null,
                condition_attribute: values.condition_attribute.trim() || null,
                condition_value: values.condition_value.trim() || null,
                // Convert is_mandatory to proper boolean or number
                is_mandatory: values.is_mandatory
            };

            console.log("Sending payload:", payload);

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
        <div className="container mt-5 mb-5">
            <h5 className="mb-4">Add Document Requirement</h5>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values }) => (
                    <Form>
                        <div className="row g-3">
                            {/* Class */}
                            <div className="col-md-4">
                                <label className="form-label">Class *</label>
                                <Field as="select" name="class_id" className="form-select">
                                    <option value="">Select class</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.class_name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="class_id"
                                    component="div"
                                    className="text-danger small mt-1"
                                />
                            </div>

                            {/* Document */}
                            <div className="col-md-4">
                                <label className="form-label">Document *</label>
                                <Field as="select" name="document_type_id" className="form-select">
                                    <option value="">Select Document</option>
                                    {documents.map((doc) => (
                                        <option key={doc.id} value={doc.id}>
                                            {doc.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="document_type_id"
                                    component="div"
                                    className="text-danger small mt-1"
                                />
                            </div>

                            {/* Category (optional) */}
                            <div className="col-md-4">
                                <label className="form-label">Category (optional)</label>
                                <Field as="select" name="category_id" className="form-select">
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            {/* Condition Attribute (optional) */}
                            <div className="col-md-4">
                                <label className="form-label">Condition Attribute (optional)</label>
                                <Field
                                    name="condition_attribute"
                                    className="form-control"
                                    placeholder="e.g. has_sibling, marital_status"
                                />
                            </div>

                            {/* Condition Value (optional) */}
                            <div className="col-md-4">
                                <label className="form-label">Condition Value (optional)</label>
                                <Field
                                    name="condition_value"
                                    className="form-control"
                                    placeholder="e.g. yes, married, true"
                                />
                            </div>

                            {/* Is Mandatory */}
                            <div className="col-md-4">
                                <label className="form-label">Is Mandatory *</label>
                               
                                    <Field as="select" name="is_mandatory" className="form-select">
                                        <option value="">Select</option>
                                        <option value={true}>Yes (Mandatory)</option>
                                        <option value={false}>No (Optional)</option>
                                    </Field>
                                
                                <ErrorMessage
                                    name="is_mandatory"
                                    component="div"
                                    className="text-danger small mt-1"
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary px-5"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Assign Document"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AssignDocument;