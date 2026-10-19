import React from "react";
import StaffInAndOutDataTable from "../../../components/StaffInAndOutDataTable";
import baseURL from "../../../utils/baseUrl";

const feeReportColumns = [
  { data: "staff_id", title: "Staff ID", defaultContent: "" },
  { data: "name", title: "Name", defaultContent: "" },
  { data: "department", title: "Department", defaultContent: "" },
  { data: "designation", title: "Designation", defaultContent: "" },
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

const StaffInAndOutPage = () => {
  return (
    <div>
      <StaffInAndOutDataTable 
      url={`${baseURL}/api/staff-in-out-attendance/reports/detail`} 
      columns={feeReportColumns}
      pdfUrl={`${baseURL}/api/staff-in-out-attendance/reports/detail/pdf`}
      excelUrl={`${baseURL}/api/staff-in-out-attendance/reports/detail/excel`}
       />
    </div>
  );
};

export default StaffInAndOutPage;
