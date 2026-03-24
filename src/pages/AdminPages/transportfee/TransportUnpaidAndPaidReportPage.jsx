import React from "react";
import AcademicUnpaidAndPaidDataTable from "../../../components/AcademicUnpaidAndPaidDataTable";
import baseURL from "../../../utils/baseUrl";

const feeReportColumns = [
  { data: "reg_no", title: "Reg No", defaultContent: "" },
  { data: "student_name", title: "Student Name", defaultContent: "" },
  { data: "class_division_roll", title: "Class|Division|Roll NO", defaultContent: "" },
  { data: "total_amount", title: "Total Amount", defaultContent: "" },
  { data: "collected_amount", title: "Collected Amount", defaultContent: "" },
  { data: "due_amount", title: "Due Amount", defaultContent: "" },
  { data: "concession", title: "Concession", defaultContent: "" },
  { data: "extra_amount", title: "Extra Amount", defaultContent: "" },
  { data: "role_id", title: "Role ID", defaultContent: "" },
  {
    data: "date",
    title: "Date",
    defaultContent: "",
    render: function (data, type) {
      if (data == null || data === "") return "";
      if (type === "sort" || type === "type") return data;
      try {
        return new Date(data).toLocaleString();
      } catch {
        return String(data);
      }
    },
  },
  { data: null, title: "Action", defaultContent: "", orderable: false },
];

const TransportUnpaidAndPaidReportPage = () => {
  return (
    <div>
      <AcademicUnpaidAndPaidDataTable url={`${baseURL}/api/fees`} columns={feeReportColumns} />
    </div>
  );
};

export default TransportUnpaidAndPaidReportPage;
