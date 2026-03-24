import React from "react";
import AcademicSummaryFeeReportDataTable from "../../../components/AcademicSummaryFeeReportDataTable";
import baseURL from "../../../utils/baseUrl";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const feeReportColumns = [
  {
    data: "class_name",
    title: "Class Name",
    defaultContent: "",
    className: "text-nowrap",
    render: function (data, type) {
      const plain =
        data != null && String(data).trim() !== "" ? String(data).trim() : "";
      if (type === "sort" || type === "type") return plain;
      if (!plain) return "—";
      return `<span class="badge rounded-pill text-bg-primary px-3 py-2">${escapeHtml(plain)}</span>`;
    },
  },
  {
    data:"balance",
    title:"Total Fee to be collected",
    defaultContent:""
  },
  {
    data:"total_paid",
    title:"Total Fee Collected",
    defaultContent:""
  },
  {
    data:"balance",
    title:"Total Fee Pending",
    defaultContent:""
  },
  {
    data:"total_students",
   title:"Total Number of Students",
   defaultContent:""
  },
  {
    data:"full_payment_students",
    title:"Full Paid Students",
    defaultContent:""
  },
  {
    data:"partial_payment_students",
    title:"Partial Paid Students",
    defaultContent:""
  }


];

const AcademicSummaryFeeReportPage = () => {
  return (
    <div>
      <AcademicSummaryFeeReportDataTable url={`${baseURL}/api/fees/summary`} columns={feeReportColumns} />
    </div>
  );
};

export default AcademicSummaryFeeReportPage;
