import React, { useEffect, useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/academicOfflineFeeReport.css";

const validationSchema = Yup.object({
  from_date: Yup.string().required("From date is required"),
  to_date: Yup.string()
    .required("To date is required")
    .test(
      "after-from",
      "To date must be on or after from date",
      function (value) {
        const from = this.parent.from_date;
        if (!value || !from) return true;
        return new Date(value) >= new Date(from);
      }
    ),
  batch_id: Yup.string().required("Batch is required"),
  class_id: Yup.string().required("Class is required"),
  division_id: Yup.string().required("Division is required"),
  student_id: Yup.string().required("Student is required"),
});

const initialValues = {
  from_date: "",
  to_date: "",
  batch_id: "",
  class_id: "",
  division_id: "",
  student_id: "",
};

const FormField = ({ label, icon, error, children }) => (
  <div className="col-md-6 col-lg-4">
    <label className="form-label fw-semibold text-secondary d-flex align-items-center gap-1 mb-1"
      style={{ fontSize: "0.82rem" }}
    >
      <Icon icon={icon} style={{ fontSize: "1.1rem" }} />
      {label}
    </label>
    {children}
    <div className="text-danger small mt-1" style={{ minHeight: "1.2em" }}>
      <ErrorMessage name={error} />
    </div>
  </div>
);

function ReceiptFormFields({ batches, classes, divisions }) {
  const { values, setFieldValue, isSubmitting } = useFormikContext();
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadStudents = async () => {
      if (!values.class_id || !values.division_id) {
        setStudents([]);
        setFieldValue("student_id", "");
        return;
      }

      setLoadingStudents(true);
      try {
        const { data } = await axios.get(
          `${baseURL}/api/personal-information/students`,
          {
            params: {
              class_id: values.class_id,
              division_id: values.division_id,
              batch_id: values.batch_id || undefined,
            },
          }
        );
        const list = data?.data ?? data ?? [];
        if (!cancelled) {
          setStudents(Array.isArray(list) ? list : []);
          setFieldValue("student_id", "");
        }
      } catch {
        if (!cancelled) {
          setStudents([]);
          setFieldValue("student_id", "");
        }
      } finally {
        if (!cancelled) setLoadingStudents(false);
      }
    };

    loadStudents();
    return () => {
      cancelled = true;
    };
  }, [
    values.class_id,
    values.division_id,
    values.batch_id,
    setFieldValue,
  ]);

  return (
    <>
      {/* Date range section */}
      <div className="mb-2">
        <h6 className="text-muted fw-semibold d-flex align-items-center gap-2 mb-3"
          style={{ fontSize: "0.85rem", letterSpacing: "0.03em" }}
        >
          <Icon icon="solar:calendar-bold-duotone" style={{ fontSize: "1.15rem", color: "#487fff" }} />
          DATE RANGE
        </h6>
        <div className="row g-3">
          <FormField label="From Date" icon="solar:calendar-minimalistic-bold" error="from_date">
            <Field type="date" name="from_date" className="form-control form-control-sm" />
          </FormField>

          <FormField label="To Date" icon="solar:calendar-minimalistic-bold" error="to_date">
            <Field type="date" name="to_date" className="form-control form-control-sm" />
          </FormField>
        </div>
      </div>

      <hr className="my-3" style={{ borderColor: "rgba(0,0,0,0.06)" }} />

      {/* Filters section */}
      <div className="mb-2">
        <h6 className="text-muted fw-semibold d-flex align-items-center gap-2 mb-3"
          style={{ fontSize: "0.85rem", letterSpacing: "0.03em" }}
        >
          <Icon icon="solar:filter-bold-duotone" style={{ fontSize: "1.15rem", color: "#487fff" }} />
          STUDENT DETAILS
        </h6>
        <div className="row g-3">
          <FormField label="Batch" icon="solar:notebook-bold" error="batch_id">
            <Field as="select" name="batch_id" className="form-select form-select-sm">
              <option value="">-- Select batch --</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.academic_year ?? b.name ?? b.id}
                </option>
              ))}
            </Field>
          </FormField>

          <FormField label="Class" icon="solar:square-academic-cap-bold" error="class_id">
            <Field as="select" name="class_id" className="form-select form-select-sm">
              <option value="">-- Select class --</option>
              {classes.map((c, idx) => (
                <option key={c.id ?? idx} value={c.id}>
                  {c.class_name}
                </option>
              ))}
            </Field>
          </FormField>

          <FormField label="Division" icon="solar:users-group-rounded-bold" error="division_id">
            <Field as="select" name="division_id" className="form-select form-select-sm">
              <option value="">-- Select division --</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.division_name}
                </option>
              ))}
            </Field>
          </FormField>

          <FormField label="Student" icon="solar:user-bold" error="student_id">
            <div className="position-relative">
              <Field
                as="select"
                name="student_id"
                className="form-select form-select-sm"
                disabled={loadingStudents || !values.class_id || !values.division_id}
              >
                <option value="">
                  {loadingStudents
                    ? "Loading students..."
                    : !values.class_id || !values.division_id
                      ? "Select class & division first"
                      : "-- Select student --"}
                </option>
                {students.map((s) => {
                  const id = s.id ?? s.reg_no ?? s.student_id;
                  const nameParts = [s.first_name, s.last_name]
                    .filter(Boolean)
                    .join(" ");
                  const label =
                    s.full_name ??
                    (nameParts || s.name || `Reg: ${s.reg_no ?? id}`);
                  return (
                    <option key={id} value={String(id)}>
                      {label}
                    </option>
                  );
                })}
              </Field>
              {loadingStudents && (
                <span
                  className="spinner-border spinner-border-sm text-primary position-absolute"
                  style={{ right: "2.2rem", top: "50%", marginTop: "-0.45rem" }}
                  role="status"
                />
              )}
            </div>
          </FormField>
        </div>
      </div>

      <hr className="my-3" style={{ borderColor: "rgba(0,0,0,0.06)" }} />

      {/* Submit */}
      <div className="d-flex align-items-center gap-3 pt-1">
        <button
          type="submit"
          className="btn btn-success d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-semibold"
          disabled={isSubmitting}
          style={{ boxShadow: isSubmitting ? "none" : "0 4px 14px rgba(25,135,84,0.3)" }}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" />
              Downloading...
            </>
          ) : (
            <>
              <Icon icon="solar:download-bold" style={{ fontSize: "1.25rem" }} />
              Download Receipt
            </>
          )}
        </button>
        <button
          type="reset"
          className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-semibold"
        >
          <Icon icon="solar:refresh-bold" style={{ fontSize: "1.15rem" }} />
          Reset
        </button>
      </div>
    </>
  );
}

const DownloadReciept = () => {
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [res1, res2, res3] = await Promise.all([
          axios.get(`${baseURL}/api/academic-years`),
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/divisions`),
        ]);
        setBatches(res1?.data?.data || []);
        setClasses(res2?.data?.data || []);
        setDivisions(res3?.data?.data || []);
      } catch (e) {
        console.error("Failed to load dropdown options", e);
      } finally {
        setLoadingOptions(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/academic-fee/download-receipt`,
        values,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] || "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${values.student_id}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      resetForm();
    } catch (err) {
      console.error("Download receipt failed:", err);
      alert(
        "Could not download receipt. Ensure the API route exists and returns a file, or handle the response in handleSubmit."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="fee-report-scope">
        <div className="fee-report-card card border-0 p-5 text-center">
          <div className="d-flex flex-column align-items-center gap-3">
            <span className="spinner-border text-success" role="status" />
            <span className="text-muted fw-medium">Loading form options...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fee-report-scope">
      <div className="fee-report-card card border-0">
        {/* Header */}
        <div
          className="card-header border-0 d-flex align-items-center gap-3 py-3 px-4"
          style={{
            background: "linear-gradient(135deg, #198754 0%, #157347 100%)",
          }}
        >
          <div
            className="fee-report-icon-wrap"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            <Icon icon="solar:document-bold" style={{ fontSize: "1.35rem", color: "#fff" }} />
          </div>
          <div>
            <h6 className="mb-0 text-white fw-bold" style={{ fontSize: "1.05rem" }}>
              Download Receipt
            </h6>
            <small className="text-white-50" style={{ fontSize: "0.78rem" }}>
              Select filters and download the fee receipt as PDF
            </small>
          </div>
        </div>

        {/* Body */}
        <div className="card-body px-4 py-4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <ReceiptFormFields
                batches={batches}
                classes={classes}
                divisions={divisions}
              />
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default DownloadReciept;
