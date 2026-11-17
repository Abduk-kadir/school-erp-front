import axios from "axios";
import ExcelJS from "exceljs/dist/exceljs.min.js";
import baseURL from "./baseUrl";

const INFO_ROW_1 = 1;
const INFO_ROW_2 = 2;
const HEAD_ROW = 3;
const DATA_START_ROW = HEAD_ROW + 1;
const HEADER_FILL = "FFE8EEF9";
const GRADE_FILL = "FFF0FDF4";
const SHEET_NAME = "Marks";
const META_SHEET = "Meta";
const GRADES_SHEET = "Grades";
const TEMPLATE_VERSION = 1;

const FIXED_COLUMNS = [
  { key: "sr_no", title: "Sr No", width: 8, locked: true },
  { key: "reg_no", title: "Registration No", width: 18, locked: true },
  { key: "roll_no", title: "Roll No", width: 10, locked: true },
  { key: "seat_no", title: "Seat No", width: 10, locked: false },
  { key: "name", title: "Name", width: 34, locked: true, align: "left" },
];
const GRADE_COL = FIXED_COLUMNS.length + 1;
const LAST_COL = GRADE_COL;

const thinBorder = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeStudent = (row) => {
  if (!row) return null;
  const s = row.student && typeof row.student === "object" ? row.student : row;
  return {
    id: s.id ?? row.student_id ?? row.id,
    reg_no: s.reg_no ?? "",
    rollnumber: s.rollnumber ?? "",
    seat_no: s.seat_no ?? "",
    first_name: s.first_name,
    last_name: s.last_name,
    father_name: s.father_name,
    grade: String(row?.grade ?? s?.grade ?? "").trim(),
  };
};

const studentName = (student) =>
  [student?.first_name, student?.last_name, student?.father_name]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" ");

const studentFixedValues = (student, index) => ({
  sr_no: index + 1,
  reg_no: student?.reg_no ?? "",
  roll_no: student?.rollnumber ?? "",
  seat_no: student?.seat_no ?? "",
  name: studentName(student),
});

const safeName = (value) => String(value || "").trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "_");

/**
 * Build a co-scholastic Excel blob from the on-screen descriptor grade table.
 * Same Meta shape as downloadCoScholasticExcel so import-co-scholastic-marks accepts it.
 * Does not change or call downloadCoScholasticExcel.
 *
 * @param {object} row - Marks entry row
 * @param {Array} students - Students shown in the table
 * @param {object} configure - Exam configure (needs gradeScale.id)
 * @param {Record<string|number, string>} gradesByStudent - studentId -> grade
 * @param {string[]} [gradeOptions] - optional preloaded grades; fetched if omitted
 * @returns {Promise<{ fileName: string, blob: Blob, buffer: ArrayBuffer }>}
 */
export const buildCoScholasticExcelFromLiveMarkEntry = async (
  row,
  students = [],
  configure = null,
  gradesByStudent = {},
  gradeOptions = null
) => {
  if (!row?.exam_scheme_id || !row?.subject_id) {
    throw new Error("Exam scheme and subject are required to build the co-scholastic sheet");
  }

  const gradeScaleId = configure?.gradeScale?.id ?? configure?.grade_scale_id;
  if (!gradeScaleId) {
    throw new Error("Grade scale id is required to build the co-scholastic grade sheet");
  }

  let options = Array.isArray(gradeOptions) ? gradeOptions.filter(Boolean) : [];
  if (!options.length) {
    const { data: gradeScaleRes } = await axios.get(`${baseURL}/api/grade-scales/${gradeScaleId}`, {
      headers: authHeaders(),
    });
    options = (Array.isArray(gradeScaleRes?.data?.ranges) ? gradeScaleRes.data.ranges : [])
      .slice()
      .sort((a, b) => Number(a.sequence ?? 0) - Number(b.sequence ?? 0))
      .map((range) => String(range?.grade ?? "").trim())
      .filter(Boolean);
  }

  if (!options.length) {
    throw new Error("No grades found for this grade scale");
  }

  const studentList = (Array.isArray(students) ? students : []).map(normalizeStudent).filter(Boolean);
  if (!studentList.length) {
    throw new Error("No students available to build the co-scholastic sheet");
  }

  const examName = configure?.exam?.examNameInfo?.exam_name ?? row?.scheme?.examNameInfo?.exam_name;
  const termName = configure?.termInfo?.term_name ?? row?.scheme?.termInfo?.term_name;
  const className = configure?.classInfo?.class_name ?? row?.scheme?.classInfo?.class_name;
  const divisionName = row?.divisionInfo?.division_name;
  const subjectName = configure?.subjectInfo?.value ?? row?.subjectInfo?.value;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(SHEET_NAME);

  const gradesSheet = workbook.addWorksheet(GRADES_SHEET, { state: "veryHidden" });
  options.forEach((grade, index) => {
    gradesSheet.getCell(index + 1, 1).value = grade;
  });
  const gradeListFormula = `'${GRADES_SHEET}'!$A$1:$A$${options.length}`;

  const infoText = (pairs) =>
    pairs.map(([label, value]) => `${label}: ${value || "-"}`).join("     |     ");
  [
    { rowNo: INFO_ROW_1, text: infoText([["Exam", examName], ["Term", termName]]) },
    {
      rowNo: INFO_ROW_2,
      text: infoText([["Class", className], ["Division", divisionName], ["Subject", subjectName]]),
    },
  ].forEach(({ rowNo, text }) => {
    sheet.mergeCells(rowNo, 1, rowNo, LAST_COL);
    const cell = sheet.getCell(rowNo, 1);
    cell.value = text;
    cell.font = { bold: true, size: 12 };
    cell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    for (let c = 1; c <= LAST_COL; c += 1) {
      sheet.getCell(rowNo, c).border = { top: { style: "thin" }, bottom: { style: "thin" } };
    }
    sheet.getRow(rowNo).height = 22;
  });

  [...FIXED_COLUMNS.map((fixed) => fixed.title), "Grade"].forEach((title, index) => {
    const cell = sheet.getCell(HEAD_ROW, index + 1);
    cell.value = title;
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_FILL } };
    cell.border = thinBorder;
  });
  sheet.getRow(HEAD_ROW).height = 24;

  const studentRows = [];
  for (let r = DATA_START_ROW; r < DATA_START_ROW + studentList.length; r += 1) {
    const studentIndex = r - DATA_START_ROW;
    const student = studentList[studentIndex];
    const fixedValues = studentFixedValues(student, studentIndex);
    FIXED_COLUMNS.forEach((fixed, index) => {
      sheet.getCell(r, index + 1).value = fixedValues[fixed.key];
    });
    studentRows.push({ row: r, student_id: student.id });

    for (let c = 1; c <= LAST_COL; c += 1) {
      const cell = sheet.getCell(r, c);
      const fixed = FIXED_COLUMNS[c - 1];
      cell.border = thinBorder;
      cell.alignment = { horizontal: fixed?.align || "center", vertical: "middle" };
      cell.protection = { locked: Boolean(fixed?.locked) };
    }

    const gradeRaw =
      gradesByStudent[student.id] ??
      gradesByStudent[String(student.id)] ??
      student.grade ??
      "";
    const grade = String(gradeRaw ?? "").trim();
    const gradeCell = sheet.getCell(r, GRADE_COL);
    gradeCell.value = grade || "";
    gradeCell.font = { bold: true };
    gradeCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GRADE_FILL } };
    gradeCell.protection = { locked: false };
    gradeCell.dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [gradeListFormula],
      showErrorMessage: true,
      errorStyle: "stop",
      errorTitle: "Invalid grade",
      error: `Please select a grade from the list (${options.join(", ")}).`,
      showInputMessage: true,
      promptTitle: "Grade",
      prompt: `Select ${options.join(", ")}`,
    };
  }

  FIXED_COLUMNS.forEach((fixed, index) => {
    sheet.getColumn(index + 1).width = fixed.width;
  });
  sheet.getColumn(GRADE_COL).width = 12;
  sheet.views = [{ state: "frozen", xSplit: 0, ySplit: HEAD_ROW }];

  await sheet.protect("", {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatColumns: true,
    formatRows: true,
  });

  const meta = workbook.addWorksheet(META_SHEET, { state: "veryHidden" });
  [
    ["template_version", TEMPLATE_VERSION],
    ["sheet_type", "co_scholastic"],
    ["result_mark_entry_id", row.id ?? ""],
    ["exam_scheme_id", row.exam_scheme_id],
    ["subject_id", row.subject_id],
    ["division_id", row.division_id ?? row?.divisionInfo?.id ?? ""],
    ["term_id", configure?.term_id ?? row?.scheme?.term_id ?? ""],
    ["exam_configure_id", configure?.id ?? ""],
    ["grade_scale_id", gradeScaleId],
    ["data_start_row", DATA_START_ROW],
    ["fixed_columns", JSON.stringify(Object.fromEntries(FIXED_COLUMNS.map((f, i) => [f.key, i + 1])))],
    ["grade_col", GRADE_COL],
    ["grade_options", JSON.stringify(options)],
    ["students", JSON.stringify(studentRows)],
  ].forEach((entry) => meta.addRow(entry));

  const fileName = `${[examName, className, divisionName, subjectName, termName]
    .filter(Boolean)
    .map(safeName)
    .join("_") || "CoScholastic"}_CoScholastic.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return { fileName, blob, buffer };
};

export default buildCoScholasticExcelFromLiveMarkEntry;
