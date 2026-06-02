import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import baseURL from "../utils/baseUrl";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../assets/css/academicOfflineFeeReport.css";

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

  const classFilterRef = useRef("");
  const fromDateRef = useRef("");
  const toDateRef = useRef("");
  const batchFilterRef = useRef("");
  const divisionFilterRef = useRef("");

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
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/divisions`),
          axios.get(`${baseURL}/api/batches`),
        ]);
        setClasses(res1?.data?.data || []);
        setDivisions(res2?.data?.data || []);
        setBatches(res3?.data?.data || res3?.data || []);
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    };
    fetchData();
  }, []);

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
      <section
        className="card fee-report-card border-0 mb-0"
        aria-label="Report filters"
      >
        <div className="card-header border-0 bg-success bg-opacity-10 py-3 px-4">
          <div className="d-flex align-items-center gap-3">
            <span className="fee-report-icon-wrap bg-success text-white shadow-sm">
              <Icon icon="solar:filter-bold-duotone" className="fs-4" />
            </span>
            <div>
              <h6 className="card-title mb-0 fw-semibold text-dark">
                Filter notification report
              </h6>
              <p className="small text-muted mb-0 mt-1">
                Narrow results, then apply to refresh the table
              </p>
            </div>
          </div>
        </div>
        <div className="card-body px-4 pb-4 pt-3">
          <div className="row g-3 g-lg-4 align-items-end">
            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                From date
              </label>
              <input
                className="form-control rounded-3"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                To date
              </label>
              <input
                className="form-control rounded-3"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                Batch
              </label>
              <select
                className="form-select rounded-3"
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
            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                Class
              </label>
              <select
                className="form-select rounded-3"
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
            <div className="col-md-6 col-lg-3">
              <label className="form-label small fw-semibold text-secondary mb-1">
                Division
              </label>
              <select
                className="form-select rounded-3"
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

            <div className="col-md-6 col-lg-3 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-success rounded-pill px-4 w-100 d-inline-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={handleFilter}
              >
                <Icon icon="solar:magnifer-bold" className="fs-5" />
                Apply filters
              </button>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default AllTypeNotficationDataTable;
