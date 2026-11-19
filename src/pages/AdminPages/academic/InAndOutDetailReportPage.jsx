import React from "react";
import InAndOutDataTable from "../../../components/InAndOutDataTable";
import baseURL from "../../../utils/baseUrl";

/** Convert HH:mm:ss / HH:mm to 12-hour format (e.g. 02:30 PM). */
const formatTime12Hour = (value) => {
  if (!value || value === "00:00:00") return "-";
  const raw = String(value).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return raw || "-";

  let hours = Number(match[1]);
  const minutes = match[2];
  if (Number.isNaN(hours)) return raw || "-";

  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${suffix}`;
};

const feeReportColumns = [
  { data: "reg_no", title: "Reg No", defaultContent: "" },
  { data: "name", title: "Name", defaultContent: "" },
  { data: "class", title: "Class", defaultContent: "" },
  { data: "div", title: "Division", defaultContent: "" },
  { data: "roll_no", title: "Roll No", defaultContent: "" },
  {
    data: "date",
    title: "Date",
    defaultContent: "",
  },
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
  {
    data: "in_time",
    title: "In Time",
    defaultContent: "",
    render: (data, type) => {
      if (type !== "display" && type !== "filter") return data;
      return formatTime12Hour(data);
    },
  },
  {
    data: "out_time",
    title: "Out Time",
    defaultContent: "",
    render: (data, type) => {
      if (type !== "display" && type !== "filter") return data;
      return formatTime12Hour(data);
    },
  },
];

const InAndOutDetailReportPage = () => {
  return (
    <div>
      <InAndOutDataTable 
      url={`${baseURL}/api/in-out-attendance/reports/detail`} 
      columns={feeReportColumns}
      pdfUrl={`${baseURL}/api/in-out-attendance/reports/detail/pdf`}
      excelUrl={`${baseURL}/api/in-out-attendance/reports/detail/excel`}
       />
    </div>
  );
};

export default InAndOutDetailReportPage;
