import React from "react";
import InAndOutDataTable from "../../../components/InAndOutDataTable";
import baseURL from "../../../utils/baseUrl";


const feeReportColumns = [
  { data: "reg_no", title: "Reg No", defaultContent: "" },
  { data: "name", title: "Name", defaultContent: "" },
  { data: "class", title: "Class", defaultContent: "" },
  { data: "division", title: "Division", defaultContent: "" },
  { data: "roll_no", title: "Roll No", defaultContent: "" },
  { data: "date", title: "Date", defaultContent: "" },
  { data: "in_time", title: "In Time", defaultContent: "" },
  { data: "out_time", title: "Out Time", defaultContent: "" },
  
];

const InAndOutDetailReportPage = () => {
  return (
    <div>
      <InAndOutDataTable url={`${baseURL}/api/in-out-attendance/reports/detail`} columns={feeReportColumns} />
    </div>
  );
};

export default InAndOutDetailReportPage;
