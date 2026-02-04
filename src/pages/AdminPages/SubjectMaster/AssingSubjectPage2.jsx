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
   // fetchClasses();
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
    

      {/* Top filter row */}
     

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
