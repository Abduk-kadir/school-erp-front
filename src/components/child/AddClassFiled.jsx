import axios from "axios";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik"; // ← FieldArray is key
import * as Yup from "yup";
import baseURL from "../../utils/baseUrl";
import Spinner from "./Loader";
import { PlusCircle, Trash } from "@phosphor-icons/react";

const AddClassField = () => {
    const [stages, setStages] = useState([]);
    const [allClasses, setClasses] = useState([]);
    const [allFields, setFields] = useState([]);   // renamed for clarity

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stageRes, fieldRes, classesRes] = await Promise.all([
                    axios.get(`${baseURL}/api/stage`),
                    axios.get(`${baseURL}/api/allfield`),
                    axios.get(`${baseURL}/api/classes`),
                ]);

                setStages(stageRes.data?.data || []);
                setFields(fieldRes.data?.data || []);
                setClasses(classesRes.data?.data || []);
            } catch (err) {
                console.error("API error:", err);
            }
        };

        fetchData();
    }, []);

    // Validation schema — fields is now array
    const validationSchema = Yup.object({
        classId: Yup.string().required("Class is required"),
        stageId: Yup.string().required("Stage is required"),
        fields: Yup.array()
            .of(
                Yup.object().shape({
                    fieldId: Yup.string().required("Field is required"),
                    isRequired: Yup.boolean().required(),
                })
            )
            .min(1, "At least one field is required"),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setLoading(true);

        try {
            // Example payload — adjust according to your backend expectation
            const payload = {
                classId: values.classId,
                stageId: values.stageId,
                fields: values.fields.map((item) => ({
                    fieldId: item.fieldId,
                    isRequired: item.isRequired === "true" || item.isRequired === true,
                })),
            };

            // await axios.post(`${baseURL}/api/class-fields`, payload);
            console.log("Sending:", payload);

            resetForm();
            alert("Fields added successfully!"); // ← replace with toast
        } catch (error) {
            console.error("Submit error:", error);
            alert("Failed to save. Check console.");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h6 className="card-title mb-0">Add Fields to Class + Stage</h6>
            </div>

            <div className="card-body" >
                <Formik
                    initialValues={{
                        classId: "",
                        stageId: "",
                        fields: [{ filedId: null, isRequired: false }], // ← starts empty
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values }) => (
                        <Form>
                            {/* Class */}
                            <div className="row mt-3 align-items-center">
                                <div className="col-4">
                                    <label className="form-label fs-5">Class</label>
                                </div>
                                <div className="col-8">
                                    <Field as="select" name="classId" className="form-select">
                                        <option value="">Select class</option>
                                        {allClasses.map((cl) => (
                                            <option key={cl.id || cl._id} value={cl.id || cl._id}>
                                                {cl.class_name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="classId" component="div" className="text-danger small" />
                                </div>
                            </div>

                            {/* Stage */}
                            <div className="row mt-3 align-items-center">
                                <div className="col-4">
                                    <label className="form-label fs-5">Stage</label>
                                </div>
                                <div className="col-8">
                                    <Field as="select" name="stageId" className="form-select">
                                        <option value="">Select stage</option>
                                        {stages.map((stage) => (
                                            <option key={stage.id || stage._id} value={stage.id || stage._id}>
                                                {stage.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="stageId" component="div" className="text-danger small" />
                                </div>
                            </div>

                            {/* ── Dynamic Fields ── */}
                            <div className="row mt-3">
                                <div className="col-4">
                                    <label className="form-label fs-5">Add Field</label>
                                </div>
                                <div className="col-8">
                                    <FieldArray name="fields">
                                        {({ push, remove }) => (
                                            <div className="row g-2 border p-2">
                                                {values.fields.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className="row"
                                                    >
                                                        {/* Field select */}
                                                        <div className="col-4">
                                                        <Field
                                                            as="select"
                                                            name={`fields.${index}.fieldId`}
                                                            className="form-select"
                                                            style={{ flex: 2 }}
                                                        >
                                                            <option value="">Select Field</option>
                                                            {allFields.map((sub) => (
                                                                <option key={sub.id || sub._id} value={sub.id || sub._id}>
                                                                    {sub.name}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        </div>

                                                        {/* isRequired select */}
                                                        <div className="col-4">
                                                        <Field
                                                            as="select"
                                                            name={`fields.${index}.isRequired`}
                                                            className="form-select"
                                                            style={{ flex: 1 }}
                                                        >
                                                            <option value="">Is required</option>
                                                            <option value="false">No</option>
                                                            <option value="true">Yes</option>
                                                        </Field>
                                                        </div>
                                                          <div className="col-3">
                                                            <Field
                                                                type="number"
                                                                name="order"
                                                                min="0"
                                                                className="form-control"
                                                                placeholder="0"
                                                            />
                                                        </div>    
                                                       

                                                        {/* Plus / Trash icons */}
                                                        <div className="col-1 border">
                                                            {index === values.fields.length - 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-link text-success p-0"
                                                                    onClick={() => push({ fieldId: "", isRequired: false })}
                                                                >
                                                                    <PlusCircle size={22} />
                                                                </button>
                                                            )}
                                                            {values.fields.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-link text-danger p-0"
                                                                    onClick={() => remove(index)}
                                                                >
                                                                    <Trash size={22} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        <ErrorMessage
                                                            name={`fields.${index}.fieldId`}
                                                            component="div"
                                                            className="text-danger small"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </FieldArray>


                                </div>
                            </div>

                            {/* Submit */}
                            <div className="mt-5 text-end">
                                {loading || isSubmitting ? (
                                    <Spinner />
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn btn-success px-5"
                                        disabled={isSubmitting || values.fields.length === 0}
                                    >
                                        Save All Fields
                                    </button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddClassField;