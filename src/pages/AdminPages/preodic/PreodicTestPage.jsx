import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import GenericTableDataLayer from "../../../components/GenericTable";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/mastercom.css";

const emptyValues = {
  exam_name: "",
  class: "",
  division: "",
  subject: "",
  staffid: "",
  date: "",
  total_marks: "",
  topics: "",
};

const validationSchema = Yup.object({
  exam_name: Yup.string().trim().required("Exam name is required"),
  class: Yup.string().required("Class is required"),
  division: Yup.string().required("Division is required"),
  subject: Yup.string().required("Subject is required"),
  staffid: Yup.string().required("Staff is required"),
  date: Yup.string().required("Date is required"),
  total_marks: Yup.number()
    .typeError("Must be a number")
    .min(1, "Must be at least 1")
    .required("Total marks is required"),
  topics: Yup.string().trim().required("Topics are required"),
});

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const parseProgramSubjects = (payload) => {
  const list = Array.isArray(payload?.data) ? payload.data : [];
  const subjectMap = new Map();
  list.forEach((item) => {
    const subject = item?.subject;
    if (subject?.id && !subjectMap.has(subject.id)) {
      subjectMap.set(subject.id, subject);
    }
  });
  return Array.from(subjectMap.values());
};

const PreodicTestPage = () => {
  const [classes, setClasses] = useState([]);
  const [classDivMap, setClassDivMap] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [initialValues, setInitialValues] = useState(emptyValues);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  useEffect(() => {
    const fetchBaseOptions = async () => {
      try {
        const [classRes, mapRes, staffRes] = await Promise.all([
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/class-div-map-masters`),
          axios.get(`${baseURL}/api/staff`),
        ]);
        setClasses(normalizeList(classRes?.data));
        setClassDivMap(normalizeList(mapRes?.data));
        setStaffList(normalizeList(staffRes?.data));
      } catch (error) {
        console.error("Failed to load dropdown options", error);
        setErrorMsg("Failed to load dropdown options. Please try again.");
      }
    };
    fetchBaseOptions();
  }, []);

  const getDivisionsForClass = (classId) => {
    if (!classId) return [];
    const filtered = classDivMap.filter(
      (item) =>
        String(item.classid ?? item.classId ?? item.classInfo?.id) ===
        String(classId)
    );
    const divisionMap = new Map();
    filtered.forEach((item) => {
      const id = item.divisionInfo?.id ?? item.divisionid ?? item.divisionId;
      const name =
        item.divisionInfo?.division_name ??
        item.division_name ??
        item.division?.division_name ??
        "";
      if (id != null && !divisionMap.has(String(id))) {
        divisionMap.set(String(id), { id, division_name: name });
      }
    });
    return Array.from(divisionMap.values());
  };

  const fetchSubjects = async (classId, setFieldValue) => {
    setFieldValue?.("subject", "");
    if (!classId) {
      setSubjects([]);
      return;
    }
    try {
      const res = await axios.get(
        `${baseURL}/api/program-subjects?classId=${classId}`
      );
      setSubjects(parseProgramSubjects(res?.data));
    } catch (error) {
      console.error("Failed to fetch subjects", error);
      setSubjects([]);
    }
  };

  const handleClassChange = (classId, setFieldValue) => {
    setFieldValue("class", classId);
    setFieldValue("division", "");
    fetchSubjects(classId, setFieldValue);
  };

  const handleSubmit = async (values, { resetForm }) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = {
        exam_name: values.exam_name.trim(),
        class: Number(values.class),
        division: Number(values.division),
        subject: Number(values.subject),
        staffid: Number(values.staffid),
        date: values.date,
        total_marks: Number(values.total_marks),
        topics: values.topics.trim(),
      };
      await axios.post(`${baseURL}/api/preodictests`, payload);
      setSuccessMsg("Periodic test added successfully!");
      setInitialValues(emptyValues);
      setSubjects([]);
      resetForm({ values: emptyValues });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = (resetForm) => {
    setSuccessMsg("");
    setErrorMsg("");
    setSubjects([]);
    setInitialValues(emptyValues);
    resetForm({ values: emptyValues });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/preodictests/${id}`);
      alert("Periodic test deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit periodic test:", id);
  };

  const columns = useMemo(
    () => [
      { data: "id", name: "id", title: "ID" },
      { data: "exam_name", name: "exam_name", title: "Exam Name" },
      { data: "class_name", name: "class", title: "Class" },
      { data: "division_name", name: "division", title: "Division" },
      { data: "subject_name", name: "subject", title: "Subject" },
      { data: "staff_name", name: "staffid", title: "Staff" },
      { data: "date", name: "date", title: "Date" },
      { data: "total_marks", name: "total_marks", title: "Total Marks" },
      { data: "topics", name: "topics", title: "Topics" },
      {
        data: null,
        title: "Actions",
        orderable: false,
        searchable: false,
        render: (data, type, row) => `
          <div class="table-action-group">
            <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit">Edit</button>
            <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete">Delete</button>
          </div>
        `,
      },
    ],
    []
  );

  return (
    <div>
      <div className="chfi-wrapper mb-3">
        <div className="chfi-card">
          <div className="card-header">
            <div className="header-row">
              <span className="header-icon">
                <Icon
                  icon="solar:document-text-bold-duotone"
                  width="24"
                />
              </span>
              <div>
                <h5 className="card-title">Add Periodic Test</h5>
              </div>
            </div>
          </div>

          <div className="card-body">
            {successMsg && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                {successMsg}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccessMsg("")}
                />
              </div>
            )}
            {errorMsg && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {errorMsg}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setErrorMsg("")}
                />
              </div>
            )}

            <div className="form-area">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, resetForm, setFieldValue, values }) => {
                  const divisionOptions = getDivisionsForClass(values.class);
                  return (
                    <Form className="chfi-root dynamic-form">
                      <div className="field-row">
                        <label htmlFor="exam_name" className="form-label">
                          <span className="label-dot" />
                          Exam Name
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon
                              icon="solar:notebook-bookmark-bold-duotone"
                              width="18"
                            />
                          </span>
                          <Field
                            type="text"
                            name="exam_name"
                            placeholder="e.g. Unit Test 1"
                            className="form-control"
                          />
                        </div>
                        <ErrorMessage
                          name="exam_name"
                          component="div"
                          className="text-danger field-error"
                        />
                      </div>

                      <div className="field-row">
                        <label htmlFor="class" className="form-label">
                          <span className="label-dot" />
                          Class
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon
                              icon="solar:square-academic-cap-bold-duotone"
                              width="18"
                            />
                          </span>
                          <Field
                            as="select"
                            name="class"
                            className="form-select"
                            onChange={(e) =>
                              handleClassChange(e.target.value, setFieldValue)
                            }
                          >
                            <option value="">Select Class</option>
                            {classes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.class_name ?? c.name}
                              </option>
                            ))}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="class"
                          component="div"
                          className="text-danger field-error"
                        />
                      </div>

                      <div className="field-row">
                        <label htmlFor="division" className="form-label">
                          <span className="label-dot" />
                          Division
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon icon="solar:widget-bold-duotone" width="18" />
                          </span>
                          <Field
                            as="select"
                            name="division"
                            className="form-select"
                            disabled={!values.class}
                          >
                            <option value="">Select Division</option>
                            {divisionOptions.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.division_name}
                              </option>
                            ))}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="division"
                          component="div"
                          className="text-danger field-error"
                        />
                      </div>

                      <div className="field-row">
                        <label htmlFor="subject" className="form-label">
                          <span className="label-dot" />
                          Subject
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon
                              icon="solar:book-2-bold-duotone"
                              width="18"
                            />
                          </span>
                          <Field
                            as="select"
                            name="subject"
                            className="form-select"
                            disabled={!values.class}
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.subject_name ?? s.name ?? s.value}
                              </option>
                            ))}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="subject"
                          component="div"
                          className="text-danger field-error"
                        />
                      </div>

                      <div className="field-row">
                        <label htmlFor="staffid" className="form-label">
                          <span className="label-dot" />
                          Staff
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon
                              icon="solar:user-bold-duotone"
                              width="18"
                            />
                          </span>
                          <Field
                            as="select"
                            name="staffid"
                            className="form-select"
                          >
                            <option value="">Select Staff</option>
                            {staffList.map((s) => (
                              <option key={s.id} value={s.id}>
                                {[s.firstname, s.lastname, s.surname]
                                  .filter(Boolean)
                                  .join(" ") || s.name || `Staff ${s.id}`}
                              </option>
                            ))}
                          </Field>
                        </div>
                        <ErrorMessage
                          name="staffid"
                          component="div"
                          className="text-danger field-error"
                        />
                      </div>

                      <div className="field-row">
                        <label htmlFor="date" className="form-label">
                          <span className="label-dot" />
                          Date
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon
                              icon="solar:calendar-bold-duotone"
                              width="18"
                            />
                          </span>
                          <Field
                            type="date"
                            name="date"
                            className="form-control"
                          />
                        </div>
                        <ErrorMessage
                          name="date"
                          component="div"
                          className="text-danger field-error"
                        />
                      </div>

                      <div className="field-row">
                        <label htmlFor="total_marks" className="form-label">
                          <span className="label-dot" />
                          Total Marks
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon
                              icon="solar:hashtag-square-bold-duotone"
                              width="18"
                            />
                          </span>
                          <Field
                            type="number"
                            name="total_marks"
                            min={1}
                            placeholder="e.g. 50"
                            className="form-control"
                          />
                        </div>
                        <ErrorMessage
                          name="total_marks"
                          component="div"
                          className="text-danger field-error"
                        />
                      </div>

                      <div className="field-row">
                        <label htmlFor="topics" className="form-label">
                          <span className="label-dot" />
                          Topics
                          <span className="text-danger"> *</span>
                        </label>
                        <Field
                          as="textarea"
                          name="topics"
                          rows={3}
                          placeholder="e.g. Chapter 1, Chapter 2"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="topics"
                          component="div"
                          className="text-danger field-error"
                        />
                      </div>

                      <div className="actions">
                        <button
                          type="button"
                          className="btn btn-reset"
                          onClick={() => handleReset(resetForm)}
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
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Icon
                                icon="solar:check-circle-bold-duotone"
                                width="18"
                              />
                              Save
                            </>
                          )}
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      <GenericTableDataLayer
        key={tableRefreshKey}
        url={`${baseURL}/api/preodictests`}
        columns={columns}
        pageName="Periodic Tests"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PreodicTestPage;
