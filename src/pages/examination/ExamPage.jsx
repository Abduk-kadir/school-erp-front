import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import GenericTableDataLayer from "../../components/GenericTable";
import axios from "axios";
import baseURL from "../../utils/baseUrl";
import { useState, useEffect } from "react";
import "../../assets/css/mastercom.css";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const initialValues = {
  exam_name_id: "",
  class_ids: [],
  term_id: "",
};

const validationSchema = Yup.object({
  exam_name_id: Yup.string().required("Exam Name is required"),
  class_ids: Yup.array().min(1, "Select at least one class"),
  term_id: Yup.string().required("Term is required"),
});

const MultiChipSelect = ({ label, fieldName, options, optionLabel, values, setFieldValue, icon }) => {
  const selected = (values[fieldName] || []).map(String);
  const available = options.filter((o) => !selected.includes(String(o.id)));

  const handleAdd = (e) => {
    const val = e.target.value;
    if (!val || selected.includes(val)) return;
    setFieldValue(fieldName, [...selected, val]);
  };

  const handleRemove = (val) => {
    setFieldValue(fieldName, selected.filter((v) => v !== val));
  };

  const getLabel = (id) => {
    const opt = options.find((o) => String(o.id) === String(id));
    return opt ? optionLabel(opt) : id;
  };

  return (
    <div className={`chip-select-box${icon ? " has-icon" : ""}`}>
      {icon && (
        <span className="chip-select-icon">
          <Icon icon={icon} width="16" />
        </span>
      )}
      {selected.map((val) => (
        <span className="chip-item" key={val}>
          {getLabel(val)}
          <button type="button" className="chip-remove" onClick={() => handleRemove(val)}>
            <Icon icon="solar:close-square-bold" width="14" />
          </button>
        </span>
      ))}
      <select className="chip-select-input" onChange={handleAdd} value="">
        <option value="">+ Select {label}</option>
        {available.map((o) => (
          <option key={o.id} value={o.id}>
            {optionLabel(o)}
          </option>
        ))}
      </select>
    </div>
  );
};

const ExamPage = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const [classes, setClasses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [examNames, setExamNames] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      axios.get(`${baseURL}/api/classes`, { headers: authHeaders() }),
      axios.get(`${baseURL}/api/terms`, { headers: authHeaders() }),
      axios.get(`${baseURL}/api/exam-names`, { headers: authHeaders() }),
    ]).then(([classesResponse, termsResponse, examNamesResponse]) => {
      if (classesResponse.status === "fulfilled") {
        setClasses(classesResponse.value.data?.data || []);
      }
      if (termsResponse.status === "fulfilled") {
        setTerms(termsResponse.value.data?.data || []);
      }
      if (examNamesResponse.status === "fulfilled") {
        setExamNames(examNamesResponse.value.data?.data || []);
      }
    });
  }, []);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = {
        rows: values.class_ids.map((classId) => ({
          exam_name_id: Number(values.exam_name_id),
          class_id: Number(classId),
          term_id: Number(values.term_id),
        })),
      };
      await axios.post(`${baseURL}/api/exam-schemes`, payload, {
        headers: authHeaders(),
      });
      setSuccessMsg("Exam added successfully!");
      resetForm();
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");

    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/exam-schemes/${id}`, {
        headers: authHeaders(),
      });
      alert("Exam is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit exam scheme:", id);
  };

  return (
    <div>
      <div className="chfi-wrapper mb-3">
        <div className="chfi-card">
          <div className="card-header">
            <div className="header-row">
              <span className="header-icon">
                <Icon icon="solar:square-academic-cap-bold-duotone" width="24" />
              </span>
              <div>
                <h5 className="card-title">Add Exam Scheme</h5>
              </div>
            </div>
          </div>

          <div className="card-body">
            {successMsg && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {successMsg}
                <button type="button" className="btn-close" onClick={() => setSuccessMsg("")} />
              </div>
            )}
            {errorMsg && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {errorMsg}
                <button type="button" className="btn-close" onClick={() => setErrorMsg("")} />
              </div>
            )}
            <div className="form-area">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, resetForm, values, setFieldValue }) => (
                  <Form className="chfi-root dynamic-form">
                    <div className="field-row">
                      <label htmlFor="exam_name_id" className="form-label">
                        <span className="label-dot" />
                        Exam Name<span className="text-danger"> *</span>
                      </label>
                      <div className="icon-field">
                        <span className="icon">
                          <Icon icon="solar:document-text-bold-duotone" width="18" />
                        </span>
                        <Field as="select" name="exam_name_id" id="exam_name_id" className="form-select">
                          <option value="">Select Exam Name</option>
                          {examNames.map((exam) => (
                            <option key={exam.id} value={exam.id}>
                              {exam.exam_name}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <ErrorMessage name="exam_name_id" component="div" className="text-danger field-error" />
                    </div>

                    <div className="field-row">
                      <label className="form-label">
                        <span className="label-dot" />
                        Class<span className="text-danger"> *</span>
                      </label>
                      <MultiChipSelect
                        label="Class"
                        fieldName="class_ids"
                        options={classes}
                        optionLabel={(c) => c?.class_name ?? c?.name}
                        values={values}
                        setFieldValue={setFieldValue}
                        icon="solar:square-academic-cap-bold-duotone"
                      />
                      <ErrorMessage name="class_ids" component="div" className="text-danger field-error" />
                    </div>

                    <div className="field-row">
                      <label htmlFor="term_id" className="form-label">
                        <span className="label-dot" />
                        Term<span className="text-danger"> *</span>
                      </label>
                      <div className="icon-field">
                        <span className="icon">
                          <Icon icon="solar:calendar-bold-duotone" width="18" />
                        </span>
                        <Field as="select" name="term_id" id="term_id" className="form-select">
                          <option value="">Select Term</option>
                          {terms.map((term) => (
                            <option key={term.id} value={term.id}>
                              {term.term_name}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <ErrorMessage name="term_id" component="div" className="text-danger field-error" />
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
                      <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Icon icon="line-md:loading-loop" width="16" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Icon icon="solar:check-circle-bold-duotone" width="18" />
                            Save
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
      <GenericTableDataLayer
        key={tableRefreshKey}
        url={`${baseURL}/api/exam-schemes`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "examNameInfo.exam_name", name: "examNameInfo.exam_name", title: "Exam Name" },
          { data: "classInfo.class_name", name: "classInfo.class_name", title: "Class" },
          { data: "termInfo.term_name", name: "termInfo.term_name", title: "Term" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Exam">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Exam">Delete</button>
                </div>
              `;
            },
          },
        ]}
        pageName="Exam Scheme"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ExamPage;
