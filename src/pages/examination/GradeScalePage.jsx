import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import baseURL from "../../utils/baseUrl";
import "../../assets/css/mastercom.css";
import "../../assets/css/editdelete.css";
import "../../assets/css/examination.css";

const API = `${baseURL}/api/grade-scales`;

const emptyRange = () => ({
  key: Math.random().toString(36).slice(2),
  grade: "",
  description: "",
  min_percent: "",
  max_percent: "",
  grade_point: "",
  is_fail: false,
});

const emptyForm = () => ({ name: "", type: "marks", is_active: true, ranges: [emptyRange()] });

const CBSE_PRESET = [
  ["A1", 91, 100, 10, false],
  ["A2", 81, 90, 9, false],
  ["B1", 71, 80, 8, false],
  ["B2", 61, 70, 7, false],
  ["C1", 51, 60, 6, false],
  ["C2", 41, 50, 5, false],
  ["D", 33, 40, 4, false],
  ["E1", 21, 32, 0, true],
  ["E2", 0, 20, 0, true],
];

const DESCRIPTOR_PRESET = [
  ["A", "Excellent"],
  ["B", "Very Good"],
  ["C", "Good"],
];

const toInput = (value) => (value === null || value === undefined ? "" : String(Number(value)));

const GradeScalePage = () => {
  const [scales, setScales] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isMarks = form.type === "marks";

  const loadScales = async () => {
    try {
      const { data } = await axios.get(API);
      setScales(data?.data || []);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Failed to load grade scales");
    }
  };

  useEffect(() => {
    loadScales();
  }, []);

  const startNew = () => {
    setEditId(null);
    setForm(emptyForm());
    setSuccessMsg("");
    setErrorMsg("");
  };

  const startEdit = (scale) => {
    setEditId(scale.id);
    setForm({
      name: scale.name,
      type: scale.type,
      is_active: !!scale.is_active,
      ranges: (scale.ranges || []).map((r) => ({
        key: `id-${r.id}`,
        id: r.id,
        grade: r.grade || "",
        description: r.description || "",
        min_percent: toInput(r.min_percent),
        max_percent: toInput(r.max_percent),
        grade_point: toInput(r.grade_point),
        is_fail: !!r.is_fail,
      })),
    });
    setSuccessMsg("");
    setErrorMsg("");
  };

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const setRange = (index, name, value) =>
    setForm((prev) => ({
      ...prev,
      ranges: prev.ranges.map((r, i) => (i === index ? { ...r, [name]: value } : r)),
    }));

  const addRange = () => setForm((prev) => ({ ...prev, ranges: [...prev.ranges, emptyRange()] }));

  const removeRange = (index) =>
    setForm((prev) => ({ ...prev, ranges: prev.ranges.filter((_, i) => i !== index) }));

  const moveRange = (index, step) =>
    setForm((prev) => {
      const ranges = [...prev.ranges];
      const target = index + step;
      if (target < 0 || target >= ranges.length) return prev;
      [ranges[index], ranges[target]] = [ranges[target], ranges[index]];
      return { ...prev, ranges };
    });

  const fillPreset = () => {
    if (form.ranges.some((r) => r.grade) && !window.confirm("Replace the current rows with the preset?")) return;
    const ranges = isMarks
      ? CBSE_PRESET.map(([grade, min, max, point, fail]) => ({
          ...emptyRange(),
          grade,
          min_percent: String(min),
          max_percent: String(max),
          grade_point: String(point),
          is_fail: fail,
        }))
      : DESCRIPTOR_PRESET.map(([grade, description]) => ({ ...emptyRange(), grade, description }));
    setForm((prev) => ({ ...prev, ranges }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (!form.name.trim()) {
      setErrorMsg("Scale name is required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      type: form.type,
      is_active: form.is_active,
      ranges: form.ranges.map((r, index) => ({
        id: r.id,
        grade: r.grade.trim(),
        description: r.description.trim() || null,
        min_percent: isMarks ? r.min_percent : null,
        max_percent: isMarks ? r.max_percent : null,
        grade_point: r.grade_point,
        is_fail: r.is_fail,
        sequence: index + 1,
      })),
    };

    setSaving(true);
    try {
      const { data } = editId ? await axios.put(`${API}/${editId}`, payload) : await axios.post(API, payload);
      setSuccessMsg(editId ? "Grade scale updated successfully!" : "Grade scale added successfully!");
      await loadScales();
      startEdit(data.data);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (scale) => {
    if (!window.confirm(`Delete grade scale "${scale.name}"?`)) return;
    try {
      await axios.delete(`${API}/${scale.id}`);
      if (editId === scale.id) startNew();
      loadScales();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="exam-page chfi-wrapper">
      <div className="row g-3">
        <div className="col-lg-4">
          <div className="chfi-card h-100">
            <div className="card-header">
              <div className="header-row">
                <span className="header-icon">
                  <Icon icon="solar:ranking-bold-duotone" width="24" />
                </span>
                <div>
                  <h5 className="card-title">Grade Scales</h5>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="exam-toolbar">
                <span className="exam-hint">Create once, use in any class.</span>
                <button type="button" className="exam-btn exam-btn-primary" onClick={startNew}>
                  <Icon icon="solar:add-circle-bold" width="16" /> New Scale
                </button>
              </div>
              <div className="exam-table-wrap">
                <table className="exam-table">
                  <thead>
                    <tr>
                      <th>Scale</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scales.length === 0 && (
                      <tr>
                        <td colSpan={2} className="exam-empty">
                          <Icon icon="solar:ranking-linear" width="34" className="exam-empty-icon" />
                          <div>No grade scales yet</div>
                          <div className="exam-hint">Click “New Scale” to create one.</div>
                        </td>
                      </tr>
                    )}
                    {scales.map((scale) => (
                      <tr key={scale.id} className={editId === scale.id ? "is-selected" : ""}>
                        <td>
                          <div className="exam-scale-item">
                            <span className={`exam-scale-avatar ${scale.type === "descriptor" ? "is-descriptor" : ""}`}>
                              {(scale.name || "?").trim().charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <div className="exam-scale-name">{scale.name}</div>
                              <div className="d-flex gap-1 mt-1 flex-wrap align-items-center">
                                <span className="exam-badge exam-badge-type">{scale.type}</span>
                                <span className={`exam-badge ${scale.is_active ? "exam-badge-active" : "exam-badge-inactive"}`}>
                                  {scale.is_active ? "Active" : "Inactive"}
                                </span>
                                <span className="exam-badge exam-badge-count">
                                  <Icon icon="solar:list-check-linear" width="12" />
                                  {scale.ranges?.length || 0} grades
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="table-action-group">
                            <button type="button" className="table-action-btn table-action-edit" onClick={() => startEdit(scale)}>
                              Edit
                            </button>
                            <button type="button" className="table-action-btn table-action-delete" onClick={() => handleDelete(scale)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="chfi-card h-100">
            <div className="card-header">
              <div className="header-row">
                <span className="header-icon">
                  <Icon icon="solar:pen-new-square-bold-duotone" width="24" />
                </span>
                <div className="min-w-0">
                  <h5 className="card-title text-truncate">{editId ? `Edit: ${form.name}` : "New Grade Scale"}</h5>
                </div>
                <span className="exam-mode-pill ms-auto">
                  <Icon icon={editId ? "solar:pen-2-linear" : "solar:add-square-linear"} width="13" />
                  {editId ? "Editing" : "New"}
                </span>
              </div>
            </div>
            <div className="card-body">
              {successMsg && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {successMsg}
                  <button type="button" className="btn-close" onClick={() => setSuccessMsg("")} />
                </div>
              )}
              {errorMsg && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {errorMsg}
                  <button type="button" className="btn-close" onClick={() => setErrorMsg("")} />
                </div>
              )}

              <form className="chfi-root" onSubmit={handleSubmit}>
                <div className="exam-form-grid mb-3">
                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Scale Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Scholastic Grading (A1-E2)"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                    />
                  </div>
                  <div className="field-row">
                    <label className="form-label">
                      <span className="label-dot" />
                      Type <span className="text-danger">*</span>
                    </label>
                    <select className="form-select" value={form.type} onChange={(e) => setField("type", e.target.value)}>
                      <option value="marks">Marks (grade from percentage)</option>
                      <option value="descriptor">Descriptor (A/B/C, Always/Rarely)</option>
                    </select>
                  </div>
                  <div className="field-row justify-content-end">
                    <div className="form-check form-switch exam-switch">
                      <input
                        id="scale-active"
                        type="checkbox"
                        className="form-check-input"
                        checked={form.is_active}
                        onChange={(e) => setField("is_active", e.target.checked)}
                      />
                      <label htmlFor="scale-active" className="form-check-label">
                        Active
                      </label>
                    </div>
                  </div>
                </div>

                <div className="exam-toolbar">
                  <span className="exam-hint">
                    {isMarks
                      ? "Ranges must not overlap. Tick Fail for grades below the pass mark."
                      : "Descriptor grades are picked directly by the teacher (no percentage)."}
                  </span>
                  <button type="button" className="exam-btn exam-btn-light" onClick={fillPreset}>
                    <Icon icon="solar:magic-stick-3-bold-duotone" width="16" />
                    {isMarks ? "Fill CBSE A1-E2" : "Fill A / B / C"}
                  </button>
                </div>

                <div className="exam-table-wrap exam-ranges-wrap">
                  <table className="exam-table exam-ranges-table">
                    <thead>
                      <tr>
                        <th style={{ width: 96 }}>Order</th>
                        <th>Grade *</th>
                        <th>Description</th>
                        {isMarks && <th>Min %</th>}
                        {isMarks && <th>Max %</th>}
                        <th>Grade Point</th>
                        <th className="text-center">Fail</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {form.ranges.map((range, index) => (
                        <tr key={range.key} className={range.is_fail ? "is-fail" : ""}>
                          <td>
                            <div className="d-flex gap-1 align-items-center">
                              <span className="exam-row-no">{index + 1}</span>
                              <button type="button" className="exam-icon-btn" disabled={index === 0} onClick={() => moveRange(index, -1)}>
                                <Icon icon="solar:alt-arrow-up-linear" width="14" />
                              </button>
                              <button
                                type="button"
                                className="exam-icon-btn"
                                disabled={index === form.ranges.length - 1}
                                onClick={() => moveRange(index, 1)}
                              >
                                <Icon icon="solar:alt-arrow-down-linear" width="14" />
                              </button>
                            </div>
                          </td>
                          <td>
                            <input
                              className="form-control input-xs exam-grade-input"
                              value={range.grade}
                              onChange={(e) => setRange(index, "grade", e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              value={range.description}
                              onChange={(e) => setRange(index, "description", e.target.value)}
                            />
                          </td>
                          {isMarks && (
                            <td>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                step="0.01"
                                className="form-control input-xs"
                                value={range.min_percent}
                                onChange={(e) => setRange(index, "min_percent", e.target.value)}
                              />
                            </td>
                          )}
                          {isMarks && (
                            <td>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                step="0.01"
                                className="form-control input-xs"
                                value={range.max_percent}
                                onChange={(e) => setRange(index, "max_percent", e.target.value)}
                              />
                            </td>
                          )}
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control input-xs"
                              value={range.grade_point}
                              onChange={(e) => setRange(index, "grade_point", e.target.value)}
                            />
                          </td>
                          <td className="text-center">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={range.is_fail}
                              onChange={(e) => setRange(index, "is_fail", e.target.checked)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="exam-icon-btn danger"
                              disabled={form.ranges.length === 1}
                              onClick={() => removeRange(index)}
                            >
                              <Icon icon="solar:trash-bin-minimalistic-linear" width="14" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="actions exam-form-footer">
                  <span className="exam-hint">
                    {form.ranges.length} {form.ranges.length === 1 ? "grade" : "grades"}
                  </span>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="button" className="btn btn-reset" onClick={addRange}>
                      <Icon icon="solar:add-circle-linear" width="16" />
                      Add Row
                    </button>
                    <button type="submit" className="btn btn-submit" disabled={saving}>
                      <Icon icon={saving ? "line-md:loading-loop" : "solar:check-circle-bold-duotone"} width="18" />
                      {editId ? "Update" : "Save"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeScalePage;
