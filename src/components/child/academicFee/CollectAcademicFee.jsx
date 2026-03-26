import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/academicOfflineFeeReport.css";

const displayVal = (v) => {
  if (v == null || v === "") return "—";
  return String(v);
};

function StudentDetailPanel({ student }) {
  const fullName = [student.first_name, student.last_name].filter(Boolean).join(" ").trim();
  const detailRows = [
    { label: "Reg. no.", value: student.reg_no },
    { label: "Student name", value: fullName || "—" },
    { label: "Father name", value: student.father_name },
    { label: "Mother name", value: student.mother_name },
    { label: "Class", value: student.class },
    { label: "Division", value: student.division },
    { label: "Contact", value: student.contact_number },
    { label: "Email", value: student.email },
    { label: "Date of birth", value: student.dob },
    { label: "Blood group", value: student.blood_group },
    { label: "State", value: student.State },
    { label: "City", value: student.city },
  ];

  return (
    <section
      className="card fee-report-card border-0 mb-0"
      aria-label="Student details"
    >
      <div className="card-header border-0 bg-success bg-opacity-10 py-1 px-3">
        <h6 className="card-title mb-0 fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>
          Student details
        </h6>
      </div>
      <div className="card-body px-3 py-2">
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <div
              className="rounded-2 border bg-light d-flex align-items-center justify-content-center text-muted fw-medium flex-shrink-0"
              style={{ width: "4.5rem", height: "4.5rem", fontSize: "0.7rem" }}
            >
              Photo
            </div>
          </div>
          <div className="col min-w-0">
            <div className="row g-1 row-cols-1 row-cols-md-2 row-cols-xl-3">
              {detailRows.map(({ label, value }) => (
                <div key={label} className="col">
                  <div
                    className="d-flex align-items-baseline gap-1 text-break"
                    style={{ fontSize: "0.78rem", lineHeight: 1.35 }}
                  >
                    <span className="text-secondary fw-semibold flex-shrink-0">{label}:</span>
                    <span className="text-dark" style={{ minWidth: 0 }}>
                      {displayVal(value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const MONTHS = [
  { key: "jan", label: "Jan" },
  { key: "feb", label: "Feb" },
  { key: "mar", label: "Mar" },
  { key: "apr", label: "Apr" },
  { key: "may", label: "May" },
  { key: "jun", label: "Jun" },
  { key: "jul", label: "Jul" },
  { key: "aug", label: "Aug" },
  { key: "sep", label: "Sep" },
  { key: "oct", label: "Oct" },
  { key: "nov", label: "Nov" },
  { key: "dec", label: "Dec" },
];

const monthTemplate = () => ({
  jan: { total: 0, paid: 0, due: 0 },
  feb: { total: 0, paid: 0, due: 0 },
  mar: { total: 0, paid: 0, due: 0 },
  apr: { total: 0, paid: 0, due: 0 },
  may: { total: 0, paid: 0, due: 0 },
  jun: { total: 0, paid: 0, due: 0 },
  jul: { total: 0, paid: 0, due: 0 },
  aug: { total: 0, paid: 0, due: 0 },
  sep: { total: 0, paid: 0, due: 0 },
  oct: { total: 0, paid: 0, due: 0 },
  nov: { total: 0, paid: 0, due: 0 },
  dec: { total: 0, paid: 0, due: 0 },
});

const INITIAL_FEES = [
  { id: 1, fee_head: "lab fee", label: "total paying valance", ...monthTemplate() },
  { id: 2, fee_head: "tution fee", label: "total paying valance", ...monthTemplate() },
  { id: 3, fee_head: "library fee", label: "total paying valance", ...monthTemplate() },
  { id: 4, fee_head: "transport fee", label: "total paying valance", ...monthTemplate() },
  { id: 5, fee_head: "hostel fee", label: "total paying valance", ...monthTemplate() },
  { id: 6, fee_head: "other fee", label: "total paying valance", ...monthTemplate() },
];

const parseNum = (v) => {
  const n = Number.parseFloat(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const normalizeFeeHead = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

function monthFromApiRecord(rec, monthKey) {
  return {
    total: parseNum(rec[`${monthKey}_total`]),
    paid: parseNum(rec[`${monthKey}_paid`]),
    due: parseNum(rec[`${monthKey}_due`]),
  };
}

function mergeApiRecordsIntoRows(baseRows, records) {
  if (!Array.isArray(records) || records.length === 0) return baseRows;

  // Match table rows only to feeHeadInfo.fee_head_name (not API fee_head),
  // so a wrong top-level fee_head (e.g. "Lab Fee") cannot map to the wrong row.
  return baseRows.map((row) => {
    const norm = normalizeFeeHead(row.fee_head);
    const match = records.find((r) => {
      const name = normalizeFeeHead(r.feeHeadInfo?.fee_head_name);
      if (!norm || !name) return false;
      if (name === norm) return true;
      return name.includes(norm) || norm.includes(name);
    });
    if (!match) return row;

    const next = { ...row };
    MONTHS.forEach(({ key }) => {
      next[key] = monthFromApiRecord(match, key);
    });
    return next;
  });
}

function studentDetailFromFirstRecord(first, regNo) {
  if (!first) return null;
  const st = first.student && typeof first.student === "object" ? { ...first.student } : {};
  return {
    ...st,
    reg_no: first.reg_no != null ? first.reg_no : regNo,
  };
}

const DISCOUNT_TYPE_OPTIONS = [
  { value: "", label: "— Select discount type —" },
  { value: "none", label: "None" },
  { value: "sibling", label: "Sibling" },
  { value: "merit", label: "Merit" },
  { value: "staff_ward", label: "Staff ward" },
  { value: "financial_aid", label: "Financial aid" },
  { value: "other", label: "Other" },
];

const PAYMENT_MODE_OPTIONS = [
  { value: "", label: "— Select payment mode —" },
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "upi", label: "UPI" },
  { value: "neft", label: "NEFT / RTGS" },
  { value: "cheque", label: "Cheque" },
  { value: "dd", label: "Demand draft" },
  { value: "online", label: "Online gateway" },
];

const emptyPaymentInfo = () => ({
  fine: "",
  discountType: "",
  concession: "",
  academicFee: "",
  payableFee: "",
  feesPlusFine: "",
  balance: "",
  remark: "",
  paymentMode: "",
  transactionDate: "",
  extraAmount: "",
});

function PaymentInformationSection({ paymentInfo, onChange, onPayNow, onPayAndPrint }) {
  const field = (key) => ({
    value: paymentInfo[key],
    onChange: (e) => onChange(key, e.target.value),
  });

  return (
    <section className="card fee-report-card border-0 mb-0" aria-label="Payment information">
      <div className="card-header border-0 bg-success bg-opacity-10 py-1 px-3">
        <h6 className="card-title mb-0 fw-semibold text-dark" style={{ fontSize: "0.88rem" }}>
          Payment information
        </h6>
      </div>
      <div className="card-body px-3 py-2">
        <div className="row g-1">
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
              Fine
            </label>
            <input type="number" className="form-control form-control-sm rounded-3" min={0} step={0.01} {...field("fine")} />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
              Discount type
            </label>
            <select className="form-select form-select-sm rounded-3" {...field("discountType")}>
              {DISCOUNT_TYPE_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
              Concession
            </label>
            <input type="number" className="form-control form-control-sm rounded-3" min={0} step={0.01} {...field("concession")} />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
              Academic fee
            </label>
            <input type="number" className="form-control form-control-sm rounded-3" min={0} step={0.01} {...field("academicFee")} />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
              Payable fee
            </label>
            <input type="number" className="form-control form-control-sm rounded-3" min={0} step={0.01} {...field("payableFee")} />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
              Fees plus fine
            </label>
            <input type="number" className="form-control form-control-sm rounded-3" min={0} step={0.01} {...field("feesPlusFine")} />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
              Balance
            </label>
            <input type="number" className="form-control form-control-sm rounded-3" min={0} step={0.01} {...field("balance")} />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
              Remark
            </label>
            <textarea className="form-control form-control-sm rounded-3 py-1" rows={1} {...field("remark")} />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
              Payment mode
            </label>
            <select className="form-select form-select-sm rounded-3" {...field("paymentMode")}>
              {PAYMENT_MODE_OPTIONS.map((o) => (
                <option key={o.value || "empty-pm"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
              Transaction date
            </label>
            <input type="date" className="form-control form-control-sm rounded-3" {...field("transactionDate")} />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
              Extra amount
            </label>
            <input type="number" className="form-control form-control-sm rounded-3" min={0} step={0.01} {...field("extraAmount")} />
          </div>
        </div>
        <div className="d-flex flex-wrap gap-1 justify-content-end mt-2 pt-2 border-top">
          <button type="button" className="btn btn-success btn-sm rounded-pill px-3 py-1 shadow-sm fw-semibold" onClick={onPayNow}>
            Pay now
          </button>
          <button type="button" className="btn btn-outline-success btn-sm rounded-pill px-3 py-1 fw-semibold" onClick={onPayAndPrint}>
            Pay and print
          </button>
        </div>
      </div>
    </section>
  );
}

const CollectAcademicFee = () => {
  const [meritListSearch, setMeritListSearch] = useState("");
  const [regNoSearch, setRegNoSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  const [studentDetail, setStudentDetail] = useState(null);
  const [studentSearchLoading, setStudentSearchLoading] = useState(false);
  const [studentSearchError, setStudentSearchError] = useState(null);

  const [rows, setRows] = useState(() => JSON.parse(JSON.stringify(INITIAL_FEES)));
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const selectAllRef = useRef(null);

  const [paymentInfo, setPaymentInfo] = useState(() => emptyPaymentInfo());

  useEffect(() => {
    if (!studentDetail) {
      setPaymentInfo(emptyPaymentInfo());
    }
  }, [studentDetail]);

  const handlePaymentFieldChange = (key, value) => {
    setPaymentInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handlePayNow = () => {
    // Wire payment API with paymentInfo + studentDetail
  };

  const handlePayAndPrint = () => {
    // Wire payment then print receipt
  };

  const handleStudentSearch = async () => {
    const reg = String(regNoSearch ?? "").trim();
    if (!reg) {
      setStudentSearchError("Enter a registration number to search.");
      setStudentDetail(null);
      return;
    }

    setStudentSearchLoading(true);
    setStudentSearchError(null);

    try {
      const { data: body } = await axios.get(
        `${baseURL}/api/fee-record-monthly/reg_no/${encodeURIComponent(reg)}`
      );

      if (body?.success === false) {
        throw new Error(body?.message || "Could not load fee records.");
      }

      const records = body?.data;
      if (!Array.isArray(records) || records.length === 0) {
        setStudentDetail(null);
        setRows(JSON.parse(JSON.stringify(INITIAL_FEES)));
        throw new Error("No fee records for this registration number.");
      }

      const first = records[0];
      setStudentDetail(studentDetailFromFirstRecord(first, reg));

      const base = JSON.parse(JSON.stringify(INITIAL_FEES));
      setRows(mergeApiRecordsIntoRows(base, records));
    } catch (err) {
      setStudentDetail(null);
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        "Could not load data.";
      setStudentSearchError(msg);
    } finally {
      setStudentSearchLoading(false);
    }
  };

  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
  const someSelected = rows.some((r) => selectedIds.has(r.id));

  useEffect(() => {
    const el = selectAllRef.current;
    if (el) el.indeterminate = someSelected && !allSelected;
  }, [someSelected, allSelected]);

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? new Set(rows.map((r) => r.id)) : new Set());
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateMonthField = (rowId, monthKey, field, raw) => {
    const value = parseNum(raw);
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        const cur = { ...row[monthKey] };
        cur[field] = value;
        if (field === "total" || field === "paid") {
          cur.due = Math.max(0, cur.total - cur.paid);
        }
        return { ...row, [monthKey]: cur };
      })
    );
  };

  return (
    <div className="fee-report-scope d-flex flex-column gap-4 pb-2">
      <section
        className="card fee-report-card border-0 mb-0"
        aria-label="Filter student"
      >
        <div className="card-header border-0 bg-success bg-opacity-10 py-2 px-3">
          <h6 className="card-title mb-0 fw-semibold text-dark" style={{ fontSize: "0.95rem" }}>
            Search Student
          </h6>
        </div>
        <div className="card-body px-3 py-2">
          <div className="d-flex flex-column flex-lg-row flex-wrap align-items-stretch align-items-lg-end gap-2">
            <div className="flex-grow-1" style={{ minWidth: "10rem" }}>
              <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
                Search from merit list
              </label>
              <input
                type="text"
                className="form-control form-control-sm rounded-3"
                placeholder="Merit list no. / rank…"
                value={meritListSearch}
                onChange={(e) => setMeritListSearch(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="flex-grow-1" style={{ minWidth: "10rem" }}>
              <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
                Search from reg no
              </label>
              <input
                type="text"
                className="form-control form-control-sm rounded-3"
                placeholder="Registration number…"
                value={regNoSearch}
                onChange={(e) => setRegNoSearch(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="flex-grow-1" style={{ minWidth: "10rem" }}>
              <label className="form-label small fw-semibold text-secondary mb-0" style={{ fontSize: "0.75rem" }}>
                Search from student
              </label>
              <input
                type="text"
                className="form-control form-control-sm rounded-3"
                placeholder="Student name…"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="d-flex justify-content-end ms-lg-auto pt-1 pt-lg-0">
              <button
                type="button"
                className="btn btn-success btn-sm rounded-pill px-3 shadow-sm fw-semibold d-inline-flex align-items-center gap-2"
                disabled={studentSearchLoading}
                onClick={handleStudentSearch}
              >
                {studentSearchLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden />
                    Loading…
                  </>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </div>
          {studentSearchError && (
            <div className="alert alert-danger py-2 px-3 mt-2 mb-0 small" role="alert">
              {studentSearchError}
            </div>
          )}
        </div>
      </section>

      {studentDetail && <StudentDetailPanel student={studentDetail} />}

      <div className="fee-report-card card border-0">
        <div
          className="card-header border-0 bg-primary bg-opacity-10 py-4 px-4 px-md-5 position-relative overflow-hidden"
          style={{
            borderBottom: "1px solid rgba(13, 110, 253, 0.16)",
            boxShadow: "inset 0 -1px 0 rgba(255, 255, 255, 0.65)",
          }}
        >
          <div
            className="position-absolute top-0 end-0 text-primary pointer-events-none"
            aria-hidden
            style={{
              opacity: 0.09,
              fontSize: "4rem",
              lineHeight: 1,
              transform: "translate(10%, -14%)",
            }}
          >
            <Icon icon="solar:wallet-money-bold-duotone" />
          </div>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 position-relative">
            <div className="d-flex align-items-center gap-2 gap-md-3 min-w-0">
              <span
                className="fee-report-icon-wrap bg-primary text-white shadow-sm flex-shrink-0 d-inline-flex align-items-center justify-content-center"
                style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem" }}
              >
                <Icon icon="solar:wallet-money-bold-duotone" style={{ fontSize: "1.1rem" }} />
              </span>
              <div className="min-w-0">
                <p
                  className="text-uppercase text-primary mb-1 fw-semibold small opacity-90"
                  style={{ fontSize: "0.68rem", letterSpacing: "0.12em" }}
                >
                  Academic fee
                </p>
                <h5 className="card-title mb-0 fw-bold text-dark" style={{ fontSize: "1.15rem" }}>
                  Collect academic fee
                </h5>
                <p className="small text-muted mb-0 mt-2 lh-sm" style={{ maxWidth: "36rem" }}>
                  Select rows with the checkboxes, then edit monthly <strong className="text-secondary fw-semibold">total</strong>,{" "}
                  <strong className="text-secondary fw-semibold">paid</strong>, and{" "}
                  <strong className="text-secondary fw-semibold">due</strong> in the grid below.
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <span
                className="badge rounded-pill px-3 py-2 fw-semibold border shadow-sm"
                style={{
                  background: "linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)",
                  color: "#084298",
                  borderColor: "rgba(13, 110, 253, 0.28)",
                }}
              >
                <Icon icon="solar:check-circle-bold" className="me-1 text-primary" style={{ verticalAlign: "-0.1em" }} />
                {selectedIds.size} / {rows.length} rows
              </span>
            </div>
          </div>
        </div>
        <div className="card-body px-3 px-md-4 pb-4 pt-3">
          <div
            className="table-responsive shadow-sm rounded-3 border"
            style={{ maxHeight: "min(70vh, 720px)", overflow: "auto" }}
          >
            <table className="table table-bordered table-sm align-middle mb-0 text-nowrap">
              <thead className="sticky-top" style={{ zIndex: 2 }}>
                <tr
                  style={{
                    background: "rgba(25, 135, 84, 0.09)",
                    boxShadow: "0 1px 0 rgba(25, 135, 84, 0.15)",
                  }}
                >
                  <th
                    className="text-center align-middle border-end border-success border-opacity-10"
                    style={{ minWidth: "2.75rem", background: "rgba(25, 135, 84, 0.06)" }}
                  >
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      className="form-check-input mt-0"
                      checked={allSelected}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      title="Select all rows"
                      aria-label="Select all rows"
                    />
                  </th>
                  <th
                    className="fw-semibold text-dark border-end border-success border-opacity-10"
                    style={{ background: "rgba(25, 135, 84, 0.06)" }}
                  >
                    Fee head
                  </th>
                  <th
                    className="fw-semibold text-dark border-end border-success border-opacity-10"
                    style={{ background: "rgba(25, 135, 84, 0.06)" }}
                  >
                    Label
                  </th>
                  {MONTHS.map(({ key, label }) => (
                    <th
                      key={key}
                      className="text-center align-middle border-start border-success border-opacity-20 fw-bold small"
                      style={{
                        color: "#065f46",
                        letterSpacing: "0.04em",
                        background: "rgba(25, 135, 84, 0.11)",
                        minWidth: "5.5rem",
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className={selectedIds.has(row.id) ? "table-active" : undefined}
                  >
                    <td className="text-center bg-white">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        aria-label={`Select ${row.fee_head}`}
                      />
                    </td>
                    <td className="fw-medium">{row.fee_head}</td>
                    <td>
                      <small className="text-secondary">{row.label}</small>
                    </td>
                    {MONTHS.map(({ key }) => {
                      const m = row[key];
                      return (
                        <td key={`${row.id}-${key}`} className="p-1 align-top" style={{ minWidth: "5.25rem", verticalAlign: "top" }}>
                          <div className="d-flex flex-column gap-1">
                            <div>
                              <label className="form-label text-muted mb-0 d-block" style={{ fontSize: "0.65rem" }}>
                                Total
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm px-1"
                                min={0}
                                step={0.01}
                                value={m.total}
                                onChange={(e) =>
                                  updateMonthField(row.id, key, "total", e.target.value)
                                }
                                aria-label={`${row.fee_head} ${key} total`}
                              />
                            </div>
                            <div>
                              <label className="form-label text-muted mb-0 d-block" style={{ fontSize: "0.65rem" }}>
                                Paid
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm px-1"
                                min={0}
                                step={0.01}
                                value={m.paid}
                                onChange={(e) =>
                                  updateMonthField(row.id, key, "paid", e.target.value)
                                }
                                aria-label={`${row.fee_head} ${key} paid`}
                              />
                            </div>
                            <div>
                              <label className="form-label text-muted mb-0 d-block" style={{ fontSize: "0.65rem" }}>
                                Due
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm px-1"
                                min={0}
                                step={0.01}
                                value={m.due}
                                onChange={(e) =>
                                  updateMonthField(row.id, key, "due", e.target.value)
                                }
                                aria-label={`${row.fee_head} ${key} due`}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {studentDetail && (
        <PaymentInformationSection
          paymentInfo={paymentInfo}
          onChange={handlePaymentFieldChange}
          onPayNow={handlePayNow}
          onPayAndPrint={handlePayAndPrint}
        />
      )}
    </div>
  );
};

export default CollectAcademicFee;
