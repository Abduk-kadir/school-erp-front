import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";

const initialValues = {
  groupname: "",
};

const validationSchema = Yup.object({
  groupname: Yup.string()
    .trim()
    .required("Group name is required")
    .min(1, "Group name is required"),
});

const AddGroup = ({ className = "" }) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [feeHeads, setFeeHeads] = useState([]);
  const [selectedFeeHeadIds, setSelectedFeeHeadIds] = useState([]);

  const feeHeadsSorted = useMemo(() => {
    const arr = Array.isArray(feeHeads) ? [...feeHeads] : [];
    arr.sort((a, b) => String(a?.fee_head_name ?? a?.name ?? "").localeCompare(String(b?.fee_head_name ?? b?.name ?? "")));
    return arr;
  }, [feeHeads]);

  useEffect(() => {
    const fetchFeeHeads = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/fee-heads`);
        setFeeHeads(res?.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching fee heads:", error);
        setFeeHeads([]);
      }
    };
    fetchFeeHeads();
  }, []);

  const handleFeeHeadToggle = (headId) => {
    setSelectedFeeHeadIds((prev) => {
      const id = Number(headId);
      if (Number.isNaN(id)) return prev;
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(`${baseURL}/api/fee-groups`, {
        groupname: values.groupname.trim(),
        selectedFeeHeadIds,
      });
      setSuccessMsg("Fee group added successfully.");
      resetForm();
      setSelectedFeeHeadIds([]);
    } catch (error) {
      console.error("Error adding fee group:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add fee group. Please try again.";
      setErrorMsg(typeof msg === "string" ? msg : "Failed to add fee group.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className={`fee-group-root card shadow ${className}`.trim()}>
      <style>
        {`
          .fee-group-root { 
            border-radius: 16px; 
            overflow: hidden; 
            border: 1px solid rgba(148,163,184,0.18);
          }
          .fee-group-root .card-header{
            border: 0;
            padding: 14px 18px;
            background: linear-gradient(135deg, rgba(16,185,129,0.14), rgba(34,197,94,0.12), rgba(20,184,166,0.12));
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:12px;
          }
          .fee-group-root .header-title{
            display:flex;
            align-items:center;
            gap:10px;
          }
          .fee-group-root .header-icon{
            width:36px;height:36px;border-radius:12px;
            display:inline-flex;align-items:center;justify-content:center;
            background:#fff;
            border:1px solid rgba(148,163,184,0.22);
            box-shadow: 0 10px 24px -18px rgba(15,23,42,0.35);
            color:#059669;
          }
          .fee-group-root .header-sub{
            margin:0;
            color:#64748b;
            font-size:0.8rem;
          }
          .fee-group-root .card-body{ padding: 18px; }

          .fee-group-root .feeheads-toolbar{
            display:flex;
            align-items:center;
            justify-content:space-between;
            flex-wrap:wrap;
            gap:10px;
            margin-bottom:10px;
          }
          .fee-group-root .selected-badge{
            display:inline-flex;
            align-items:center;
            gap:6px;
            padding: 6px 10px;
            border-radius: 999px;
            background: rgba(16,185,129,0.14);
            color: #047857;
            border: 1px solid rgba(16,185,129,0.28);
            font-weight: 600;
            font-size: 0.78rem;
          }

          .fee-group-root .feehead-chip{
            display:flex;
            align-items:center;
            gap:10px;
            border-radius: 12px;
            padding: 10px 12px;
            border: 1px solid rgba(148,163,184,0.22);
            background: #fff;
            transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
            cursor:pointer;
            user-select:none;
          }
          .fee-group-root .feehead-chip:hover{
            transform: translateY(-1px);
            box-shadow: 0 10px 22px -18px rgba(15,23,42,0.35);
            border-color: rgba(16,185,129,0.40);
          }
          .fee-group-root .feehead-chip.is-checked{
            border-color: rgba(16,185,129,0.60);
            background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,184,166,0.08));
          }
          .fee-group-root .feehead-dot{
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: rgba(148,163,184,0.65);
            flex-shrink: 0;
          }
          .fee-group-root .feehead-chip.is-checked .feehead-dot{
            background: linear-gradient(135deg, #10b981, #14b8a6);
          }
          .fee-group-root .feehead-chip input{ display:none; }
        `}
      </style>

      <div className="card-header">
        <div className="header-title">
          <span className="header-icon" aria-hidden="true">FG</span>
          <div>
            <h6 className="mb-0">Add fee group</h6>
            <p className="header-sub">Create group and attach fee heads</p>
          </div>
        </div>
        <span className="selected-badge">Selected: {selectedFeeHeadIds.length}</span>
      </div>

      <div className="card-body">
        {successMsg && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {successMsg}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMsg("")}
              aria-label="Close"
            />
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {errorMsg}
            <button
              type="button"
              className="btn-close"
              onClick={() => setErrorMsg("")}
              aria-label="Close"
            />
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {loading && <Loader message="Saving fee group…" />}

              <div className="col-md-6">
                <label className="form-label fw-bold" htmlFor="fee-group-name">
                  Group name
                </label>
                <Field
                  id="fee-group-name"
                  type="text"
                  name="groupname"
                  className="form-control"
                  placeholder="e.g. Standard A"
                  autoComplete="off"
                />
                <ErrorMessage name="groupname" component="div" className="text-danger small mt-1" />
              </div>

              <div className="mt-4">
                <div className="feeheads-toolbar">
                  <h6 className="mb-0">Fee Heads</h6>
                  <small className="text-muted">Pick the heads included in this group.</small>
                </div>

                {feeHeadsSorted.length === 0 ? (
                  <div className="text-muted small">No fee heads found.</div>
                ) : (
                  <div className="row g-2">
                    {feeHeadsSorted.map((h) => {
                      const id = h?.id;
                      const label = h?.fee_head_name ?? h?.name ?? `Fee Head #${id}`;
                      const checked = selectedFeeHeadIds.includes(Number(id));
                      return (
                        <div className="col-12 col-sm-6 col-lg-4" key={id}>
                          <label
                            className={`feehead-chip ${checked ? "is-checked" : ""}`}
                            style={{ cursor: "pointer" }}
                          >
                            <span className="feehead-dot" aria-hidden="true" />
                            <input
                              type="checkbox"
                              className="form-check-input m-0"
                              checked={checked}
                              onChange={() => handleFeeHeadToggle(id)}
                            />
                            <span className="small fw-medium">{label}</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? "Saving…" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddGroup;
