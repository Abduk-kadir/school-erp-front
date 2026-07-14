import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/mastercom.css";
import "../../../assets/css/downloadStudentData.css";

const formatSectionTitle = (section) =>
  String(section)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const SectionSelectAll = ({ section, columns, values, setFieldValue }) => {
  const inputRef = useRef(null);
  const selectedCount = columns.filter((col) => values[section]?.[col]).length;
  const isAllSelected = columns.length > 0 && selectedCount === columns.length;
  const isSomeSelected = selectedCount > 0 && !isAllSelected;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const handleChange = (e) => {
    const checked = e.target.checked;
    columns.forEach((col) => {
      setFieldValue(`${section}.${col}`, checked);
    });
  };

  const id = `select-all-${section}`;

  return (
    <label className="dsd-select-all" htmlFor={id}>
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        className="form-check-input"
        checked={isAllSelected}
        onChange={handleChange}
        aria-label={`Select all fields in ${formatSectionTitle(section)}`}
      />
      <span className="dsd-select-all-label">Select All</span>
    </label>
  );
};

const DownloadStudentData = () => {
  const [allFields, setAllFields] = useState({});
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.allSettled([
        axios.get(`${baseURL}/api/classes`),
        axios.get(`${baseURL}/api/studentData-download/allcolumn`),
        axios.get(`${baseURL}/api/divisions`),
      ]);

      const [classesRes, fieldsRes, divisionRes] = results;

      if (classesRes.status === "fulfilled")
        setClasses(classesRes.value.data?.data || []);

      if (fieldsRes.status === "fulfilled")
        setAllFields(fieldsRes.value.data?.data || {});

      if (divisionRes.status === "fulfilled")
        setDivisions(divisionRes.value.data?.data || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="chfi-wrapper dsd-page">
        <section className="chfi-card" aria-label="Loading">
          <div className="card-body py-4">
            <p className="dsd-empty mb-0 d-flex align-items-center gap-2">
              <Icon icon="line-md:loading-loop" width="20" />
              Loading fields...
            </p>
          </div>
        </section>
      </div>
    );
  }

  const initialValues = { class_id: "", division_id: "" };

  Object.entries(allFields).forEach(([section, cols]) => {
    initialValues[section] = {};
    cols.forEach((col) => {
      initialValues[section][col] = false;
    });
  });

  const filterSelected = (obj) =>
    Object.fromEntries(Object.entries(obj || {}).filter(([, v]) => v));

  const handleSubmit = async (values) => {
    try {
      setDownloading(true);
      const body = {
        class_id: values.class_id,
        division_id: values.division_id,
      };

      Object.keys(allFields).forEach((section) => {
        body[section] = filterSelected(values[section]);
      });

      const response = await axios.post(
        `${baseURL}/api/studentData-download`,
        body,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "All_Students_Selected_Columns.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading Excel:", err);
    } finally {
      setDownloading(false);
    }
  };

  const sectionEntries = Object.entries(allFields);

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form className="chfi-wrapper dsd-page d-flex flex-column gap-3 pb-2">
          <section className="chfi-card" aria-label="Filter students">
            <div className="card-header">
              <div className="header-row">
                <span className="header-icon">
                  <Icon icon="solar:filter-bold-duotone" width="22" />
                </span>
                <div>
                  <h5 className="card-title">Download Student Data</h5>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="dsd-filter-grid">
                <div className="dsd-filter-field">
                  <label className="form-label" htmlFor="dsd-class">
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
                    <Field
                      as="select"
                      id="dsd-class"
                      name="class_id"
                      className="form-select"
                    >
                      <option value="">Select Class</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.class_name}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>

                <div className="dsd-filter-field">
                  <label className="form-label" htmlFor="dsd-division">
                    <span className="label-dot" />
                    Division
                  </label>
                  <div className="icon-field">
                    <span className="icon">
                      <Icon icon="solar:widget-bold-duotone" width="18" />
                    </span>
                    <Field
                      as="select"
                      id="dsd-division"
                      name="division_id"
                      className="form-select"
                    >
                      <option value="">Select Division</option>
                      {divisions.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.division_name}
                        </option>
                      ))}
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {sectionEntries.length === 0 ? (
            <section className="chfi-card" aria-label="No fields">
              <div className="card-body">
                <p className="dsd-empty">No downloadable fields found.</p>
              </div>
            </section>
          ) : (
            sectionEntries.map(([section, columns]) => {
              const selectedCount = columns.filter(
                (col) => values[section]?.[col]
              ).length;

              return (
                <section
                  key={section}
                  className="chfi-card"
                  aria-label={formatSectionTitle(section)}
                >
                  <div className="card-header">
                    <div className="dsd-section-header">
                      <div className="header-row">
                        <span className="header-icon">
                          <Icon
                            icon="solar:checklist-minimalistic-bold-duotone"
                            width="22"
                          />
                        </span>
                        <div>
                          <h5 className="card-title">
                            {formatSectionTitle(section)}
                            <span className="dsd-count-pill">
                              {selectedCount}/{columns.length}
                            </span>
                          </h5>
                        </div>
                      </div>

                      <SectionSelectAll
                        section={section}
                        columns={columns}
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="dsd-field-grid">
                      {columns.map((column) => {
                        const id = `${section}-${column.replace(/\s+/g, "_")}`;
                        return (
                          <label
                            key={column}
                            className="dsd-field-check"
                            htmlFor={id}
                          >
                            <Field
                              type="checkbox"
                              name={`${section}.${column}`}
                              className="form-check-input"
                              id={id}
                            />
                            <span className="dsd-field-check-label">
                              {column}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })
          )}

          <div className="dsd-actions mb-2">
            <button
              className="btn-submit"
              type="submit"
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <Icon icon="line-md:loading-loop" width="16" />
                  Downloading...
                </>
              ) : (
                <>
                  <Icon icon="solar:download-bold-duotone" width="18" />
                  Download
                </>
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DownloadStudentData;
