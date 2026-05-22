import React from "react";
import InAndOutSummaryDataTable from "../../../components/InAndOutSummaryDataTable";
import baseURL from "../../../utils/baseUrl";


const feeReportColumns = [
  { data: "class", title: "Class", defaultContent: "" },
  { data: "div", title: "Division", defaultContent: "" },
  { data: "total_student", title: "Total Students", defaultContent: "" },
  { data: "present_count", title: "Total Present", defaultContent: "" },
  { data: "absent_count", title: "Total Absent", defaultContent: "" },
  
];

const InAndOutSummaryReportPage = () => {
  return (
    <div>
      <InAndOutSummaryDataTable url={`${baseURL}/api/in-out-attendance/reports/summary`} columns={feeReportColumns} />
    </div>
  );
};

export default InAndOutSummaryReportPage;
