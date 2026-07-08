import React from "react";
import InAndOutDataTable from "../../../components/InAndOutDataTable";
import baseURL from "../../../utils/baseUrl";

const feeReportColumns = [
  { data: "reg_no", title: "Reg No", defaultContent: "" },
  { data: "name", title: "Name", defaultContent: "" },
  { data: "class", title: "Class", defaultContent: "" },
  { data: "div", title: "Division", defaultContent: "" },
  { data: "roll_no", title: "Roll No", defaultContent: "" },
  { data: "date", title: "Date", defaultContent: "" },
  {
    title: "Status",
    data: "in_time",
    render: function (data, type) {
      const isAbsent = !data || data === "00:00:00";
      if (type === "display") {
        return isAbsent
          ? '<span class="attendance-status attendance-status--absent">Absent</span>'
          : '<span class="attendance-status attendance-status--present">Present</span>';
      }
      return isAbsent ? "Absent" : "Present";
    },
  },
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
