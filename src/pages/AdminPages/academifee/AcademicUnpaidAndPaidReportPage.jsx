import React from "react";
import AcademicUnpaidAndPaidDataTable from "../../../components/AcademicUnpaidAndPaidDataTable";
import baseURL from "../../../utils/baseUrl";

/** If `{month}_due` is 0 → show "Paid"; else show `{month}_paid` (not total). */
function monthPaidOrPaidLabel(monthKey) {
  return function (data, type, row) {
    const dueRaw = row?.[`${monthKey}_due`];
    const paidRaw = row?.[`${monthKey}_paid`];
    const due =
      dueRaw === "" || dueRaw == null ? NaN : Number(dueRaw);
    const paidNum =
      paidRaw === "" || paidRaw == null ? NaN : Number(paidRaw);

    if (type === "sort" || type === "type" || type === "filter") {
      if (Number.isFinite(due) && due === 0) return 0;
      return Number.isFinite(paidNum) ? paidNum : 0;
    }
    if (Number.isFinite(due) && due === 0) return "Paid";
    return paidRaw ?? "";
  };
}

const MONTH_LABELS = [
  ["jan", "January"],
  ["feb", "February"],
  ["mar", "March"],
  ["apr", "April"],
  ["may", "May"],
  ["jun", "June"],
  ["jul", "July"],
  ["aug", "August"],
  ["sep", "September"],
  ["oct", "October"],
  ["nov", "November"],
  ["dec", "December"],
];

const feeReportColumns = [
  { data: "first_name", title: "Student Name", defaultContent: "" },
  { data: "fee_head_name", title: "Fee Head", defaultContent: "" },
  ...MONTH_LABELS.map(([key, title]) => ({
    data: null,
    title,
    defaultContent: "",
    render: monthPaidOrPaidLabel(key),
  })),
];

const AcademicUnpaidAndPaidReportPage = () => {
  return (
    <div>
      <AcademicUnpaidAndPaidDataTable url={`${baseURL}/api/fee-record-monthly/latest-by-table`} columns={feeReportColumns} />
    </div>
  );
};

export default AcademicUnpaidAndPaidReportPage;
