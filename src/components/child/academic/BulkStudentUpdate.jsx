import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import baseURL from "../../../utils/baseUrl";
import Loader from "../../../helper/Loader";
import "../../../assets/css/mastercom.css";
import "../../../assets/css/studentBulkUpdate.css";

const normalizeColumns = (cols) => {
  if (!Array.isArray(cols) || cols.length === 0) return [];
  if (typeof cols[0] === "string") {
    return cols.map((c) => ({ key: c, label: c }));
  }
  return cols.map((c) => ({
    key: c.name || c.key || c.column_name,
    label: c.label || c.name || c.column_name,
  }));
};

const BulkStudentUpdate = () => {
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [students, setStudents] = useState([]);
  const [editableColumns, setEditableColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const [editedData, setEditedData] = useState({});

  // No filter checked → show all fields; otherwise show only checked fields
  const isColumnFilterActive = selectedColumns.length > 0;
  const visibleColumns = isColumnFilterActive
    ? editableColumns.filter((col) => selectedColumns.includes(col.key))
    : editableColumns;

  const headerCheckboxRef = useRef(null);
  const allSelected =
    students.length > 0 && selectedStudents.length === students.length;
  const someSelected = selectedStudents.length > 0 && !allSelected;

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) el.indeterminate = someSelected;
  }, [someSelected]);

  useEffect(() => {
    let cancelled = false;
    const fetchInitialData = async () => {
      setLoadError(null);
      try {
        const [classRes, divRes, colRes] = await Promise.all([
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/divisions`),
          axios.get(`${baseURL}/api/parmanent-personal-information/columns`),
        ]);
        if (cancelled) return;
        setClasses(classRes?.data?.data || []);
        setDivisions(divRes?.data?.data || []);
        setEditableColumns(
          normalizeColumns(colRes?.data?.data || colRes?.data || [])
        );
      } catch {
        if (!cancelled)
          setLoadError("Could not load filters. Please refresh the page.");
      }
    };
    fetchInitialData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = async () => {
    if (!selectedClass && !selectedDivision) {
      alert("Please select at least a class or division.");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const params = {};
      if (selectedClass) params.class = selectedClass;
      if (selectedDivision) params.division = selectedDivision;

      const res = await axios.get(
        `${baseURL}/api/parmanent-personal-information`,
        { params }
      );
      const data = res?.data?.data || [];
      setStudents(data);
      setSelectedStudents([]);
      setEditedData({});
    } catch {
      setStudents([]);
      alert("Could not load students. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectedStudents(checked ? students.map((s) => s.id) : []);
  };

  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleColumnToggle = (key) => {
    setSelectedColumns((prev) => {
      if (prev.length === 0) {
        return [key];
      }
      if (prev.includes(key)) {
        const next = prev.filter((k) => k !== key);
        if (next.length === 0) return [];
        setEditedData((edits) => {
          const cleaned = {};
          Object.entries(edits).forEach(([regNo, fields]) => {
            const { [key]: _removed, ...rest } = fields;
            if (Object.keys(rest).length > 0) cleaned[regNo] = rest;
          });
          return cleaned;
        });
        return next;
      }
      return [...prev, key];
    });
  };

  const handleShowAllColumns = () => {
    setSelectedColumns([]);
  };

  const columnsForUpdate = isColumnFilterActive
    ? selectedColumns
    : editableColumns.map((c) => c.key);

  const handleFieldChange = (regNo, fieldKey, value) => {
    setEditedData((prev) => ({
      ...prev,
      [regNo]: { ...prev[regNo], [fieldKey]: value },
    }));
  };

  const handleBulkUpdate = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student.");
      return;
    }
    const records = selectedStudents
      .map((id) => {
        const student = students.find((s) => s.id === id);
        if (!student) return null;
        const edits = editedData[student.reg_no];
        if (!edits) return null;
        const record = { reg_no: student.reg_no };
        columnsForUpdate.forEach((key) => {
          const val = edits[key];
          if (val !== "" && val != null) record[key] = val;
        });
        if (Object.keys(record).length <= 1) return null;
        return record;
      })
      .filter(Boolean);

    if (records.length === 0) {
      alert("Enter at least one value for the selected students.");
      return;
    }

    if (!window.confirm(`Update ${records.length} student record(s)?`)) return;

    setUpdating(true);
    try {
      await axios.put(
        `${baseURL}/api/parmanent-personal-information/bulk-update`,
        { records }
      );
      alert("Students updated successfully.");
      setEditedData({});
      await handleSearch();
    } catch (err) {
      console.error("Bulk update failed", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Update failed. Please try again.";
      alert(typeof msg === "string" ? msg : "Update failed. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const showEmptyAfterSearch =
    hasSearched && !loading && students.length === 0;

  return (
    <div className="chfi-wrapper sbu-page d-flex flex-column gap-3 pb-2">
      {loadError && (
        <section className="chfi-card" aria-label="Load error">
          <div className="card-body py-3">
            <p className="text-danger small mb-0 d-flex align-items-center gap-2">
              <Icon icon="solar:danger-triangle-bold-duotone" width="18" />
              {loadError}
            </p>
          </div>
        </section>
      )}

      <section className="chfi-card" aria-label="Find students">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:filter-bold-duotone" width="22" />
            </span>
            <div>
              <h5 className="card-title">Find Students</h5>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="sbu-filter-grid">
            <div className="sbu-filter-field">
              <label className="form-label">
                <span className="label-dot" />
                Class
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon
                    icon="solar:square-academic-cap-bold-duotone"
                    width="18"
                  />
                </span>
                <select
                  className="form-select"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">All classes</option>
                  {classes.map((c) => (
                    <option key={c?.id ?? c?.class_name} value={c?.id ?? ""}>
                      {c?.class_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sbu-filter-field">
              <label className="form-label">
                <span className="label-dot" />
                Division
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:widget-bold-duotone" width="18" />
                </span>
                <select
                  className="form-select"
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                >
                  <option value="">All divisions</option>
                  {divisions.map((d) => (
                    <option
                      key={d?.id ?? d?.division_name}
                      value={d?.id ?? ""}
                    >
                      {d?.division_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sbu-filter-field sbu-filter-action">
              <button
                type="button"
                className="btn-submit"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Icon icon="line-md:loading-loop" width="16" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Icon icon="solar:magnifer-bold-duotone" width="18" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {loading && students.length === 0 && hasSearched && (
        <section className="chfi-card" aria-label="Loading students">
          <div className="card-body">
            <Loader message="Loading students..." />
          </div>
        </section>
      )}

      {students.length > 0 && (
        <section
          className="chfi-card sbu-table-card"
          aria-label="Bulk student update table"
        >
          <div className="card-header">
            <div className="sbu-table-header">
              <div className="header-row" style={{ gap: 8, minWidth: 0 }}>
                <span className="header-icon">
                  <Icon
                    icon="solar:users-group-rounded-bold-duotone"
                    width="22"
                  />
                </span>
                <div className="min-w-0">
                  <h5 className="card-title">Edit &amp; Update</h5>
                  <div className="sbu-stat-group">
                    <span className="sbu-stat-pill">{students.length} loaded</span>
                    <span className="sbu-stat-pill">
                      {selectedStudents.length} selected
                    </span>
                    <span className="sbu-stat-pill">
                      {visibleColumns.length} columns
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="sbu-save-btn"
                onClick={handleBulkUpdate}
                disabled={updating || selectedStudents.length === 0}
              >
                {updating ? (
                  <>
                    <Icon icon="line-md:loading-loop" width="16" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Icon icon="solar:diskette-bold-duotone" width="18" />
                    Save changes ({selectedStudents.length})
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="card-body">
            {editableColumns.length > 0 && (
              <div className="sbu-column-filter">
                <div className="sbu-column-filter-head">
                  <label className="form-label mb-0">
                    <span className="label-dot" />
                    Filter columns
                  </label>
                  <button
                    type="button"
                    className="sbu-column-clear"
                    onClick={handleShowAllColumns}
                    disabled={!isColumnFilterActive}
                  >
                    Show all fields
                  </button>
                </div>
                <div className="sbu-column-grid">
                  {editableColumns.map((col) => (
                    <label key={col.key} className="sbu-column-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedColumns.includes(col.key)}
                        onChange={() => handleColumnToggle(col.key)}
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
                <p className="sbu-column-hint">
                  {isColumnFilterActive
                    ? "Showing selected fields only. Uncheck all or click Show all fields to see every column."
                    : "All fields are shown. Check a field to filter the table to that column."}
                </p>
              </div>
            )}
            {updating && <Loader message="Updating students..." />}
            <div className="sbu-table-wrap">
              <table className="table sbu-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th scope="col" className="sbu-check-col">
                      <input
                        ref={headerCheckboxRef}
                        type="checkbox"
                        className="form-check-input"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        aria-label="Select all rows"
                      />
                    </th>
                    <th scope="col">Reg No</th>
                    {visibleColumns.map((col) => (
                      <th key={col.key} scope="col">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const isSelected = selectedStudents.includes(student.id);
                    return (
                      <tr
                        key={student.id}
                        className={isSelected ? "table-success" : undefined}
                      >
                        <td className="sbu-check-col">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => handleSelectStudent(student.id)}
                            aria-label={`Select ${student.reg_no}`}
                          />
                        </td>
                        <td className="fw-medium text-nowrap">
                          {student.reg_no}
                        </td>
                        {visibleColumns.map((col) => (
                          <td key={col.key}>
                            <input
                              type="text"
                              className="sbu-cell-input"
                              placeholder={col.label}
                              value={
                                editedData[student.reg_no]?.[col.key] ??
                                student[col.key] ??
                                ""
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  student.reg_no,
                                  col.key,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {showEmptyAfterSearch && (
        <section className="chfi-card" aria-label="No students found">
          <div className="card-body sbu-empty-state">
            <Icon
              icon="solar:users-group-rounded-bold-duotone"
              width="40"
              className="mb-2"
            />
            <p>No students match this filter.</p>
            <p className="mt-1">Try different class or division options.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default BulkStudentUpdate;
