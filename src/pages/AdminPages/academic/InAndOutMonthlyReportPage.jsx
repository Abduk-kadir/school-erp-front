import { useEffect, useMemo, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/academicOfflineFeeReport.css";

const REPORT_URL = `${baseURL}/api/in-out-attendance/reports/monthly`;
const MAX_RANGE_DAYS = 31;
const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const pad2 = (n) => String(n).padStart(2, "0");

const toDateKey = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const parseDateKey = (dateStr) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return Number.isNaN(d.getTime()) ? null : d;
};

const getDayDifference = (fromDate, toDate) =>
  Math.round((parseDateKey(toDate) - parseDateKey(fromDate)) / DAY_MS);

const getDateRange = (fromDate, toDate) => {
  const start = parseDateKey(fromDate);
  const end = parseDateKey(toDate);
  if (!start || !end || start > end) return [];

  const dates = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push({
      key: toDateKey(cursor),
      month: cursor.getMonth() + 1,
      day: cursor.getDate(),
      label: `${cursor.getDate()} ${MONTH_NAMES[cursor.getMonth()]}`,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
};

const getStatusType = (value) => {
  if (typeof value !== "string") return null;
  const code = value.trim().charAt(0).toUpperCase();
  if (code === "P") return "present";
  if (code === "A") return "absent";
  return null;
};

// Each API row holds one month of a student's attendance, keyed by day "1".."31".
const flattenRows = (rows, rangeDates) =>
  rows.map((row) => {
    const rowMonth = Number(row.month_number);
    const flat = {
      reg_no: row.reg_no ?? "",
      name: row.name ?? "",
      class: row.class ?? "",
      div: row.div ?? row.division ?? "",
      roll_no: row.roll_no ?? "",
    };

    let present = 0;
    let absent = 0;

    rangeDates.forEach(({ key, month, day }) => {
      const value = month === rowMonth ? row[day] ?? "" : "";
      flat[`day_${key}`] = value;
      const status = getStatusType(value);
      if (status === "present") present += 1;
      if (status === "absent") absent += 1;
    });

    const workingDays = present + absent;
    flat.total_present = present;
    flat.total_absent = absent;
    flat.total_working_days = workingDays;
    flat.present_percent = `${
      workingDays ? Math.round((present / workingDays) * 100) : 0
    }%`;

    return flat;
  });

const buildColumns = (rangeDates) => {
  const cols = [
    {
      data: null,
      title: "Sr No",
      orderable: false,
      render: (_data, _type, _row, meta) =>
        meta.settings._iDisplayStart + meta.row + 1,
    },
    { data: "reg_no", title: "Reg No", defaultContent: "" },
    { data: "name", title: "Name", defaultContent: "" },
    { data: "class", title: "Class", defaultContent: "" },
    { data: "div", title: "Division", defaultContent: "" },
    { data: "roll_no", title: "Roll No", defaultContent: "" },
  ];

  rangeDates.forEach(({ key, label }) => {
    cols.push({
      data: `day_${key}`,
      title: label,
      defaultContent: "",
      orderable: false,
      className: "monthly-day-col text-nowrap",
      createdCell: (td, cellData) => {
        const status = getStatusType(cellData);
        if (status) td.classList.add(`status-${status}`);
      },
    });
  });

  cols.push(
    { data: "total_present", title: "Present", defaultContent: "", orderable: false },
    { data: "total_absent", title: "Absent", defaultContent: "", orderable: false },
    {
      data: "total_working_days",
      title: "Working Days",
      defaultContent: "",
      orderable: false,
    },
    { data: "present_percent", title: "Present %", defaultContent: "", orderable: false }
  );

  return cols;
};

const defaultFromDate = () => {
  const now = new Date();
  return toDateKey(new Date(now.getFullYear(), now.getMonth(), 1));
};

const defaultToDate = () => toDateKey(new Date());

const InAndOutMonthlyReportPage = () => {
  const tableContainerRef = useRef(null);
  const datatableRef = useRef(null);

  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [batchMasters, setBatchMasters] = useState([]);
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const [batchFilter, setBatchFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [dateError, setDateError] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [exportingFormat, setExportingFormat] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/batches`);
        setBatches(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error("Failed to load batches", err);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    setClasses([]);
    setDivisions([]);
    setBatchMasters([]);
    if (!batchFilter) return;

    let cancelled = false;
    const fetchBatchRelations = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/batches/${batchFilter}/relations`
        );
        if (cancelled) return;
        setClasses(res?.data?.class || []);
        setDivisions(res?.data?.division || []);
        setBatchMasters(
          res?.data?.batchmasters || res?.data?.batchMasters || []
        );
      } catch (err) {
        console.error("Failed to load batch relations", err);
      }
    };
    fetchBatchRelations();
    return () => {
      cancelled = true;
    };
  }, [batchFilter]);

  const classDivisions = useMemo(() => {
    if (!classFilter) return [];
    if (!batchMasters.length) return divisions;
    const divisionIds = new Set(
      batchMasters
        .filter((bm) => String(bm.classId) === String(classFilter))
        .map((bm) => String(bm.divisionId ?? bm.divId))
    );
    return divisions.filter((d) => divisionIds.has(String(d.id)));
  }, [classFilter, divisions, batchMasters]);

  const handleBatchChange = (value) => {
    setBatchFilter(value);
    setClassFilter("");
    setDivisionFilter("");
  };

  const handleClassChange = (value) => {
    setClassFilter(value);
    setDivisionFilter("");
  };

  const validateDates = () => {
    if (!parseDateKey(fromDate) || !parseDateKey(toDate)) {
      return "Please select both From Date and To Date.";
    }
    const diff = getDayDifference(fromDate, toDate);
    if (diff < 0) {
      return "From Date cannot be after To Date.";
    }
    if (diff > MAX_RANGE_DAYS) {
      return `Please select a correct date range. It should not be more than ${MAX_RANGE_DAYS} days.`;
    }
    return "";
  };

  const handleFilter = () => {
    const error = validateDates();
    setDateError(error);
    if (error) {
      setAppliedFilters(null);
      return;
    }

    setAppliedFilters({
      fromDate,
      toDate,
      batchId: String(batchFilter).trim(),
      className: String(classFilter).trim(),
      divisionId: String(divisionFilter).trim(),
    });
  };

  const triggerFileDownload = (blob, filename) => {
    const href = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(href);
  };

  const handleExportDownload = async (format) => {
    if (!appliedFilters) return;
    const ext =
      format === "excel" ? "xlsx" : format === "csv" ? "csv" : "pdf";
    const filename = `in-out-monthly-${format}-${Date.now()}.${ext}`;
    try {
      setExportingFormat(format);
      const params = new URLSearchParams({ format });
      Object.entries(appliedFilters).forEach(([key, value]) => {
        const v = value == null ? "" : String(value).trim();
        if (v !== "") params.set(key, v);
      });
      const { data } = await axios.get(
        `${REPORT_URL}/export?${params.toString()}`,
        { responseType: "blob" }
      );
      triggerFileDownload(data, filename);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportingFormat(null);
    }
  };

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!appliedFilters || !container) return;

    const rangeDates = getDateRange(appliedFilters.fromDate, appliedFilters.toDate);

    // DataTables owns this element; React only renders the empty container.
    const table = document.createElement("table");
    table.className = "table report-table mb-0";
    table.id = "inOutMonthlyDataTable";
    container.appendChild(table);

    datatableRef.current = $(table).DataTable({
      pageLength: 10,
      processing: true,
      serverSide: true,
      scrollX: true,
      order: [],
      ajax: {
        url: REPORT_URL,
        type: "GET",
        data: (d) => {
          d.filter = { ...appliedFilters };
        },
        dataSrc: (json) => {
          if (json) {
            json.recordsTotal = json.recordsTotal ?? json.count ?? 0;
            json.recordsFiltered = json.recordsFiltered ?? json.count ?? 0;
          }
          return flattenRows(json?.data ?? [], rangeDates);
        },
      },
      columns: buildColumns(rangeDates),
      columnDefs: [{ targets: "_all", className: "align-middle" }],
    });

    return () => {
      if (datatableRef.current) {
        datatableRef.current.destroy(true);
        datatableRef.current = null;
      }
      container.innerHTML = "";
    };
  }, [appliedFilters]);

  return (
    <div className="chfi-wrapper d-flex flex-column gap-3 pb-2 in-out-monthly-report">
      <section className="chfi-card" aria-label="Monthly report filters">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:filter-bold-duotone" width="22" />
            </span>
            <div>
              <h5 className="card-title">Filter Monthly Report</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="report-filter-grid">
            <div className="report-filter-field">
              <label className="form-label">
                <span className="label-dot" />
                From Date
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:calendar-bold-duotone" width="18" />
                </span>
                <input
                  className={`form-control${dateError ? " is-invalid" : ""}`}
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setDateError("");
                  }}
                />
              </div>
            </div>

            <div className="report-filter-field">
              <label className="form-label">
                <span className="label-dot" />
                To Date
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:calendar-bold-duotone" width="18" />
                </span>
                <input
                  className={`form-control${dateError ? " is-invalid" : ""}`}
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setDateError("");
                  }}
                />
              </div>
            </div>

            <div className="report-filter-field">
              <label className="form-label">
                <span className="label-dot" />
                Batch
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:layers-bold-duotone" width="18" />
                </span>
                <select
                  className="form-select"
                  value={batchFilter}
                  onChange={(e) => handleBatchChange(e.target.value)}
                >
                  <option value="">Select Batch</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batch_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="report-filter-field">
              <label className="form-label">
                <span className="label-dot" />
                Class
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:square-academic-cap-bold-duotone" width="18" />
                </span>
                <select
                  className="form-select"
                  value={classFilter}
                  disabled={!batchFilter}
                  onChange={(e) => handleClassChange(e.target.value)}
                >
                  <option value="">Select Class</option>
                  {classes.map((elem, index) => (
                    <option key={index} value={elem?.id ?? elem?.class_name}>
                      {elem?.class_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="report-filter-field">
              <label className="form-label">
                <span className="label-dot" />
                Division
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:widget-bold-duotone" width="18" />
                </span>
                <select
                  className="form-select"
                  value={divisionFilter}
                  disabled={!classFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                >
                  <option value="">Select Division</option>
                  {classDivisions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.division_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="report-filter-field report-filter-action">
              <button
                type="button"
                className="btn-submit"
                onClick={handleFilter}
              >
                <Icon icon="solar:magnifer-bold-duotone" width="18" />
                Apply Filters
              </button>
            </div>
          </div>

          {dateError && (
            <div className="text-danger small mt-2" role="alert">
              {dateError}
            </div>
          )}
        </div>
      </section>

      <section
        className="chfi-card report-table-card"
        aria-label="Monthly in-out report data"
      >
        <div className="card-header">
          <div className="header-row report-header-row">
            <div className="header-row" style={{ gap: 8, minWidth: 0 }}>
              <span className="header-icon">
                <Icon icon="solar:calendar-mark-bold-duotone" width="22" />
              </span>
              <div className="min-w-0">
                <h5 className="card-title">In / Out Monthly Report</h5>
              </div>
            </div>
            <div className="report-export-group">
              <button
                type="button"
                className="export-btn"
                disabled={!!exportingFormat || !appliedFilters}
                onClick={() => handleExportDownload("excel")}
                title="Download Excel"
              >
                {exportingFormat === "excel" ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <Icon icon="vscode-icons:file-type-excel" width="18" />
                )}
                Excel
              </button>
              <button
                type="button"
                className="export-btn"
                disabled={!!exportingFormat || !appliedFilters}
                onClick={() => handleExportDownload("csv")}
                title="Download CSV"
              >
                {exportingFormat === "csv" ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <Icon icon="vscode-icons:file-type-csv" width="18" />
                )}
                CSV
              </button>
              <button
                type="button"
                className="export-btn"
                disabled={!!exportingFormat || !appliedFilters}
                onClick={() => handleExportDownload("pdf")}
                title="Download PDF"
              >
                {exportingFormat === "pdf" ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <Icon icon="vscode-icons:file-type-pdf2" width="18" />
                )}
                PDF
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {!appliedFilters && (
            <div className="text-center text-muted py-4">
              Select a date range and click <strong>Apply Filters</strong> to
              view the report.
            </div>
          )}
          <div
            className="report-table-wrap monthly-report-table-wrap"
            ref={tableContainerRef}
          />
        </div>
      </section>

      <style>{`
        .in-out-monthly-report .monthly-report-table-wrap {
          overflow-x: auto;
        }
        .in-out-monthly-report .monthly-day-col {
          min-width: 118px;
          max-width: 140px;
          font-size: 0.78rem;
          white-space: nowrap;
        }
        .in-out-monthly-report td.status-present {
          color: #198754;
          font-weight: 600;
        }
        .in-out-monthly-report td.status-absent {
          color: #dc3545;
          font-weight: 600;
        }
        .in-out-monthly-report .dataTables_wrapper,
        .in-out-monthly-report .dt-container {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default InAndOutMonthlyReportPage;
