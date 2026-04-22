import React from "react";
import AcademicFineDataTable from "../../../components/AcademicFineDataTable";
import baseURL from "../../../utils/baseUrl";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** API returns flat keys like "PeronalInformation.first_name" — not nested objects */
const flat = (row, key) =>
  row?.[key] ?? row?.[key.replace("PeronalInformation", "PersonalInformation")];

const fineReportColumns = [
    {data:"id",title:"ID"},
    {data:"student.first_name",title:"First Name"},
    {data:"classInfo.class_name",title:"Class Name"},
    {data:"actualfineamount",title:"Actual Fine Amount"},
    {data:"assignedfineamount",title:"Assigned Fine Amount"},
    {data:"paidfineamount",title:"Paid Fine Amount"},
    {data:"reciept_no",title:"Receipt NO"},
   
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
 
];

const AcademicFinePage = () => {
  return (
    <div>
      <AcademicFineDataTable url={`${baseURL}/api/student-fines`} columns={fineReportColumns} />
    </div>
  );
};

export default AcademicFinePage;
