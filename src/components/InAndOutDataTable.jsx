import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import baseURL from "../utils/baseUrl";
import { useDispatch } from "react-redux";
import { useNavigate,useSearchParams  } from "react-router-dom";

import { setStaffId } from "../redux/slices/dynamicForm/editByStaffSlice";
import { getPersonalInformationForm } from '../redux/slices/dynamicForm/personalInfoFormSlice';
import { setRegistrationNo } from "../redux/slices/registrationNo";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../assets/css/academicOfflineFeeReport.css";


const InAndOutDataTable = ({
  url,
  columns,
  loadingFun,
  exportBaseUrl,
}) => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("class_id");
  const divisionId = searchParams.get("division_id");
  const tableRef = useRef(null);
  const datatableRef = useRef(null);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [batches, setBatches] = useState([]);

  // Controlled filter values (pre-fill from URL when opened from summary report)
  const [classFilter, setClassFilter] = useState(() => classId || "");
  const [dateFilter, setDateFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState(() => divisionId || "");

  const [exportingFormat, setExportingFormat] = useState(null);

  /**
   * Base path only (no query string). Params are added in handleExportDownload via
   * getReportFiltersForExport → URLSearchParams → axios.get(`${exportUrl}?${qs}`).
   */
  const getExportUrl = (format) => {
    if (exportBaseUrl) return exportBaseUrl;
    if (format === "excel") return `${baseURL}/api/fees/excel`;
    if (format === "csv") return `${baseURL}/api/fees/csv`;
    if (format === "pdf") return `${baseURL}/api/fees/pdf`;
    return `${String(url).replace(/\/$/, "")}/export`;
  };

  // Refs to hold current filter values for DataTable ajax
  const classFilterRef = useRef(classId || "");
  const dateFilterRef = useRef("");
  const batchFilterRef = useRef("");
  const divisionFilterRef = useRef(divisionId || "");

  // Update refs when state changes
  useEffect(() => {
    classFilterRef.current = classFilter;
  }, [classFilter]);

  useEffect(() => {
    dateFilterRef.current = dateFilter;
  }, [dateFilter]);

  useEffect(() => {
    batchFilterRef.current = batchFilter;
  }, [batchFilter]);

  useEffect(() => {
    divisionFilterRef.current = divisionFilter;
  }, [divisionFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2, res3] = await Promise.all([
          axios.get(`${baseURL}/api/batches`),     
        ]);
        setBatches(res1?.data?.data || []);
        
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/batches/${batchFilter}/relations`);
        setClasses(res?.data?.class || []);
        setDivisions(res?.data?.division || []);
        
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };
    fetchData();
  }, [batchFilter]);

  useEffect(() => {
    if (!classId || !divisionId) return;

    classFilterRef.current = classId;
    divisionFilterRef.current = divisionId;

    if (datatableRef.current) {
      datatableRef.current.draw();
    }
  }, [classId, divisionId]);




  const handleFilter = () => {
    if (datatableRef.current) {
      datatableRef.current.draw();
    }
  };

  const getReportFiltersForExport = () => ({
    className: classFilterRef.current.trim(),
    date: dateFilterRef.current.trim(),
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
    const filename = `fee-report-${format}-${Date.now()}.${ext}`;
    try {
      setExportingFormat(format);
      if (typeof loadingFun === "function") loadingFun(true);
      const filters = getReportFiltersForExport();
      const dedicated =
        !exportBaseUrl &&
        (format === "excel" || format === "csv" || format === "pdf");
      const params = new URLSearchParams();
      if (!dedicated) params.set("format", format);
      Object.entries(filters).forEach(([key, value]) => {
        const v = value == null ? "" : String(value).trim();
        if (v !== "") params.set(key, v);
      });
      const qs = params.toString();
      const exportUrl = getExportUrl(format);
      const { data } = await axios.get(qs ? `${exportUrl}?${qs}` : exportUrl, {
        responseType: "blob",
      });
      triggerFileDownload(data, filename);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportingFormat(null);
      if (typeof loadingFun === "function") loadingFun(false);
    }
  };

  

  




  useEffect(() => {
    if (!tableRef.current) return;

    // Apply URL filters before first ajax (search-params effect may run before table exists)
    if (classId && divisionId) {
      classFilterRef.current = classId;
      divisionFilterRef.current = divisionId;
    }

    datatableRef.current = $(tableRef.current).DataTable({
      pageLength: 10,
      processing: true,
      serverSide: true,
      destroy: true,

      ajax: {
        url,
        type: "GET",
        data: (d) => {
          d.filter = {
            className: classFilterRef.current.trim(),
            date: dateFilterRef.current.trim(),
            batchId: batchFilterRef.current.trim(),
            divisionId: divisionFilterRef.current.trim(),
          };
        },
      },
      columns,
     
    
    });

    return () => {
      if (datatableRef.current) {
        datatableRef.current.destroy(true);
      }
    };
  }, [url, columns]); // Important: do NOT put filter state here — refs are used for ajax

  return (
    <div className="chfi-wrapper d-flex flex-column gap-3 pb-2">
      {/* ---------- Filter card ---------- */}
     {!classId && !divisionId && <section className="chfi-card" aria-label="Report filters">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:filter-bold-duotone" width="22" />
            </span>
            <div>
              <h5 className="card-title">Filter</h5>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="report-filter-grid">
            <div className="report-filter-field">
              <label className="form-label">
                <span className="label-dot" />
                Date
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:calendar-bold-duotone" width="18" />
                </span>
                <input
                  className="form-control"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
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
                className="btn-submit chfi-root"
                onClick={handleFilter}
              >
                <Icon icon="solar:magnifer-bold-duotone" width="18" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </section>
     }

      {/* ---------- Table card ---------- */}
      <section className="chfi-card report-table-card" aria-label="Report data">
        <div className="card-header">
          <div className="header-row report-header-row">
            <div className="header-row" style={{ gap: 8, minWidth: 0 }}>
              <span className="header-icon">
                <Icon icon="solar:document-text-bold-duotone" width="22" />
              </span>
              <div className="min-w-0">
                <h5 className="card-title">In / Out Detail Report</h5>
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
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
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
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
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
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                ) : (
                  <Icon icon="vscode-icons:file-type-pdf2" width="18" />
                )}
                PDF
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="report-table-wrap">
            <table
              className="table report-table mb-0"
              id="dataTable"
              ref={tableRef}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default InAndOutDataTable;