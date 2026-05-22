import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/academicOfflineFeeReport.css";

const REPORT_URL = `${baseURL}/api/in-out-attendance/reports/monthly`;

const formatDayHeader = (dateStr) => {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const getDaysInMonth = (yearMonth) => {
  if (!yearMonth || !/^\d{4}-\d{2}$/.test(yearMonth)) return [];
  const [year, month] = yearMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const m = String(month).padStart(2, "0");
    return `${year}-${m}-${day}`;
  });
};

const flattenMonthlyRow = (row, monthDates) => {
  const statusByDate = {};
  (row.daily || []).forEach(({ date, status }) => {
    if (date) statusByDate[date] = status ?? "";
  });

  const flat = {
    srno: row.srno ?? row.sr_no ?? "",
    reg_no: row.reg_no ?? "",
    name: row.name ?? "",
    class: row.class ?? "",
    div: row.div ?? row.division ?? "",
    roll_no: row.roll_no ?? "",
    total_present: row.total_present ?? "",
    total_absent: row.total_absent ?? "",
    total_working_days: row.total_working_days ?? "",
    present_percent:
      row.present_percent != null ? `${row.present_percent}%` : "",
  };

  monthDates.forEach((date) => {
    flat[`day_${date}`] = statusByDate[date] ?? "";
  });

  return flat;
};

const defaultMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const InAndOutMonthlyReportPage = () => {
  const tableRef = useRef(null);
  const datatableRef = useRef(null);

  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [batches, setBatches] = useState([]);

  const [monthFilter, setMonthFilter] = useState(defaultMonth);
  const [classFilter, setClassFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [exportingFormat, setExportingFormat] = useState(null);

  const monthFilterRef = useRef(monthFilter);
  const classFilterRef = useRef("");
  const batchFilterRef = useRef("");
  const divisionFilterRef = useRef("");
  const monthDatesRef = useRef([]);

  useEffect(() => {
    monthFilterRef.current = monthFilter;
  }, [monthFilter]);

  useEffect(() => {
    classFilterRef.current = classFilter;
  }, [classFilter]);

  useEffect(() => {
    batchFilterRef.current = batchFilter;
  }, [batchFilter]);

  useEffect(() => {
    divisionFilterRef.current = divisionFilter;
  }, [divisionFilter]);

  const monthDates = useMemo(() => getDaysInMonth(monthFilter), [monthFilter]);

  useEffect(() => {
    monthDatesRef.current = monthDates;
  }, [monthDates]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [classRes, divisionRes] = await Promise.all([
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/divisions`),
        ]);
        setClasses(classRes?.data?.data || classRes?.data || []);
        setDivisions(divisionRes?.data?.data || divisionRes?.data || []);
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };
    fetchFilters();
  }, []);

  const buildColumns = useCallback(() => {
    const cols = [
      { data: "srno", title: "Sr No", defaultContent: "" },
      { data: "reg_no", title: "Reg No", defaultContent: "" },
      { data: "name", title: "Name", defaultContent: "" },
      { data: "class", title: "Class", defaultContent: "" },
      { data: "div", title: "Division", defaultContent: "" },
      { data: "roll_no", title: "Roll No", defaultContent: "" },
    ];

    monthDates.forEach((date) => {
      cols.push({
        data: `day_${date}`,
        title: formatDayHeader(date),
        defaultContent: "",
        className: "monthly-day-col text-nowrap",
      });
    });

    cols.push(
      { data: "total_present", title: "Present", defaultContent: "" },
      { data: "total_absent", title: "Absent", defaultContent: "" },
      { data: "total_working_days", title: "Working Days", defaultContent: "" },
      { data: "present_percent", title: "Present %", defaultContent: "" }
    );

    return cols;
  }, [monthDates]);

  const handleFilter = () => {
    if (datatableRef.current) {
      datatableRef.current.draw();
    }
  };

  const getReportFiltersForExport = () => ({
    month: monthFilterRef.current.trim(),
    className: classFilterRef.current.trim(),
    batchId: batchFilterRef.current.trim(),
    divisionId: divisionFilterRef.current.trim(),
  });

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
    const ext =
      format === "excel" ? "xlsx" : format === "csv" ? "csv" : "pdf";
    const filename = `in-out-monthly-${format}-${Date.now()}.${ext}`;
    try {
      setExportingFormat(format);
      const params = new URLSearchParams({ format });
      Object.entries(getReportFiltersForExport()).forEach(([key, value]) => {
        const v = value == null ? "" : String(value).trim();
        if (v !== "") params.set(key, v);
      });
      const qs = params.toString();
      const exportUrl = `${REPORT_URL}/export`;
      const { data } = await axios.get(qs ? `${exportUrl}?${qs}` : exportUrl, {
        responseType: "blob",
      });
      triggerFileDownload(data, filename);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportingFormat(null);
    }
  };

  useEffect(() => {
    if (!tableRef.current) return;

    if (datatableRef.current) {
      datatableRef.current.destroy(true);
      datatableRef.current = null;
    }

    const columns = buildColumns();

    datatableRef.current = $(tableRef.current).DataTable({
      pageLength: 10,
      processing: true,
      serverSide: true,
      destroy: true,
      scrollX: true,
      order: [[0, "asc"]],
      ajax: {
        url: REPORT_URL,
        type: "GET",
        data: (d) => {
          d.filter = {
            month: monthFilterRef.current.trim(),
            className: classFilterRef.current.trim(),
            batchId: batchFilterRef.current.trim(),
            divisionId: divisionFilterRef.current.trim(),
          };
        },
        dataSrc: (json) => {
          const rows = json?.data ?? [];
          const dates = monthDatesRef.current;
          return rows.map((row) => flattenMonthlyRow(row, dates));
        },
      },
      columns,
      columnDefs: [{ targets: "_all", className: "align-middle" }],
    });

    return () => {
      if (datatableRef.current) {
        datatableRef.current.destroy(true);
        datatableRef.current = null;
      }
    };
  }, [buildColumns, monthDates.length, monthFilter]);

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
                Month
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:calendar-bold-duotone" width="18" />
                </span>
                <input
                  className="form-control"
                  type="month"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
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
                  onChange={(e) => setBatchFilter(e.target.value)}
                >
                  <option value="">Select Batch</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.academic_year}
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
                  onChange={(e) => setClassFilter(e.target.value)}
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
                  onChange={(e) => setDivisionFilter(e.target.value)}
                >
                  <option value="">Select Division</option>
                  {divisions.map((d) => (
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
                disabled={!!exportingFormat}
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
                disabled={!!exportingFormat}
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
                disabled={!!exportingFormat}
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
          <div className="report-table-wrap monthly-report-table-wrap">
            <table
              className="table report-table mb-0"
              id="inOutMonthlyDataTable"
              ref={tableRef}
            />
          </div>
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
        .in-out-monthly-report .dataTables_wrapper {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default InAndOutMonthlyReportPage;
