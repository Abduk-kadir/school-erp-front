import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import baseURL from "../utils/baseUrl";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../assets/css/mastercom.css";
import "../assets/css/academicOfflineFeeReport.css";
import DocumentViewer from "./child/DocumentViewer";
import { downloadFile } from "../utils/downloadFile";

const buildFileUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${baseURL}${path}`;
};

const AllTypeNotficationDataTable = ({ url, columns }) => {
  const tableRef = useRef(null);
  const datatableRef = useRef(null);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [batches, setBatches] = useState([]);

  const [classFilter, setClassFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [viewUrl, setViewUrl] = useState(null);

  const classFilterRef = useRef("");
  const fromDateRef = useRef("");
  const toDateRef = useRef("");
  const batchFilterRef = useRef("");
  const divisionFilterRef = useRef("");
  const setViewUrlRef = useRef(setViewUrl);

  useEffect(() => {
    setViewUrlRef.current = setViewUrl;
  }, []);

  useEffect(() => {
    classFilterRef.current = classFilter;
  }, [classFilter]);

  useEffect(() => {
    fromDateRef.current = fromDate;
  }, [fromDate]);

  useEffect(() => {
    toDateRef.current = toDate;
  }, [toDate]);

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

  const handleFilter = () => {
    if (datatableRef.current) {
      datatableRef.current.draw();
    }
  };

  useEffect(() => {
    if (!tableRef.current) return;

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
            fromDate: fromDateRef.current.trim(),
            toDate: toDateRef.current.trim(),
            batchId: batchFilterRef.current.trim(),
            divisionId: divisionFilterRef.current.trim(),
          };
        },
      },
      columns,
      createdRow: function (row, data) {
        const documentUrl =
          data?.diary_url ||
          data?.notes_url ||
          data?.assignment_url ||
          data?.timetable_url ||
          data?.document_url ||
          "";

        $(row).find(".table-action-view-document").on("click", function () {
          if (!documentUrl) return;
          setViewUrlRef.current(buildFileUrl(documentUrl));
        });

        $(row).find(".table-action-download-document").on("click", async function () {
          if (!documentUrl) return;
          try {
            await downloadFile(documentUrl);
          } catch (err) {
            console.error("Download failed:", err);
          }
        });
      },

      headerCallback: function (thead) {
        $(thead).find("th").css("white-space", "nowrap");
      },

    });

    return () => {
      if (datatableRef.current) {
        datatableRef.current.destroy(true);
      }
    };
  }, [url, columns]);

  return (
    <div className="fee-report-scope d-flex flex-column gap-4 pb-2">
      <div className="chfi-wrapper">
        <section className="chfi-card" aria-label="Report filters">
          <div className="card-header">
            <div className="header-row">
              <span className="header-icon">
                <Icon icon="solar:filter-bold-duotone" width="22" />
              </span>
              <div>
                <h5 className="card-title">Filter notification report</h5>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="report-filter-grid">
              <div className="report-filter-field">
                <label className="form-label">
                  <span className="label-dot" />
                  From date
                </label>
                <div className="icon-field">
                  <span className="icon">
                    <Icon icon="solar:calendar-bold-duotone" width="18" />
                  </span>
                  <input
                    className="form-control"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="report-filter-field">
                <label className="form-label">
                  <span className="label-dot" />
                  To date
                </label>
                <div className="icon-field">
                  <span className="icon">
                    <Icon icon="solar:calendar-bold-duotone" width="18" />
                  </span>
                  <input
                    className="form-control"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
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
                    <option value="">Select batch</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batch_name ?? b.academic_year}
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
                    <option value="">Select class</option>
                    {classes.map((elem) => (
                      <option key={elem?.id} value={elem?.id ?? elem?.class_name}>
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
                    <option value="">Select division</option>
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
                  Apply filters
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        className="card fee-report-card fee-report-table-card basic-data-table border-0 mb-0"
        aria-label="Notification report data"
      >
        <div className="card-header border-0 bg-dark py-3 px-4">
          <div className="d-flex align-items-center gap-3 min-w-0">
            <span className="fee-report-icon-wrap bg-white bg-opacity-10 text-white border border-white border-opacity-25">
              <Icon icon="solar:document-text-bold-duotone" className="fs-4" />
            </span>
            <div className="min-w-0">
              <h6 className="card-title mb-0 fw-semibold text-white text-truncate">
                Notification report
              </h6>
            </div>
          </div>
        </div>
        <div className="card-body px-3 px-md-4 pb-4">
          <div
            className="table-responsive shadow-sm rounded-3 border"
            style={{ overflowY: "hidden", overflowX: "auto" }}
          >
            <table
              className="table bordered-table mb-0"
              id="dataTable"
              ref={tableRef}
            />
          </div>
        </div>
      </section>
      <DocumentViewer
        url={viewUrl}
        show={!!viewUrl}
        onClose={() => setViewUrl(null)}
      />
    </div>
  );
};

export default AllTypeNotficationDataTable;
