import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/mastercom.css";

const initialValues = {
  classid: "",
  divisions: [],
};

const validationSchema = Yup.object({
  classid: Yup.string().trim().required("Class is required"),
  divisions: Yup.array()
    .of(Yup.string().trim().required())
    .min(1, "Select at least one division"),
});

const normalizeListResponse = (res) => {
  const payload = res?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getOptionId = (item) => item?.id ?? item?._id ?? "";

const MultiChipSelect = ({
  label,
  fieldName,
  options,
  optionLabel,
  values,
  setFieldValue,
  disabled = false,
}) => {
  const selected = (values[fieldName] || []).filter(Boolean).map(String);
  const available = options.filter(
    (o) => !selected.includes(String(getOptionId(o)))
  );

  const handleAdd = (e) => {
    const val = e.target.value;
    if (!val || selected.includes(String(val))) return;
    setFieldValue(fieldName, [...selected, String(val)]);
    e.target.value = "";
  };

  const handleRemove = (val) => {
    setFieldValue(
      fieldName,
      selected.filter((v) => v !== val)
    );
  };

  const getLabel = (id) => {
    const opt = options.find((o) => String(getOptionId(o)) === String(id));
    return opt ? optionLabel(opt) : id;
  };

  return (
    <div className="field-row" style={{ alignItems: "flex-start" }}>
      <label className="form-label" style={{ paddingTop: 10 }}>
        <span className="label-dot" />
        {label}
      </label>
      <div style={{ width: "100%" }}>
        <div className="chip-select-box">
          {selected.map((val) => (
            <span className="chip-item" key={val}>
              {getLabel(val)}
              <button
                type="button"
                className="chip-remove"
                onClick={() => handleRemove(val)}
              >
                <Icon icon="solar:close-square-bold" width="14" />
              </button>
            </span>
          ))}
          <select
            className="chip-select-input"
            onChange={handleAdd}
            value=""
            disabled={disabled}
          >
            <option value="">+ Select {label}</option>
            {available.map((o) => (
              <option key={getOptionId(o)} value={getOptionId(o)}>
                {optionLabel(o)}
              </option>
            ))}
          </select>
        </div>
        <ErrorMessage
          name={fieldName}
          component="div"
          className="text-danger field-error"
        />
      </div>
    </div>
  );
};

const AddClassDivision = () => {
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [classRes, divRes] = await Promise.all([
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/divisions`),
        ]);
        setClasses(normalizeListResponse(classRes));
        setDivisions(normalizeListResponse(divRes));
      } catch (error) {
        console.error("Failed to load class or division options", error);
      }
    };
    fetchOptions();
  }, []);

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:link-circle-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Add Class Division Mapping</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="form-area" style={{ maxWidth: "100%" }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const classid = Number(values.classid);
                  const payload = {
                    rows: values.divisions
                      .filter(Boolean)
                      .map((divisionid) => ({
                        classid,
                        divisionid: Number(divisionid),
                      })),
                  };

                  await axios.post(`${baseURL}/api/class-div-map-masters`, payload);
                  resetForm();
                  alert("Class division mapping saved successfully!");
                } catch (error) {
                  console.error("Failed to save class division mapping:", error);
                  alert(
                    error?.response?.data?.message ||
                      error?.message ||
                      "Failed to save class division mapping. Please try again."
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, resetForm, values, setFieldValue }) => (
                <Form className="chfi-root">
                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Class
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:square-academic-cap-bold-duotone" width="18" />
                      </span>
                      <Field as="select" name="classid" className="form-select">
                        <option value="">Select Class</option>
                        {classes.map((cls) => {
                          const id = getOptionId(cls);
                          return (
                            <option key={id} value={id}>
                              {cls.class_name || cls.name}
                            </option>
                          );
                        })}
                      </Field>
                    </div>
                    <ErrorMessage
                      name="classid"
                      component="div"
                      className="text-danger field-error"
                    />
                  </div>

                  <MultiChipSelect
                    label="Division"
                    fieldName="divisions"
                    options={divisions}
                    optionLabel={(d) => d?.division_name || d?.name || ""}
                    values={values}
                    setFieldValue={setFieldValue}
                    disabled={!values.classid}
                  />

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
                    <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Icon icon="line-md:loading-loop" width="16" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:check-circle-bold-duotone" width="18" />
                          Save Mapping
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

export default AddClassDivision;
