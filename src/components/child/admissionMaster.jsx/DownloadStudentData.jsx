import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";

const DownloadStudentData = () => {
  const [allFields, setAllFields] = useState({});
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.allSettled([
        axios.get(`${baseURL}/api/classes`),
        axios.get(`${baseURL}/api/studentData-download/allcolumn`),
        axios.get(`${baseURL}/api/divisions`)
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

  if (loading) return <p>Loading...</p>;

  /* ---------- Initial Values ---------- */

  const initialValues = { class_id: "", division_id: "" };

  Object.entries(allFields).forEach(([section, cols]) => {
    initialValues[section] = {};
    cols.forEach((col) => {
      initialValues[section][col] = false;
    });
  });

  /* ---------- Helper ---------- */

  const filterSelected = (obj) =>
    Object.fromEntries(Object.entries(obj || {}).filter(([k, v]) => v));

  /* ---------- Submit ---------- */

  const handleSubmit = async (values) => {
  try {
    // Base body for class/division
    const body = {
      class_id: values.class_id,
      division_id: values.division_id
    };

    // Add selected columns for each section
    Object.keys(allFields).forEach((section) => {
      // filterSelected returns only selected columns from that section
      body[section] = filterSelected(values[section]);
    });

    // POST to backend to generate Excel
    const response = await axios.post(
      `${baseURL}/api/studentData-download`,
      body,
      {
        responseType: "blob" // important for Excel files
      }
    );

    // Download the Excel file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "All_Students_Selected_Columns.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (err) {
    console.error("Error downloading Excel:", err);
  }
};

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form className="container mt-4">

          {/* Class + Division */}

          <div className="row mb-4">
            <div className="col-md-4">
              <label className="fw-bold">Class</label>
              <Field as="select" name="class_id" className="form-select">
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.class_name}
                  </option>
                ))}
              </Field>
            </div>

            <div className="col-md-4">
              <label className="fw-bold">Division</label>
              <Field as="select" name="division_id" className="form-select">
                <option value="">Select Division</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.division_name}
                  </option>
                ))}
              </Field>
            </div>
          </div>

          {/* Sections */}

          {Object.entries(allFields).map(([section, columns]) => {

            const isAllSelected = columns.every((col) => values[section]?.[col]);

            return (
              <div key={section} className="card mb-3">

                <div className="card-header d-flex justify-content-between">

                  <b>{section}</b>

                  <input
                    type="checkbox"
                    
                    checked={isAllSelected}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      columns.forEach((col) => {
                        setFieldValue(`${section}.${col}`, checked);
                      });
                    }}
                  />

                </div>

                <div className="card-body row">

                  {columns.map((column) => {

                    const id = `${section}-${column.replace(/\s+/g, "_")}`;

                    return (
                      <div key={column} className="col-md-3 form-check">

                        <Field
                          type="checkbox"
                         
                          name={`${section}.${column}`}
                          className="form-check-input mt-4 me-3"
                          id={id}
                        />

                        <label className="form-check-label ps-2 fw-bold" htmlFor={id}>
                          {column}
                        </label>

                      </div>
                    );
                  })}

                </div>

              </div>
            );
          })}

          <div className="text-end mb-5">
            <button className="btn btn-success px-5" type="submit">
              Download
            </button>
          </div>

        </Form>
      )}
    </Formik>
  );
};

export default DownloadStudentData;