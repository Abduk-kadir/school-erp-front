import React from "react";
import AcadmicOfflineFeeReportDataTable from "../../../components/AcadmicOfflineFeeReportDataTable";
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

const feeReportColumns = [
  { data: "reg_no", title: "Reg No", defaultContent: "" },
  { data: "client_txt_id", title: "Client Text Id", defaultContent: "" },
  {
    data: null,
    title: "Name",
    defaultContent: "",
    render: function (_data, type, row) {
      const fn = flat(row, "PeronalInformation.first_name");
      const ln = flat(row, "PeronalInformation.last_name");
      const full = [fn, ln].filter((v) => v != null && String(v).trim() !== "").join(" ").trim();
      if (type === "sort" || type === "type") return full;
      return full || "—";
    },
  },
  {
    data: null,
    title: "Class | Division | Roll No",
    defaultContent: "",
    orderable: false,
    render: function (_data, type, row) {
      const cls =
        flat(row, "PeronalInformation.classInfo.class_name") ||
        flat(row, "PeronalInformation.class") ||
        "";
      const div = flat(row, "PeronalInformation.division") ?? row?.division_name ?? "";
      const roll =
        flat(row, "PeronalInformation.roll_no") ?? row?.roll_no ?? row?.roll_number ?? "";
      const plain = [cls, div, roll]
        .filter((v) => v != null && String(v).trim() !== "")
        .join(" | ");
      if (type === "sort" || type === "type") return plain;

      const chips = [];
      if (String(cls).trim() !== "") {
        chips.push(
          `<span class="badge rounded-pill text-bg-primary me-1">${escapeHtml(cls)}</span>`
        );
      }
      if (String(div).trim() !== "") {
        chips.push(
          `<span class="badge rounded-pill text-bg-success me-1">${escapeHtml(div)}</span>`
        );
      }
      if (String(roll).trim() !== "") {
        chips.push(
          `<span class="badge rounded-pill text-bg-warning text-dark">${escapeHtml(roll)}</span>`
        );
      }
      if (!chips.length) return "—";
      return `<span class="d-inline-flex flex-wrap align-items-center gap-1">${chips.join("")}</span>`;
    },
  },

  { data: "reciept_no", title: "Receipt No", defaultContent: "" },
  { data: "transaction_no", title: "Transaction No", defaultContent: "" },
  { data: "failure_message", title: "Failure Message", defaultContent: "" },
  { data: "card_name", title: "Card", defaultContent: "" },
  { data: "payment_mode", title: "Payment Mode", defaultContent: "" },
  { data: "added_by", title: "Added By", defaultContent: "" },
  { data: "role_id", title: "Role ID", defaultContent: "" },
  { data: "fine", title: "Fine", defaultContent: "" },
  { data: "consession", title: "Concession", defaultContent: "" },
  { data: "discount_type_id", title: "Discount Type", defaultContent: "" },
  { data: "total", title: "Total", defaultContent: "" },
  { data: "payment", title: "Payment", defaultContent: "" },
  { data: "balance", title: "Balance", defaultContent: "" },
  { data: "remark", title: "Remark", defaultContent: "" },
  { data: "payment_type", title: "Payment Type", defaultContent: "" },
  { data: "dd_number", title: "DD No.", defaultContent: "" },
  { data: "dd_date", title: "DD Date", defaultContent: "" },
  { data: "check_no", title: "Cheque No.", defaultContent: "" },
  { data: "ref_no", title: "Ref No.", defaultContent: "" },
  { data: "check_date", title: "Cheque Date", defaultContent: "" },
  { data: "check_name", title: "Cheque Name", defaultContent: "" },
  { data: "bank_id", title: "Bank ID", defaultContent: "" },
  { data: "start_month", title: "Start Month", defaultContent: "" },
  { data: "paid_and_unpai_month", title: "Paid / Unpaid Months", defaultContent: "" },
  { data: "extra_fee", title: "Extra Fee", defaultContent: "" },
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
  { data: "split_flag", title: "Split", defaultContent: "" },
  {
    data: "raw_data",
    title: "Raw Data",
    defaultContent: "",
    render: function (data, type) {
      if (data == null || data === "") return "";
      if (type === "sort" || type === "type") return typeof data === "string" ? data : JSON.stringify(data);
      const str = typeof data === "string" ? data : JSON.stringify(data);
      return str.length > 120 ? `${str.slice(0, 120)}…` : str;
    },
  },
  { data: "installment", title: "Installment", defaultContent: "" },
  { data: "split_response", title: "Split Response", defaultContent: "" },
];

const AcademicOfflineFeeReportPage = () => {
  return (
    <div>
      <AcadmicOfflineFeeReportDataTable url={`${baseURL}/api/fees`} columns={feeReportColumns} />
    </div>
  );
};

export default AcademicOfflineFeeReportPage;
