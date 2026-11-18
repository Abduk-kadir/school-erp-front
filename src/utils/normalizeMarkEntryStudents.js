import { markInputKey } from "./buildAddMarkExcelFromLiveMarkEntry";

/**
 * Students API may return one flat row per student, or many rows per student
 * (one per exam_assessment_id / assessment_component_id mark cell).
 * Collapse to unique students + marksByStudent keyed like the Add Marks table/Excel.
 *
 * @param {Array} rows
 * @returns {{
 *   students: Array<{ id: number, reg_no?: any, rollnumber?: any, seat_no?: any, first_name?: string, last_name?: string, father_name?: string }>,
 *   marksByStudent: Record<string|number, Record<string, string>>,
 * }}
 */
export const normalizeMarkEntryStudents = (rows = []) => {
  const studentMap = new Map();
  const marksByStudent = {};

  (Array.isArray(rows) ? rows : []).forEach((row) => {
    if (!row || typeof row !== "object") return;
    const studentId = row.student_id ?? row.id;
    if (studentId == null) return;

    if (!studentMap.has(studentId)) {
      studentMap.set(studentId, {
        id: studentId,
        reg_no: row.reg_no,
        rollnumber: row.rollnumber,
        seat_no: row.seat_no,
        first_name: row.first_name,
        last_name: row.last_name,
        father_name: row.father_name,
      });
      marksByStudent[studentId] = {};
    }

    const assessmentId = row.exam_assessment_id;
    const hasMarkPayload =
      assessmentId != null ||
      row.assessment_component_id != null ||
      (row.marks != null && String(row.marks).trim() !== "");

    if (!hasMarkPayload || assessmentId == null) return;

    const key = markInputKey(assessmentId, row.assessment_component_id ?? null);
    const raw = row.marks;
    if (raw === "" || raw == null) return;
    const num = Number(raw);
    marksByStudent[studentId][key] = Number.isFinite(num) ? String(num) : String(raw);
  });

  return {
    students: Array.from(studentMap.values()),
    marksByStudent,
  };
};

export default normalizeMarkEntryStudents;
