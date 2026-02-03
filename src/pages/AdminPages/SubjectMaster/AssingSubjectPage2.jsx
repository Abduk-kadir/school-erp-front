import GenericTableAssignSubject from "../../../components/GenericTableAssinSubject";
import AssignSubject from "../../../components/child/subjectMaster/AssignSubject";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";

import { useState, useEffect, useRef } from "react";

const AssignSubjectPage2 = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [search, setSearch] = useState("");
  const tableRef = useRef(null); // to store DataTable instance

  // Fetch classes for the dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      const res = await axios.get(`${baseURL}/api/classes`);
      setClasses(res.data?.data || []);
    };
    fetchClasses();
  }, []);

  // Reload DataTable whenever selectedClass or search changes
  const handleSubmit = () => {
    const table = $("#dataTable").DataTable();
    table.ajax.reload();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    const table = $("#dataTable").DataTable();
    table.ajax.reload();
  };

  return (
    <>
      <AssignSubject />

      {/* Top filter row */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        {/* Left side: Select + Submit */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <h6 className="mb-0">Select Class:</h6>
          <select
            className="form-select form-select-sm w-auto"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select class</option>
            {classes.map((elem, idx) => (
              <option key={idx} value={elem.class_name}>
                {elem.class_name}
              </option>
            ))}
          </select>
          <button className="btn btn-success" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        {/* Right side: Search input */}
        <div style={{ minWidth: "250px" }}>
          <input
            className="form-control py-2"
            type="text"
            placeholder="Search by program or semester"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* DataTable */}
      <GenericTableAssignSubject
        ref={tableRef}
        url={`${baseURL}/api/program-subjects/byclasssemester`}
        columns={[
          { data: "batch", title: "Batch" },
          { data: "className", title: "Class Name" },
          { data: "programName", title: "Program Name" },

          // Compulsory Subjects
          {
            data: "compulsorySubjects",
            title: "Compulsory Subjects",
            render: function (data) {
              if (!data || data.length === 0) return "";
              return data.map((s) => s.subjectName).join(", ");
            },
          },

          // Optional Subjects (nested)
          {
            data: "optionalSubjects",
            title: "Optional Subjects",
            render: function (data) {
              if (!data || data.length === 0) return "";
              let names = [];
              data.forEach((basket) => {
                basket.subjects?.forEach((s) => names.push(s.subjectName));
              });
              return names.join(", ");
            },
          },
        ]}
        extraParams={{
          selectedClass,
          search,
        }}
      />
    </>
  );
};

export default AssignSubjectPage2;
