import axios from "axios";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import baseURL from "../../utils/baseUrl";
import Spinner from "./Loader";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../../assets/css/mastercom.css";
import "../../assets/css/addField.css";

const AddField = () => {
  const [stages, setStages] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);
 
  const [loading, setLoading] = useState(false);

  const tableOptions = ["Cast", "Phyically_disable", "State", "City"];

  // Optional: Yup validation schema
  const validationSchema = Yup.object({
    fieldName: Yup.string().required("Field name is required"),
    label: Yup.string().required("Label is required"),
    placeholder: Yup.string(),
    fieldTypeId: Yup.string().required("Please select field type"),
    columnType: Yup.string().required("Please select column type"),
  
    stageId: Yup.string().required("Please select stage"),
    selectedTable: Yup.string().when("fieldTypeId", {
      is: (val) => ["select", "multiselect", "radio"].includes(val), // adjust according to your fieldType names
      then: (schema) => schema.required("Please select value source table"),
      otherwise: (schema) => schema.nullable(),
    }),
    isRequired: Yup.string().required(),
    order: Yup.number()
      .min(0, "Order cannot be negative")
      .required("Order is required"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stageRes, fieldTypeRes, classesRes] = await Promise.all([
          axios.get(`${baseURL}/api/stage`),
          axios.get(`${baseURL}/api/fieldType`),
         
        ]);

        setStages(stageRes.data?.data || []);
        setFieldTypes(fieldTypeRes.data?.data || []);
       
      } catch (err) {
        console.error("API error:", err);
        // optionally show toast/notification
      }
    };

    fetchData();
  }, []);

  const getTableNames = (stageName) => {
    switch (stageName) {
      case "Personal Information":
        return { tableName: "personalinformations", tableName2: "par_student_personal_informations" };
      case "Parent Particular":
        return { tableName: "parentparticulars", tableName2: "par_parentparticulars" };
      case "Education Detail":
        return { tableName: "educationdetails", tableName2: "par_educational_details" };
      case "Other Information":
        return { tableName: "otherinformations", tableName2: "par_other_informations" };
      default:
        return { tableName: "", tableName2: "" };
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);

    try {
      const selectedStage = stages.find((s) => s.id == values.stageId);
      const { tableName, tableName2 } = getTableNames(selectedStage?.name);

      if (!tableName) {
        alert("Invalid stage selected");
        return;
      }

      const payload = {
        name: values.fieldName,
        fieldTypeId: Number(values.fieldTypeId),
        label: values.label,
        placeholder: values.placeholder,
        isRequired: values.isRequired === "true",
        tableName,
        tableName2,
        columnType: values.columnType,
        order: Number(values.order),
      };

      const res = await axios.post(
        `http://localhost:5000/api/stage/addfield/${values.stageId}`,
        payload
      );

      const { id } = res?.data?.data || {};

      if (id && values.selectedTable) {
        const payload2 = { tablename: values.selectedTable };
        await axios.post(`http://localhost:5000/api/fieldMultiple/${id}`, payload2);
      }

      alert("Field added successfully!");
      resetForm(); // optional: clear form after success

    } catch (error) {
      console.error("Submit error:", error.response?.data || error.message);
      alert("Error adding field. Check console.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="chfi-wrapper add-field-master mb-3">
      <div className="chfi-card">
      <div className="card-header">
        <div className="header-row">
          <span className="header-icon">
            <Icon icon="solar:widget-add-bold-duotone" width="20" />
          </span>
          <div>
            <h5 className="card-title">Add Field to Stage</h5>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="form-area">
        <Formik
          initialValues={{
            fieldName: "",
            label: "",
            placeholder: "",
            fieldTypeId: "",
            columnType: "VARCHAR(255)",
            
            stageId: "",
            selectedTable: "",
            isRequired: "false",
            order: "0",
          }}
          validationSchema={validationSchema} // remove if you don't want validation
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, resetForm }) => (
            <Form className="chfi-root add-field-root">
              <div >

                  <div className="row mt-3">
                  <div className="col-4"><label className="form-label">Field Name *</label></div>
                  <div className="col-8">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:text-field-focus-bold-duotone" width="18" />
                      </span>
                    <Field
                    type="text"
                    name="fieldName"
                    className="form-control"
                    placeholder="Enter field name"
                  />
                    </div>
                  </div>
                  
                  <ErrorMessage name="fieldName" component="div" className="text-danger small" />
                  </div>
                 <div className='row mt-3'>
                <div className="col-4">
                  <label className="form-label">Label *</label>
                   </div>
                  <div className="col-8">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:tag-bold-duotone" width="18" />
                      </span>
                    <Field
                    type="text"
                    name="label"
                    className="form-control"
                    placeholder="Enter label"
                  />
                    </div>
                    </div> 
                  
                  <ErrorMessage name="label" component="div" className="text-danger small" />
                  </div>
               
                <div className="row mt-3">
                <div className="col-4">
                  <label className="form-label">Placeholder</label>
                </div>
                <div className="col-8">
                  <div className="icon-field">
                    <span className="icon">
                      <Icon icon="solar:text-square-bold-duotone" width="18" />
                    </span>
                  <Field
                    type="text"
                    name="placeholder"
                    className="form-control"
                    placeholder="Enter placeholder"
                  />
                  </div>
                </div>
                </div>


                 <div className="row mt-3">
                <div className="col-4">
                  <label className="form-label">Type of Field *</label>
                  </div>
                  <div className="col-8">
                  <div className="icon-field">
                    <span className="icon">
                      <Icon icon="solar:widget-5-bold-duotone" width="18" />
                    </span>
                  <Field
                    as="select"
                    name="fieldTypeId"
                    className="form-select"
                  >
                    <option value="">Select type of field</option>
                    {fieldTypes.map((type) => (
                      <option key={type.id || type._id} value={type.id || type._id}>
                        {type.typeName}
                      </option>
                    ))}
                  </Field>
                  </div>
                  </div>
                  <ErrorMessage name="fieldTypeId" component="div" className="text-danger small" />
                  </div>

                <div className="row mt-3">
                  <div className="col-4">
                    <label className="form-label">Column Type *</label>
                  </div>
                  <div className="col-8">
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:database-bold-duotone" width="18" />
                      </span>
                    <Field
                      as="select"
                      name="columnType"
                      className="form-select"
                    >
                      <option value="VARCHAR(255)">VARCHAR(255)</option>
                      <option value="INT">INT</option>
                      <option value="BIGINT">BIGINT</option>
                      <option value="TEXT">TEXT</option>
                      <option value="DATE">DATE</option>
                      <option value="TIME">TIME</option>
                    </Field>
                    </div>
                  </div>
                  <ErrorMessage name="columnType" component="div" className="text-danger small" />
                </div>

                <div className="row mt-3">
                  <div className="col-4">
                  <label className="form-label">Stage *</label>
                  </div>
                  <div className="col-8">
                  <div className="icon-field">
                    <span className="icon">
                      <Icon icon="solar:layers-minimalistic-bold-duotone" width="18" />
                    </span>
                  <Field
                    as="select"
                    name="stageId"
                    className="form-select"
                  >
                    <option value="">Select Stage</option>
                    {stages.map((stage) => (
                      <option key={stage.id || stage._id} value={stage.id || stage._id}>
                        {stage.name}
                      </option>
                    ))}
                  </Field>
                  </div>
                  </div>
                  <ErrorMessage name="stageId" component="div" className="text-danger small" />
                </div>

                <div className="row mt-3">
                  <div className="col-4">
                  <label className="form-label">Select Values</label>
                  </div>
                  <div className="col-8">
                  <div className="icon-field">
                    <span className="icon">
                      <Icon icon="solar:list-check-bold-duotone" width="18" />
                    </span>
                  <Field
                    as="select"
                    name="selectedTable"
                    className="form-select"
                  >
                    <option value="">select values</option>
                    {tableOptions.map((elem) => (
                      <option key={elem} value={elem}>
                        {elem}
                      </option>
                    ))}
                  </Field>
                  </div>
                  </div>
                  <ErrorMessage name="selectedTable" component="div" className="text-danger small" />
                </div>

                <div className="row mt-3">
                  <div className="col-4">
                  <label className="form-label">Required</label>
                  </div>
                  <div className="col-8">
                  <div className="icon-field">
                    <span className="icon">
                      <Icon icon="solar:shield-check-bold-duotone" width="18" />
                    </span>
                  <Field
                    as="select"
                    name="isRequired"
                    className="form-select"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </Field>
                  </div>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-4">
                  <label className="form-label">Order *</label>
                  </div>
                  <div className="col-8">
                  <div className="icon-field">
                    <span className="icon">
                      <Icon icon="solar:sort-vertical-bold-duotone" width="18" />
                    </span>
                  <Field
                    type="number"
                    name="order"
                    min="0"
                    className="form-control"
                    placeholder="0"
                  />
                  </div>
                  </div>
                  <ErrorMessage name="order" component="div" className="text-danger small" />
                </div>

              </div>

              <div className="actions">
                {loading || isSubmitting ? (
                  <Spinner />
                ) : (
                  <>
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
                      <Icon icon="solar:check-circle-bold-duotone" width="18" />
                      Save Field
                    </button>
                  </>
                )}
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

export default AddField;