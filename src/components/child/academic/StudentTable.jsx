import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/academicOfflineFeeReport.css";

const StudentTable = ({ url, columns, onEdit }) => {
  const tableRef = useRef(null);
  const datatableRef = useRef(null);
  const callbacksRef = useRef({ onEdit });

  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const [classFilter, setClassFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");

  const classFilterRef = useRef("");
  const divisionFilterRef = useRef("");
  const programFilterRef = useRef("");

  useEffect(() => {
    callbacksRef.current = { onEdit };
  }, [onEdit]);

  useEffect(() => {
    classFilterRef.current = classFilter;
  }, [classFilter]);

  useEffect(() => {
    divisionFilterRef.current = divisionFilter;
  }, [divisionFilter]);

  useEffect(() => {
    programFilterRef.current = programFilter;
  }, [programFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/divisions`),
        ]);
        setClasses(res1?.data?.data || []);
        setDivisions(res2?.data?.data || []);
      } catch (err) {
        console.error("Failed to load classes/divisions", err);
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

    const $table = $(tableRef.current);

    datatableRef.current = $table.DataTable({
      pageLength: 5,
      processing: true,
      serverSide: true,
      destroy: true,
      ajax: {
        url,
        type: "GET",
        data: (d) => {
          d.filter = {
            className: classFilterRef.current.trim(),
            regNo: programFilterRef.current.trim(),
            divisionName: divisionFilterRef.current.trim(),
          };
        },
      },
      columns,
      headerCallback: function (thead) {
        $(thead).find("th").css("white-space", "nowrap");
      },
    });

    $table.on("click", ".table-action-change-detail", function () {
      const tr = $(this).closest("tr");
      const rowData = datatableRef.current.row(tr).data(); // full API row object
      callbacksRef.current.onEdit?.(rowData);
    });

    return () => {
      $table.off("click", ".table-action-change-detail");
      if (datatableRef.current) {
        // Keep the <table> node so React can remount cleanly next time
        datatableRef.current.destroy();
        datatableRef.current = null;
      }
    };
  }, [url, columns]);

  return (
    <div className="chfi-wrapper d-flex flex-column gap-3 pb-2">
      <section className="chfi-card" aria-label="Student filters">
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
                Reg No
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:card-bold-duotone" width="18" />
                </span>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter reg no"
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                />
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
                  aria-label="Select class"
                >
                  <option value="">Select Class</option>
                  {classes.map((elem, index) => (
                    <option key={index} value={elem?.id || elem?.class_name}>
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
                  <Icon icon="solar:users-group-rounded-bold-duotone" width="18" />
                </span>
                <select
                  className="form-select"
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                  aria-label="Select division"
                >
                  <option value="">Select Division</option>
                  {divisions.map((elem, index) => (
                    <option key={index} value={elem?.id || elem?.name}>
                      {elem?.division_name}
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
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="chfi-card report-table-card" aria-label="Student list">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:users-group-rounded-bold-duotone" width="22" />
            </span>
            <div>
              <h5 className="card-title">Student List</h5>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="report-table-wrap">
            <table
              className="table bordered-table mb-0"
              id="dataTable"
              ref={tableRef}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentTable;
