import axios from "axios";
import ExcelJS from "exceljs/dist/exceljs.min.js";
import baseURL from "./baseUrl";

const INFO_ROW_1 = 1;
const INFO_ROW_2 = 2;
const HEAD_ROW_1 = 3;
const HEAD_ROW_2 = 4;
const HEAD_ROW_3 = 5;
const HEADER_END = HEAD_ROW_3;
const DEFAULT_DATA_ROWS = 100;
const HEADER_FILL = "FFE8EEF9";
const FORMULA_FILL = "FFFFFBEB";
const MARKS_SHEET = "Marks";
const META_SHEET = "Meta";
const TEMPLATE_VERSION = 3;

// Student columns at the start of every row; `locked` cells come from the system
const FIXED_COLUMNS = [
  { key: "sr_no", title: "Sr No", width: 8, locked: true },
  { key: "reg_no", title: "Registration No", width: 18, locked: true },
  { key: "roll_no", title: "Roll No", width: 10, locked: true },
  { key: "seat_no", title: "Seat No", width: 10, locked: false },
  { key: "name", title: "Name", width: 34, locked: true, align: "left" },
];
const FIRST_MARK_COL = FIXED_COLUMNS.length + 1;

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


const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const groupAssessments = (assessments) => {
  const groups = [];
  (assessments || []).forEach((assessment) => {
    let group = groups.find((g) => g.id === assessment.group_id);
    if (!group) {
      group = { id: assessment.group_id, name: assessment?.groupInfo?.group, assessments: [] };
      groups.push(group);
    }
    group.assessments.push(assessment);
  });
  return groups;
};

const markColCount = (assessment) => assessment.components?.length || 1;
// Mark columns + "Total" + "Total Converted"
const colCount = (assessment) => markColCount(assessment) + 2;
const groupColCount = (group) => group.assessments.reduce((sum, a) => sum + colCount(a), 0);
const groupMax = (group) => group.assessments.reduce((sum, a) => sum + Number(a.max_marks || 0), 0);
const subHeadTotalMax = (assessment) =>
  assessment.components?.length
    ? assessment.components.reduce((sum, c) => sum + Number(c.max_marks || 0), 0)
    : Number(assessment.max_marks || 0);
const ratioOf = (assessment) => {
  const ratio = Number(assessment.ratio);
  return assessment.ratio != null && Number.isFinite(ratio) ? ratio : 1;
};

const safeName = (value) => String(value || "").trim().replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, "_");

const thinBorder = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

/**
 * Build and download an Excel sheet whose header matches the Add Marks page table,
 * with Total / Total Converted / group total / grand total formulas per student row.
 * @param {object} row - Marks entry row (needs exam_scheme_id and subject_id)
 * @param {Array<{ id: number, reg_no?: any, rollnumber?: any, first_name?: string, last_name?: string, father_name?: string }>} students
 *   Students to pre-fill; their mark cells start at 0. Without students a blank sheet of `dataRows` rows is created.
 * @param {{ dataRows?: number }} options
 * @returns {Promise<string>} downloaded file name
 */
export const downloadAddMarkExcel = async (row, students = [], { dataRows = DEFAULT_DATA_ROWS } = {}) => {
  if (!row?.exam_scheme_id || !row?.subject_id) {
    throw new Error("Exam scheme and subject are required to download the marks sheet");
  }
  const studentList = Array.isArray(students) ? students : [];
  const rowCount = studentList.length || dataRows;

  const { data } = await axios.get(
    `${baseURL}/api/exam-schemes/${row.exam_scheme_id}/assessment-and-components`,
    { params: { subject_id: row.subject_id }, headers: authHeaders() }
  );
  const scheme = data?.data?.scheme;
  const groups = groupAssessments(data?.data?.assessments);
  const grandMax = groups.reduce((sum, g) => sum + groupMax(g), 0);

  const workbook = new ExcelJS.Workbook();
  workbook.calcProperties.fullCalcOnLoad = true;
  const sheet = workbook.addWorksheet(MARKS_SHEET);
  const letter = (colNo) => sheet.getColumn(colNo).letter;

  const setHeader = (rowNo, colNo, value, toRow = rowNo, toCol = colNo) => {
    if (toRow !== rowNo || toCol !== colNo) sheet.mergeCells(rowNo, colNo, toRow, toCol);
    sheet.getCell(rowNo, colNo).value = value;
  };

  FIXED_COLUMNS.forEach((fixed, index) => setHeader(HEAD_ROW_1, index + 1, fixed.title, HEADER_END));

  // Column layout, used afterwards to write the formulas of every student row
  const layout = [];
  const formulaCols = [];
  const markColSet = new Set();

  let col = FIRST_MARK_COL;
  groups.forEach((group) => {
    setHeader(HEAD_ROW_1, col, `${group.name} Marks`, HEAD_ROW_1, col + groupColCount(group) - 1);
    const groupEntry = { groupId: group.id, heads: [], totalCol: null };

    group.assessments.forEach((assessment) => {
      const components = assessment.components || [];
      const headName = assessment?.componentInfo?.component_name;
      const span = colCount(assessment);
      setHeader(HEAD_ROW_2, col, `${headName} (${Number(assessment.max_marks)})`, HEAD_ROW_2, col + span - 1);

      const markCols = [];
      const markMeta = [];
      if (components.length) {
        components.forEach((component, index) => {
          setHeader(HEAD_ROW_3, col + index, `${component?.componentInfo?.component_name} (${Number(component.max_marks)})`);
          markCols.push(col + index);
          markMeta.push({
            col: col + index,
            assessment_component_id: component.id,
            component_id: component.component_id,
            max_marks: Number(component.max_marks),
          });
        });
      } else {
        setHeader(HEAD_ROW_3, col, `Marks (${Number(assessment.max_marks)})`);
        markCols.push(col);
        markMeta.push({
          col,
          assessment_component_id: null,
          component_id: null,
          max_marks: Number(assessment.max_marks),
        });
      }

      markCols.forEach((c) => markColSet.add(c));
      const totalCol = col + markCols.length;
      const convertedCol = totalCol + 1;
      setHeader(HEAD_ROW_3, totalCol, `Total (${subHeadTotalMax(assessment)})`);
      setHeader(HEAD_ROW_3, convertedCol, `Total Converted (${Number(assessment.max_marks)})`);
      formulaCols.push(totalCol, convertedCol);

      groupEntry.heads.push({
        assessmentId: assessment.id,
        markCols,
        markMeta,
        totalCol,
        convertedCol,
        ratio: ratioOf(assessment),
      });
      col += span;
    });

    setHeader(HEAD_ROW_1, col, `${group.name} Total Marks (${groupMax(group)})`, HEADER_END);
    groupEntry.totalCol = col;
    formulaCols.push(col);
    layout.push(groupEntry);
    col += 1;
  });

  setHeader(HEAD_ROW_1, col, `Grand Total (${grandMax})`, HEADER_END);
  const grandCol = col;
  formulaCols.push(grandCol);
  const lastCol = col;

  const infoText = (pairs) =>
    pairs.map(([label, value]) => `${label}: ${value || "-"}`).join("     |     ");
  const infoRows = [
    {
      rowNo: INFO_ROW_1,
      text: infoText([
        ["Exam", scheme?.examNameInfo?.exam_name],
        ["Term", scheme?.termInfo?.term_name],
      ]),
    },
    {
      rowNo: INFO_ROW_2,
      text: infoText([
        ["Class", scheme?.classInfo?.class_name],
        ["Division", row?.divisionInfo?.division_name],
        ["Subject", row?.subjectInfo?.value],
      ]),
    },
  ];
  // Merged across the table so no column lines show; only the row lines are drawn
  infoRows.forEach(({ rowNo, text }) => {
    setHeader(rowNo, 1, text, rowNo, lastCol);
    const cell = sheet.getCell(rowNo, 1);
    cell.font = { bold: true, size: 12 };
    cell.alignment = { horizontal: "left", vertical: "middle", indent: 1 };
    for (let c = 1; c <= lastCol; c += 1) {
      sheet.getCell(rowNo, c).border = { top: { style: "thin" }, bottom: { style: "thin" } };
    }
    sheet.getRow(rowNo).height = 22;
  });

  for (let r = HEAD_ROW_1; r <= HEADER_END; r += 1) {
    for (let c = 1; c <= lastCol; c += 1) {
      const cell = sheet.getCell(r, c);
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_FILL } };
      cell.border = thinBorder;
    }
  }

  const studentRows = [];

  // Totals stay blank until at least one mark is in that row
  for (let r = HEADER_END + 1; r <= HEADER_END + rowCount; r += 1) {
    const cellRef = (c) => `${letter(c)}${r}`;
    const allConverted = [];
    const studentIndex = r - HEADER_END - 1;
    const student = studentList[studentIndex];

    if (student) {
      const fixedValues = studentFixedValues(student, studentIndex);
      FIXED_COLUMNS.forEach((fixed, index) => {
        sheet.getCell(r, index + 1).value = fixedValues[fixed.key];
      });
      markColSet.forEach((c) => {
        sheet.getCell(r, c).value = 0;
      });
      studentRows.push({ row: r, student_id: student.id });
    }

    layout.forEach((groupEntry) => {
      const converted = [];
      groupEntry.heads.forEach(({ markCols, totalCol, convertedCol, ratio }) => {
        const marks = markCols.map(cellRef);
        const anyMark = `COUNT(${marks.join(",")})=0`;
        sheet.getCell(r, totalCol).value = {
          formula: `IF(${anyMark},"",SUM(${marks.join(",")}))`,
        };
        sheet.getCell(r, convertedCol).value = {
          formula: `IF(${anyMark},"",ROUND(${marks.map((m) => `N(${m})*${ratio}`).join("+")},2))`,
        };
        converted.push(cellRef(convertedCol));
      });

      sheet.getCell(r, groupEntry.totalCol).value = {
        formula: `IF(COUNT(${converted.join(",")})=0,"",ROUND(SUM(${converted.join(",")}),2))`,
      };
      allConverted.push(cellRef(groupEntry.totalCol));
    });

    sheet.getCell(r, grandCol).value = {
      formula: `IF(COUNT(${allConverted.join(",")})=0,"",ROUND(SUM(${allConverted.join(",")}),2))`,
    };

    for (let c = 1; c <= lastCol; c += 1) {
      const cell = sheet.getCell(r, c);
      const fixed = FIXED_COLUMNS[c - 1];
      cell.border = thinBorder;
      cell.alignment = { horizontal: fixed?.align || "center", vertical: "middle" };
      cell.protection = {
        locked: formulaCols.includes(c) || Boolean(student && fixed?.locked),
      };
    }
    formulaCols.forEach((c) => {
      const cell = sheet.getCell(r, c);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: FORMULA_FILL } };
      cell.font = { bold: true };
    });
  }

  FIXED_COLUMNS.forEach((fixed, index) => {
    sheet.getColumn(index + 1).width = fixed.width;
  });
  for (let c = FIRST_MARK_COL; c <= lastCol; c += 1) sheet.getColumn(c).width = 16;
  sheet.views = [{ state: "frozen", xSplit: 0, ySplit: HEADER_END }];

  await sheet.protect("", {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatColumns: true,
    formatRows: true,
  });

  const columnLayout = {
    groups: layout.map((groupEntry) => ({
      group_id: groupEntry.groupId,
      total_col: groupEntry.totalCol,
      heads: groupEntry.heads.map((head) => ({
        assessment_id: head.assessmentId,
        ratio: head.ratio,
        total_col: head.totalCol,
        converted_col: head.convertedCol,
        marks: head.markMeta,
      })),
    })),
    grand_col: grandCol,
  };
  const meta = workbook.addWorksheet(META_SHEET, { state: "veryHidden" });
  [
    ["template_version", TEMPLATE_VERSION],
    ["result_mark_entry_id", row.id ?? ""],
    ["exam_scheme_id", row.exam_scheme_id],
    ["subject_id", row.subject_id],
    ["division_id", row.division_id ?? row?.divisionInfo?.id ?? ""],
    ["data_start_row", HEADER_END + 1],
    ["fixed_columns", JSON.stringify(Object.fromEntries(FIXED_COLUMNS.map((f, i) => [f.key, i + 1])))],
    ["students", JSON.stringify(studentRows)],
    ["layout", JSON.stringify(columnLayout)],
  ].forEach((entry) => meta.addRow(entry));

  const fileName = `${[
    scheme?.examNameInfo?.exam_name,
    scheme?.classInfo?.class_name,
    row?.divisionInfo?.division_name,
    row?.subjectInfo?.value,
    scheme?.termInfo?.term_name,
  ]
    .filter(Boolean)
    .map(safeName)
    .join("_") || "Marks"}_Marks.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const href = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(href);

  return fileName;
};

const cellValue = (cell) => {
  const value = cell?.value;
  if (value == null) return null;
  if (typeof value === "object" && !(value instanceof Date)) {
    if ("result" in value) return value.result ?? null;
    if (Array.isArray(value.richText)) return value.richText.map((part) => part.text).join("");
    if ("text" in value) return value.text;
    return null;
  }
  return value;
};

const toMark = (value) => {
  if (value === null || value === "") return { value: null, valid: true };
  const number = Number(value);
  return Number.isFinite(number) ? { value: number, valid: true } : { value, valid: false };
};

const parseInfoText = (text) =>
  String(text || "")
    .split("|")
    .reduce((acc, part) => {
      const [label, ...rest] = part.split(":");
      if (label && rest.length) acc[label.trim().toLowerCase()] = rest.join(":").trim();
      return acc;
    }, {});

/**
 * Read a marks sheet downloaded with downloadAddMarkExcel.
 * @param {File|Blob|ArrayBuffer|Uint8Array} file
 * @returns {Promise<{
 *   info: { exam?: string, term?: string, class?: string, division?: string, subject?: string },
 *   ids: { result_mark_entry_id: number|null, exam_scheme_id: number|null, subject_id: number|null, division_id: number|null },
 *   students: Array<{
 *     row: number, student_id: number|null, sr_no: any, reg_no: string, roll_no: string, seat_no: string, name: string,
 *     marks: Array<{ assessment_id: number, assessment_component_id: number|null, component_id: number|null, max_marks: number, value: number|null }>,
 *     heads: Array<{ assessment_id: number, total: number|null, total_converted: number|null }>,
 *     group_totals: Array<{ group_id: number, total: number|null }>,
 *     grand_total: number|null,
 *   }>,
 *   errors: Array<{ row: number, column: string, message: string }>,
 * }>}
 */
export const readAddMarkExcel = async (file) => {
  if (!file) throw new Error("Please choose an Excel file to upload.");
  const buffer = typeof file.arrayBuffer === "function" ? await file.arrayBuffer() : file;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.getWorksheet(MARKS_SHEET);
  const meta = workbook.getWorksheet(META_SHEET);
  if (!sheet || !meta) {
    throw new Error("Invalid file. Please upload the marks sheet downloaded from Marks Entry.");
  }

  const metaValues = {};
  meta.eachRow((metaRow) => {
    metaValues[metaRow.getCell(1).text] = metaRow.getCell(2).text;
  });
  if (!metaValues.layout) {
    throw new Error("Invalid file. Column details are missing from the marks sheet.");
  }

  const columnLayout = JSON.parse(metaValues.layout);
  const toId = (value) => (value === undefined || value === "" ? null : Number(value));
  const ids = {
    result_mark_entry_id: toId(metaValues.result_mark_entry_id),
    exam_scheme_id: toId(metaValues.exam_scheme_id),
    subject_id: toId(metaValues.subject_id),
    division_id: toId(metaValues.division_id),
  };

  const info = {
    ...parseInfoText(sheet.getCell(INFO_ROW_1, 1).text),
    ...parseInfoText(sheet.getCell(INFO_ROW_2, 1).text),
  };

  const dataStartRow = Number(metaValues.data_start_row) || HEADER_END + 1;
  const numberOrNull = (cell) => {
    const value = cellValue(cell);
    return value === null || value === "" || !Number.isFinite(Number(value)) ? null : Number(value);
  };

  const fixedCols = metaValues.fixed_columns
    ? JSON.parse(metaValues.fixed_columns)
    : Object.fromEntries(FIXED_COLUMNS.map((f, i) => [f.key, i + 1]));
  const studentIdByRow = new Map(
    (metaValues.students ? JSON.parse(metaValues.students) : []).map((s) => [s.row, s.student_id])
  );
  const textAt = (excelRow, key) =>
    fixedCols[key] ? String(cellValue(excelRow.getCell(fixedCols[key])) ?? "").trim() : "";

  const students = [];
  const errors = [];

  for (let r = dataStartRow; r <= sheet.rowCount; r += 1) {
    const excelRow = sheet.getRow(r);
    const regNo = textAt(excelRow, "reg_no");
    const name = textAt(excelRow, "name");
    const hasStudent = Boolean(regNo || name);

    const marks = [];
    let hasMark = false;
    columnLayout.groups.forEach((group) => {
      group.heads.forEach((head) => {
        head.marks.forEach((markColumn) => {
          const { value, valid } = toMark(cellValue(excelRow.getCell(markColumn.col)));
          const columnLetter = sheet.getColumn(markColumn.col).letter;
          if (!valid) {
            errors.push({ row: r, column: columnLetter, message: `"${value}" is not a number` });
          } else if (value !== null && (value < 0 || value > markColumn.max_marks)) {
            errors.push({
              row: r,
              column: columnLetter,
              message: `${value} must be between 0 and ${markColumn.max_marks}`,
            });
          }
          if (value !== null) hasMark = true;
          marks.push({
            assessment_id: head.assessment_id,
            assessment_component_id: markColumn.assessment_component_id,
            component_id: markColumn.component_id,
            max_marks: markColumn.max_marks,
            value: valid ? value : null,
          });
        });
      });
    });

    if (!hasStudent && !hasMark) continue;
    if (!hasStudent) {
      errors.push({
        row: r,
        column: sheet.getColumn(fixedCols.reg_no).letter,
        message: "Registration No / Name is missing",
      });
    }

    students.push({
      row: r,
      student_id: studentIdByRow.get(r) ?? null,
      sr_no: cellValue(excelRow.getCell(fixedCols.sr_no)),
      reg_no: regNo,
      roll_no: textAt(excelRow, "roll_no"),
      seat_no: textAt(excelRow, "seat_no"),
      name,
      marks,
      heads: columnLayout.groups.flatMap((group) =>
        group.heads.map((head) => ({
          assessment_id: head.assessment_id,
          total: numberOrNull(excelRow.getCell(head.total_col)),
          total_converted: numberOrNull(excelRow.getCell(head.converted_col)),
        }))
      ),
      group_totals: columnLayout.groups.map((group) => ({
        group_id: group.group_id,
        total: numberOrNull(excelRow.getCell(group.total_col)),
      })),
      grand_total: numberOrNull(excelRow.getCell(columnLayout.grand_col)),
    });
  }

  return { info, ids, students, errors };
};

export default downloadAddMarkExcel;
