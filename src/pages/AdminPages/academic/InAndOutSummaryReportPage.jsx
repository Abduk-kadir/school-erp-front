import React from "react";
import InAndOutSummaryDataTable from "../../../components/InAndOutSummaryDataTable";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/editdelete.css";

const feeReportColumns = [
  { data: "class", title: "Class", defaultContent: "" },
  { data: "div", title: "Division", defaultContent: "" },
  { data: "total_student", title: "Total Students", defaultContent: "" },
  { data: "present_count", title: "Total Present", defaultContent: "" },
  { data: "absent_count", title: "Total Absent", defaultContent: "" },
  {
    data: null,
    title: "Actions",
    orderable: false,
    searchable: false,
    render: (data, type, row) => {
      if (type !== "display") return "";
      return `
        <div class="table-action-group">
          <button
            type="button"
            class="table-action-btn table-action-show-students"
            data-class_id="${row?.class_id ?? ""}"
            data-division_id="${row?.division_id ?? ""}"
            title="Show Students"
          >
            Show Students
          </button>
        </div>
      `;
    },
  },

];

const InAndOutSummaryReportPage = () => {
  return (
    <div>
      <InAndOutSummaryDataTable url={`${baseURL}/api/in-out-attendance/reports/summary`} columns={feeReportColumns} />
    </div>
  );
};

export default InAndOutSummaryReportPage;
