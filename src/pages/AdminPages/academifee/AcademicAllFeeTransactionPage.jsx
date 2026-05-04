import React from "react";
import AcademicAllTransactionReportDataTable from "../../../components/AcademicAllTransactionReportDataTable";
import baseURL from "../../../utils/baseUrl";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const feeReportColumns = [
  { data: "reg_no", title: "Reg No", defaultContent: "" },
  { data: "client_txt_id", title: "Client Text Id", defaultContent: "" },
  { data: "first_name", title: "Name", defaultContent: "" },
  { data: "className", title: "Class", defaultContent: "" },

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

const AcademicAllFeeTransactionPage = () => {
  return (
    <div>
      <AcademicAllTransactionReportDataTable url={`${baseURL}/api/fees`} columns={feeReportColumns} />
    </div>
  );
};

export default AcademicAllFeeTransactionPage;
