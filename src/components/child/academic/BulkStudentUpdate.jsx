import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Funnel, MagnifyingGlass, UsersThree } from "@phosphor-icons/react";
import baseURL from "../../../utils/baseUrl";

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

  const [editedData, setEditedData] = useState({});

  const headerCheckboxRef = useRef(null);
  const allSelected =
    students.length > 0 && selectedStudents.length === students.length;
  const someSelected =
    selectedStudents.length > 0 && !allSelected;

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
          axios.get(`${baseURL}/api/personal-information/columns`),
        ]);
        if (cancelled) return;
        setClasses(classRes?.data?.data || []);
        setDivisions(divRes?.data?.data || []);
        setEditableColumns(normalizeColumns(colRes?.data?.data || colRes?.data || []));
      } catch {
        if (!cancelled) setLoadError("Could not load filters. Please refresh the page.");
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
      const res = await axios.get(`${baseURL}/api/personal-information/all`, {
        params: {
          start: 0,
          length: 1000,
          "filter[className]": selectedClass,
          "filter[programName]": selectedDivision,
        },
      });
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
        if (
          !edits ||
          Object.values(edits).every((v) => v === "" || v == null)
        )
          return null;
        const record = { reg_no: student.reg_no };
        Object.entries(edits).forEach(([key, val]) => {
          if (val !== "" && val != null) record[key] = val;
        });
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
      await axios.put(`${baseURL}/api/personal-information/bulk-update`, { records });
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
    <div className="bulk-student-update">
      {loadError && (
        <div className="alert alert-warning border-0 shadow-sm mb-3" role="alert">
          {loadError}
        </div>
      )}

      <div className="card border-0 shadow-sm mt-3 overflow-hidden">
        <div
          className="card-header py-2 border-bottom"
          style={{
            backgroundColor: "color-mix(in srgb, var(--bs-primary-bg-subtle) 92%, var(--bs-primary) 8%)",
            borderBottomColor: "rgb(var(--bs-primary-rgb) / 0.22)",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-body-secondary p-2 shadow-sm">
              <Funnel size={20} weight="duotone" aria-hidden />
            </span>
            <div>
              <h5 className="card-title mb-0 text-body">Find students</h5>
              <p className="text-body-secondary small mb-0 mt-1">
                Choose a class and/or division, then search to load the list.
              </p>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="row g-3 align-items-end">
            <div className="col-md-5 col-lg-4">
              <label className="form-label small text-body-secondary mb-1">Class</label>
              <select
                className="form-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">All classes</option>
                {classes.map((c) => (
                  <option key={c?.class_name ?? c?.id} value={c?.class_name}>
                    {c?.class_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-5 col-lg-4">
              <label className="form-label small text-body-secondary mb-1">Division</label>
              <select
                className="form-select"
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
              >
                <option value="">All divisions</option>
                {divisions.map((d) => (
                  <option key={d?.division_name ?? d?.id} value={d?.division_name}>
                    {d?.division_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 col-lg-4">
              <button
                type="button"
                className="btn btn-success d-inline-flex align-items-center gap-2 px-4 shadow-sm"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading
                  </>
                ) : (
                  <>
                    <MagnifyingGlass size={18} weight="bold" aria-hidden />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && students.length === 0 && hasSearched && (
        <div className="card border-0 shadow-sm mt-4 overflow-hidden">
          <div className="card-body text-center py-5 text-body-secondary">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              aria-label="Loading"
            />
            <p className="mb-0">Loading students…</p>
          </div>
        </div>
      )}

      {students.length > 0 && (
        <div className="card basic-data-table border-0 shadow-sm mt-4 overflow-hidden">
          <div className="card-header bg-success-subtle border-bottom border-success-subtle py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span className="d-inline-flex rounded-circle bg-white text-success p-2 shadow-sm">
                <UsersThree size={22} weight="duotone" aria-hidden />
              </span>
              <div>
                <h5 className="card-title mb-1 text-success-emphasis">Edit & update</h5>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <span className="badge rounded-pill bg-white text-body-secondary border">
                    {students.length} loaded
                  </span>
                  <span className="badge rounded-pill bg-white text-body-secondary border">
                    {selectedStudents.length} selected
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-success px-4 shadow-sm"
              onClick={handleBulkUpdate}
              disabled={updating || selectedStudents.length === 0}
            >
              {updating ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2 text-light"
                    role="status"
                    aria-hidden="true"
                  />
                  Updating…
                </>
              ) : (
                `Save changes (${selectedStudents.length})`
              )}
            </button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table bordered-table mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-nowrap" style={{ width: 48 }}>
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
                    {editableColumns.map((col) => (
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
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => handleSelectStudent(student.id)}
                            aria-label={`Select ${student.reg_no}`}
                          />
                        </td>
                        <td className="fw-medium text-nowrap">{student.reg_no}</td>
                        {editableColumns.map((col) => (
                          <td key={col.key} className="text-nowrap">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder={String(student[col.key] ?? "") || col.label}
                              value={editedData[student.reg_no]?.[col.key] ?? ""}
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
        </div>
      )}

      {showEmptyAfterSearch && (
        <div className="card border-0 shadow-sm mt-4 overflow-hidden">
          <div className="card-body text-center text-body-secondary py-5">
            <UsersThree size={40} className="mb-3 opacity-50" weight="duotone" aria-hidden />
            <p className="mb-0 fs-6">No students match this filter.</p>
            <p className="small mb-0 mt-2">Try different class or division options.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkStudentUpdate;
