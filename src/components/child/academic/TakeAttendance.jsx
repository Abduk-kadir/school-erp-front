import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";
import "../../../assets/css/mastercom.css";
import "../../../assets/css/academicOfflineFeeReport.css";

const initialValues = {
  class: "",
  division: "",
  date: "",
  subject:"",
  staff:"",
};

const validationSchema = (isSubjectwise) =>
  Yup.object({
    class: Yup.string().required("Class is required"),
    division: Yup.string().required("Division is required"),
    date: Yup.string().required("Date is required"),
    ...(isSubjectwise
      ? {
          staff: Yup.string().required("Staff is required"),
          subject: Yup.string().required("Subject is required"),
        }
      : {}),
  });

const getStudentKey = (student) =>
  student?.id ?? student?.reg_no ?? student?.registration_no;

const pad2 = (n) => String(n).padStart(2, "0");

const getCurrentTime = () => {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
};

const getTodayDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const EMPTY_TIME = "00:00:00";

const buildAttendanceRecord = (student, status, attendanceDate) => ({
  reg_no: student?.reg_no,
  attendance_date: attendanceDate || getTodayDate(),
  in_time: status === "present" ? getCurrentTime() : EMPTY_TIME,
  out_time: EMPTY_TIME,
  in_time_notification_flag: 0,
  out_time_notification_flag: 0,
});

const buildLecturewiseRecord = (
  student,
  status,
  attendanceDate,
  subjectId,
  staffId
) => ({
  reg_no: student?.reg_no,
  attendance_date: attendanceDate,
  subjectid: subjectId,
  staffid: staffId,
  attendance: status === "present" ? 1 : 0,
});


const TakeAttendance = ({ isSubjectwise = false }) => {
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  

  const [subjects, setSubjects] = useState([])
  const [staffs, setStaffs] = useState([])
  const [hasSearched, setHasSearched] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [bulkMark, setBulkMark] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [lectureSubjectId, setLectureSubjectId] = useState("");
  const [lectureStaffId, setLectureStaffId] = useState("");
  const [saving, setSaving] = useState(false);
  const formValuesRef = useRef(initialValues);

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
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedClass) return; // Don't fetch if no class selected

      try {
        const [subjectRes, staffRes] = await Promise.all([
          axios.get(`${baseURL}/api/program-subjects?classId=${selectedClass}`),
          axios.get(`${baseURL}/api/staff`),
        ]);
        setSubjects(subjectRes?.data?.data || []);
        setStaffs(staffRes?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch subjects", error);
        alert("Failed to fetch subjects");
      }
    };

    if (isSubjectwise) {
      fetchSubjects();
    }
  }, [isSubjectwise, selectedClass]);

  const handleSubmit = async (values) => {
    try {
      setSearching(true);
      setHasSearched(true);
      let res;
      if(isSubjectwise){
        res = await axios.get(
          `${baseURL}/api/attendance-lecturewise/get-student`,
          {
            params: {
              classId: values.class,
              division: values.division,
              subject:values.subject
            },
          }
        );

      }else{
         res = await axios.get(
          `${baseURL}/api/parmanent-personal-information`,
          {
            params: {
              class: values.class,
              division: values.division,
            },
          }
        );

      }

      const list = res?.data?.data || [];
      setStudents(Array.isArray(list) ? list : []);
      setAttendance({});
      setBulkMark("");
      if (isSubjectwise) {
        setLectureSubjectId(values.subject);
        setLectureStaffId(values.staff);
        setAttendanceDate(values.date);
      } else {
        setAttendanceDate(values.date || getTodayDate());
      }
    } catch (error) {
      console.error("Take attendance search failed:", error);
      setStudents([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAttendance = (student, status) => {
    const key = getStudentKey(student);
    if (key == null) return;
    setAttendance((prev) => ({ ...prev, [key]: status }));
    setBulkMark("");
  };

  const handleBulkMark = (status) => {
    setBulkMark(status);
    const next = {};
    students.forEach((s) => {
      const key = getStudentKey(s);
      if (key != null) next[key] = status;
    });
    setAttendance(next);
  };

  const handleSaveAttendance = async () => {
    const selectedDate = formValuesRef.current?.date || attendanceDate;

    if (isSubjectwise) {
      if (!selectedDate) {
        alert("Attendance date is required");
        return;
      }
      if (!lectureStaffId) {
        alert("Staff is required");
        return;
      }
      if (!lectureSubjectId) {
        alert("Subject is required");
        return;
      }
    }

    const saveDate = selectedDate || getTodayDate();

    const payload = students
      .map((s) => {
        const key = getStudentKey(s);
        const status = attendance[key];
        if (!status) return null;
        if (isSubjectwise) {
          return buildLecturewiseRecord(
            s,
            status,
            saveDate,
            lectureSubjectId,
            lectureStaffId
          );
        }
        return buildAttendanceRecord(s, status, saveDate);
      })
      .filter((r) => r && r.reg_no != null);

    if (payload.length === 0) return;
    try {
      setSaving(true);
      const saveUrl = isSubjectwise
        ? `${baseURL}/api/attendance-lecturewise`
        : `${baseURL}/api/in-out-attendance`;
      await axios.post(saveUrl, payload);
      setAttendance({});
      setBulkMark("");
      alert(`Attendance saved successfully (${payload.length} records)`);
    } catch (error) {
      console.error("Save attendance failed:", error);
      alert("Failed to save attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
            validationSchema={validationSchema(isSubjectwise)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => {
              formValuesRef.current = values;
              return (
              <Form className="chfi-root">
                <div className="row g-3 align-items-start">
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
                      <Field
                        as="select"
                        name="class"
                        className="form-select"
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setFieldValue("class", e.target.value);
                        }}
                      >
                        <option value="">Select Class</option>
                        {classes.map((c) => (
                          <option key={c?.id} value={c?.id ?? ""}>
                            {c?.class_name ?? c?.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div style={{minHeight:"1.25rem"}}><ErrorMessage name="class" component="div" className="text-danger field-error small mt-1" /></div>
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
                          <option key={d?.id} value={d?.id ?? ""}>
                            {d?.division_name ?? d?.name}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div style={{minHeight:"1.25rem"}}><ErrorMessage name="division" component="div" className="text-danger field-error small mt-1" /></div>
                  </div>
                  {
                    isSubjectwise && (
                      <div className="col-sm-6 col-lg-3">
                        <label className="form-label mb-1">
                          <span className="label-dot" />
                          Subject
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon icon="solar:widget-bold-duotone" width="18" />
                          </span>
                          <Field as="select" name="subject" className="form-select">
                            <option value="">Select Subject</option>
                            {subjects.map((s) => (
                              <option key={s?.id} value={s?.subject?.id}>
                                {s?.subject?.value}
                              </option>
                            ))}
                          </Field>
                        </div>
                        <div style={{minHeight:"1.25rem"}}><ErrorMessage name="subject" component="div" className="text-danger field-error small mt-1" /></div>
                      </div>
                    )
                  }
                  {
                    isSubjectwise && (
                      <div className="col-sm-6 col-lg-3">
                        <label className="form-label mb-1">
                          <span className="label-dot" />
                          Staff
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="icon-field">
                          <span className="icon">
                            <Icon icon="solar:widget-bold-duotone" width="18" />
                          </span>
                          <Field as="select" name="staff" className="form-select">
                            <option value="">Select Staff</option>
                            {staffs.map((s) => (
                              <option key={s?.id} value={s?.id}>
                                {s?.firstname} {s?.lastname}
                              </option>
                            ))}
                          </Field>
                        </div>
                        <div style={{minHeight:"1.25rem"}}><ErrorMessage name="staff" component="div" className="text-danger field-error small mt-1" /></div>
                      </div>
                    )
                  }

                  <div className="col-sm-6 col-lg-3">
                    <label className="form-label mb-1">
                      Date
                      {isSubjectwise && <span className="text-danger"> *</span>}
                    </label>
                    <div className="icon-field">
                      <span className="icon">
                        <Icon icon="solar:calendar-bold-duotone" width="18" />
                      </span>
                      <Field
                        type="date"
                        name="date"
                        className="form-control"
                        onChange={(e) => {
                          setAttendanceDate(e.target.value);
                          setFieldValue("date", e.target.value);
                        }}
                      />
                    </div>
                    <div style={{minHeight:"1.25rem"}}><ErrorMessage name="date" component="div" className="text-danger field-error small mt-1" /></div>
                  </div>

                  <div className="col-sm-6 col-lg-3">
                    <label className="form-label mb-1" style={{visibility:"hidden"}}>Search</label>
                    <button
                      type="submit"
                      className="btn btn-submit w-100 d-inline-flex align-items-center justify-content-center gap-2"
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
                    <div style={{minHeight:"1.25rem"}}></div>
                  </div>
                </div>

              </Form>
            );
            }}
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
              <>
                {saving && <Loader message="Saving attendance..." />}
                <div className="fee-report-scope table-responsive">
                  <table className="table bordered-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Reg No</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Class</th>
                        {isSubjectwise&&<th scope="col">Subject</th>}
                        <th scope="col">Division</th>
                        <th scope="col" className="text-center">
                          <div className="d-inline-flex gap-3 align-items-center justify-content-center flex-nowrap">
                            <span>Action</span>
                            <label className="d-inline-flex align-items-center gap-1 mb-0">
                              <input
                                className="form-check-input m-0"
                                type="radio"
                                name="bulk-attendance"
                                value="present"
                                checked={bulkMark === "present"}
                                onChange={() => handleBulkMark("present")}
                              />
                              <span>All P</span>
                            </label>
                            <label className="d-inline-flex align-items-center gap-1 mb-0">
                              <input
                                className="form-check-input m-0"
                                type="radio"
                                name="bulk-attendance"
                                value="absent"
                                checked={bulkMark === "absent"}
                                onChange={() => handleBulkMark("absent")}
                              />
                              <span>All A</span>
                            </label>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => {
                        const rowKey = getStudentKey(student);
                        const status = attendance[rowKey];
                        const present = status === "present";
                        const absent = status === "absent";
                        return (
                          <tr
                            key={rowKey}
                            className={
                              present
                                ? "table-success"
                                : absent
                                  ? "table-danger"
                                  : undefined
                            }
                          >
                            <td className="fw-medium text-nowrap">
                              {student?.reg_no ?? ""}
                            </td>
                            <td>{student?.first_name ?? ""}</td>
                            <td>{student?.class ?? student?.class_name ?? ""}</td>
                            {isSubjectwise && <td>{student?.subject_id ?? ""}</td>}
                            <td>
                              {student?.div ??
                                student?.division ??
                                student?.division_name ??
                                ""}
                            </td>
                            <td className="text-center text-nowrap">
                              <div className="d-inline-flex gap-3 align-items-center justify-content-center flex-nowrap">
                                <label className="d-inline-flex align-items-center gap-1 mb-0 text-success">
                                  <input
                                    className="form-check-input m-0"
                                    type="radio"
                                    name={`attendance-${rowKey}`}
                                    value="present"
                                    checked={present}
                                    onChange={() =>
                                      handleAttendance(student, "present")
                                    }
                                  />
                                  <span>Present</span>
                                </label>
                                <label className="d-inline-flex align-items-center gap-1 mb-0 text-danger">
                                  <input
                                    className="form-check-input m-0"
                                    type="radio"
                                    name={`attendance-${rowKey}`}
                                    value="absent"
                                    checked={absent}
                                    onChange={() =>
                                      handleAttendance(student, "absent")
                                    }
                                  />
                                  <span>Absent</span>
                                </label>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="chfi-root d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    className="btn btn-submit"
                    onClick={handleSaveAttendance}
                    disabled={
                      saving || Object.keys(attendance).length === 0
                    }
                  >
                    {saving ? (
                      <>
                        <Icon icon="line-md:loading-loop" width="16" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Icon icon="solar:diskette-bold-duotone" width="18" />
                        Save Attendance
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeAttendance;
