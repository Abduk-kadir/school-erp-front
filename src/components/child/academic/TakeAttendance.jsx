import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/mastercom.css";

const TakeAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [students, setStudents] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [attendance, setAttendance] = useState({});

  const initialValues = {
    class: "",
    division: "",
    date: "",
  };

  const validationSchema = Yup.object({
    class: Yup.string().required("Class is required"),
    division: Yup.string().required("Division is required"),
    date: Yup.string().required("Date is required"),
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [classRes, divisionRes] = await Promise.all([
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/divisions`),
        ]);
        setClasses(classRes?.data?.data || classRes?.data || []);
        setDivisions(divisionRes?.data?.data || divisionRes?.data || []);
      } catch (error) {
        console.error("Failed to load class or division options", error);
      }
    };
    fetchDropdowns();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setSearching(true);
      setHasSearched(true);
      const res = await axios.get(`${baseURL}/api/personal-information/all`, {
        params: {
          start: 0,
          length: 1000,
          "filter[className]": values.class,
          "filter[programName]": values.division,
          "filter[date]": values.date,
        },
      });
      const list = res?.data?.data || [];
      setStudents(Array.isArray(list) ? list : []);
      setAttendance({});
      console.log("Take attendance search — filters:", values);
      console.log("Take attendance search — response:", res?.data);
    } catch (error) {
      console.error("Take attendance search failed:", error);
      setStudents([]);
    } finally {
      setSearching(false);
    }
  };

  const getStudentKey = (student) =>
    student?.id ?? student?.reg_no ?? student?.registration_no;

  const handleAttendance = (student, status) => {
    const key = getStudentKey(student);
    if (key == null) return;
    setAttendance((prev) => ({ ...prev, [key]: status }));
    console.log("Attendance marked:", {
      reg_no: student?.reg_no,
      status,
      student,
    });
  };

  const getStudentClass = (student) =>
    student?.class ?? student?.class_name ?? student?.className ?? "";

  const getStudentDivision = (student) =>
    student?.div ??
    student?.division ??
    student?.division_name ??
    student?.program_name ??
    student?.programName ??
    "";

  return (
    <div className="chfi-wrapper mb-3 d-flex flex-column gap-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:clipboard-check-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title">Take Attendance</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="chfi-root">
                <div className="row g-3 align-items-end">
                  <div className="col-sm-6 col-lg-3">
                    <label className="form-label mb-1">
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
                      <Field as="select" name="class" className="form-select">
                        <option value="">Select Class</option>
                        {classes.map((c) => (
                          <option
                            key={c?.id ?? c?.class_name}
                            value={c?.class_name ?? c?.name}
                          >
                            {c?.class_name ?? c?.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>

                  <div className="col-sm-6 col-lg-3">
                    <label className="form-label mb-1">
                      <span className="label-dot" />
                      Division
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:widget-bold-duotone" width="18" />
                      </span>
                      <Field as="select" name="division" className="form-select">
                        <option value="">Select Division</option>
                        {divisions.map((d) => (
                          <option
                            key={d?.id ?? d?.division_name}
                            value={d?.division_name ?? d?.name}
                          >
                            {d?.division_name ?? d?.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>

                  <div className="col-sm-6 col-lg-3">
                    <label className="form-label mb-1">
                      <span className="label-dot" />
                      Date
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:calendar-bold-duotone" width="18" />
                      </span>
                      <Field type="date" name="date" className="form-control" />
                    </div>
                  </div>

                  <div className="col-sm-6 col-lg-3 d-grid">
                    <button
                      type="submit"
                      className="btn btn-submit d-inline-flex align-items-center justify-content-center gap-2"
                      disabled={isSubmitting || searching}
                    >
                      {isSubmitting || searching ? (
                        <>
                          <Icon icon="line-md:loading-loop" width="16" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:magnifer-bold-duotone" width="18" />
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="row g-1" aria-live="polite">
                  <div className="col-sm-6 col-lg-3">
                    <ErrorMessage
                      name="class"
                      component="div"
                      className="text-danger field-error small mb-0"
                    />
                  </div>
                  <div className="col-sm-6 col-lg-3">
                    <ErrorMessage
                      name="division"
                      component="div"
                      className="text-danger field-error small mb-0"
                    />
                  </div>
                  <div className="col-sm-6 col-lg-3">
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="text-danger field-error small mb-0"
                    />
                  </div>
                  <div className="col-lg-3 d-none d-lg-block" />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {hasSearched && (
        <div className="chfi-card">
          <div className="card-header">
            <div className="header-row">
              <span className="header-icon">
                <Icon icon="solar:users-group-rounded-bold-duotone" width="24" />
              </span>
              <div>
                <h5 className="card-title">Students</h5>
              </div>
            </div>
          </div>
          <div className="card-body">
            {students.length === 0 ? (
              <p className="text-muted small mb-0 text-center py-3">
                No students found for the selected filters.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Reg No</th>
                      <th scope="col">First Name</th>
                      <th scope="col">Class</th>
                      <th scope="col">Division</th>
                      <th scope="col" className="text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const rowKey = getStudentKey(student);
                      const mark = attendance[rowKey];
                      return (
                        <tr
                          key={rowKey}
                          className={
                            mark === "present"
                              ? "table-success"
                              : mark === "absent"
                                ? "table-danger"
                                : undefined
                          }
                        >
                          <td className="fw-medium text-nowrap">
                            {student?.reg_no ?? ""}
                          </td>
                          <td>{student?.first_name ?? student?.firstname ?? ""}</td>
                          <td>{getStudentClass(student)}</td>
                          <td>{getStudentDivision(student)}</td>
                          <td className="text-center text-nowrap">
                            <div className="d-inline-flex gap-2 flex-wrap justify-content-center">
                              <button
                                type="button"
                                className={`btn btn-sm ${
                                  mark === "present"
                                    ? "btn-success"
                                    : "btn-outline-success"
                                }`}
                                onClick={() =>
                                  handleAttendance(student, "present")
                                }
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                className={`btn btn-sm ${
                                  mark === "absent"
                                    ? "btn-danger"
                                    : "btn-outline-danger"
                                }`}
                                onClick={() =>
                                  handleAttendance(student, "absent")
                                }
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeAttendance;
