import axios from "axios";
import ExcelJS from "exceljs/dist/exceljs.min.js";
import baseURL from "./baseUrl";

const INFO_ROW_1 = 1;
const INFO_ROW_2 = 2;
const HEAD_ROW_1 = 3;
const HEAD_ROW_2 = 4;
const HEAD_ROW_3 = 5;
const HEADER_END = HEAD_ROW_3;
const HEADER_FILL = "FFE8EEF9";
const FORMULA_FILL = "FFFFFBEB";
const MARKS_SHEET = "Marks";
const META_SHEET = "Meta";
const TEMPLATE_VERSION = 3;

const FIXED_COLUMNS = [
  { key: "sr_no", title: "Sr No", width: 8, locked: true },
  { key: "reg_no", title: "Registration No", width: 18, locked: true },
  { key: "roll_no", title: "Roll No", width: 10, locked: true },
  { key: "seat_no", title: "Seat No", width: 10, locked: false },
  { key: "name", title: "Name", width: 34, locked: true, align: "left" },
];
const FIRST_MARK_COL = FIXED_COLUMNS.length + 1;

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

/** Stable key for a mark input cell on the Add Marks page. */
export const markInputKey = (assessmentId, assessmentComponentId = null) =>
  assessmentComponentId != null ? `ac:${assessmentComponentId}` : `a:${assessmentId}`;

/**
 * Build a marks Excel blob from the on-screen Add Marks table values.
 * Same Meta/layout shape as downloadAddMarkExcel so import-marks accepts it.
 * Does not change or call downloadAddMarkExcel.
 *
 * @param {object} row - Marks entry row
 * @param {Array} students - Students shown in the table
 * @param {Record<string|number, Record<string, number|string|null|undefined>>} marksByStudent
 * @returns {Promise<{ fileName: string, blob: Blob, buffer: ArrayBuffer }>}
 */
export const buildAddMarkExcelFromLiveMarkEntry = async (row, students = [], marksByStudent = {}) => {
  if (!row?.exam_scheme_id || !row?.subject_id) {
    throw new Error("Exam scheme and subject are required to build the marks sheet");
  }

  const studentList = Array.isArray(students) ? students : [];
  if (!studentList.length) {
    throw new Error("No students available to build the marks sheet");
  }

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
          setHeader(
            HEAD_ROW_3,
            col + index,
            `${component?.componentInfo?.component_name} (${Number(component.max_marks)})`
          );
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
  [
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
  ].forEach(({ rowNo, text }) => {
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
  for (let r = HEADER_END + 1; r <= HEADER_END + studentList.length; r += 1) {
    const cellRef = (c) => `${letter(c)}${r}`;
    const allConverted = [];
    const studentIndex = r - HEADER_END - 1;
    const student = studentList[studentIndex];

    if (student) {
      const fixedValues = studentFixedValues(student, studentIndex);
      FIXED_COLUMNS.forEach((fixed, index) => {
        sheet.getCell(r, index + 1).value = fixedValues[fixed.key];
      });

      const studentMarks = marksByStudent[student.id] || marksByStudent[String(student.id)] || {};
      layout.forEach((groupEntry) => {
        groupEntry.heads.forEach(({ assessmentId, markMeta }) => {
          markMeta.forEach((markColumn) => {
            const key = markInputKey(assessmentId, markColumn.assessment_component_id);
            const raw = studentMarks[key];
            const num = raw === "" || raw == null ? null : Number(raw);
            sheet.getCell(r, markColumn.col).value =
              num != null && Number.isFinite(num) ? num : 0;
          });
        });
      });
      studentRows.push({ row: r, student_id: student.id });
    } else {
      markColSet.forEach((c) => {
        sheet.getCell(r, c).value = 0;
      });
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
    ["term_id", scheme?.term_id ?? row?.scheme?.term_id ?? ""],
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

  return { fileName, blob, buffer };
};

export default buildAddMarkExcelFromLiveMarkEntry;
