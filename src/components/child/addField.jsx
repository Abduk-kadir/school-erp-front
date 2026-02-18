import axios from "axios";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import baseURL from "../../utils/baseUrl";
import Spinner from "./Loader";

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

  const getTableNameAndColumnType = (stageName) => {
    switch (stageName) {
      case "Personal Information":
        return { tableName: "personalinformations", columnType: "VARCHAR(255)" };
      case "Parent Particular":
        return { tableName: "parentparticulars", columnType: "VARCHAR(255)" };
      case "Education Detail":
        return { tableName: "educationdetails", columnType: "VARCHAR(255)" };
      case "Other Information":
        return { tableName: "otherinformations", columnType: "VARCHAR(255)" };
      default:
        return { tableName: "", columnType: "" };
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);

    try {
      const selectedStage = stages.find((s) => s.id == values.stageId);
      const { tableName, columnType } = getTableNameAndColumnType(selectedStage?.name);

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
        columnType,
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
    <div className="card">
      <div className="card-header">
        <h6 className="card-title mb-0">Add Field to Stage</h6>
      </div>

      <div className="card-body" style={{width:"50%"}}>
        <Formik
          initialValues={{
            fieldName: "",
            label: "",
            placeholder: "",
            fieldTypeId: "",
            
            stageId: "",
            selectedTable: "",
            isRequired: "false",
            order: "0",
          }}
          validationSchema={validationSchema} // remove if you don't want validation
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <div >

                  <div className="row mt-3">
                  <div className="col-4"><label className="form-label">Field Name *</label></div>
                  <div className="col-8">
                    <Field
                    type="text"
                    name="fieldName"
                    className="form-control"
                    placeholder="Enter field name"
                  />
                  </div>
                  
                  <ErrorMessage name="fieldName" component="div" className="text-danger small" />
                  </div>
                 <div className='row mt-3'>
                <div className="col-4">
                  <label className="form-label">Label *</label>
                   </div>
                  <div className="col-8">
                    <Field
                    type="text"
                    name="label"
                    className="form-control"
                    placeholder="Enter label"
                  />
                    </div> 
                  
                  <ErrorMessage name="label" component="div" className="text-danger small" />
                  </div>
               
                <div className="row mt-3">
                <div className="col-4">
                  <label className="form-label">Placeholder</label>
                </div>
                <div className="col-8">
                  <Field
                    type="text"
                    name="placeholder"
                    className="form-control"
                    placeholder="Enter placeholder"
                  />
                </div>
                </div>


                 <div className="row mt-3">
                <div className="col-4">
                  <label className="form-label">Type of Field *</label>
                  </div>
                  <div className="col-8">
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
                  <ErrorMessage name="fieldTypeId" component="div" className="text-danger small" />
                  </div>
                

                
                <div className="row mt-3">
                  <div className="col-4">
                  <label className="form-label">Stage *</label>
                  </div>
                  <div className="col-8">
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
                  <ErrorMessage name="stageId" component="div" className="text-danger small" />
                </div>

                <div className="row mt-3">
                  <div className="col-4">
                  <label className="form-label">Select Values</label>
                  </div>
                  <div className="col-8">
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
                  <ErrorMessage name="selectedTable" component="div" className="text-danger small" />
                </div>

                <div className="row mt-3">
                  <div className="col-4">
                  <label className="form-label">Required</label>
                  </div>
                  <div className="col-8">
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

                <div className="row mt-3">
                  <div className="col-4">
                  <label className="form-label">Order *</label>
                  </div>
                  <div className="col-8">
                  <Field
                    type="number"
                    name="order"
                    min="0"
                    className="form-control"
                    placeholder="0"
                  />
                  </div>
                  <ErrorMessage name="order" component="div" className="text-danger small" />
                </div>

              </div>

              <div className="mt-5">
                {loading || isSubmitting ? (
                  <Spinner />
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Submit
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

export default AddField;