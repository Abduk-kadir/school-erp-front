import React, { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/mastercom.css";
import "../../../assets/css/academicOfflineFeeReport.css";

const ALL_ACTIONS = [
  "display",
  "add",
  "edit",
  "delete",
  "view",
  "import",
  "export",
];

const actionLabel = (key) => key.charAt(0).toUpperCase() + key.slice(1);

const REASON_PLACEHOLDER = "Reason";
const REASON_INPUT_SIZE = 12;

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const staffDisplayName = (s) =>
  s?.name ||
  [s?.firstname, s?.lastname, s?.surname].filter(Boolean).join(" ") ||
  `Staff ${s?.id}`;

const isActionApplicable = (moduleRow, action) =>
  Boolean(moduleRow.allowed_actions?.includes(action));

const actionExistsForModule = (moduleRow, action) =>
  isActionApplicable(moduleRow, action) &&
  moduleRow.role?.[action] !== null &&
  moduleRow.role?.[action] !== undefined;

const recomputeEffective = (row) => {
  const effective = { ...(row.effective || {}) };
  ALL_ACTIONS.forEach((action) => {
    if (!actionExistsForModule(row, action)) {
      effective[action] = null;
      return;
    }
    const overrideVal = row.override?.[action];
    effective[action] =
      overrideVal !== null && overrideVal !== undefined
        ? overrideVal
        : Boolean(row.role?.[action]);
  });
  const override_active = ALL_ACTIONS.some(
    (a) => row.override?.[a] !== null && row.override?.[a] !== undefined
  );
  return {
    ...row,
    reason: reasonAsText(row.reason),
    effective,
    override_active,
  };
};

const reasonAsText = (value) =>
  value != null && value !== "" ? String(value) : "";

const cloneRowSnapshot = (row) => ({
  module_id: row.module_id,
  reason: reasonAsText(row.reason),
  expires_at: row.expires_at ?? "",
  override: { ...(row.override || {}) },
});

const rowNeedsSave = (row, initial) => {
  if (!initial) return true;
  if ((row.reason ?? "").trim() !== (initial.reason ?? "").trim()) return true;
  if ((row.expires_at ?? "").trim() !== (initial.expires_at ?? "").trim()) {
    return true;
  }
  return ALL_ACTIONS.some((action) => {
    if (!actionExistsForModule(row, action)) return false;
    const current = row.override?.[action] ?? null;
    const base = initial.override?.[action] ?? null;
    return current !== base;
  });
};

function PersonalPermission() {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [designationId, setDesignationId] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [staffInfo, setStaffInfo] = useState(null);
  const [modules, setModules] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const initialModulesRef = useRef([]);

  const applyPermissionRows = useCallback((rows) => {
    const normalized = rows.map((row) => recomputeEffective(row));
    setModules(normalized);
    initialModulesRef.current = normalized.map(cloneRowSnapshot);
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [deptRes, desRes] = await Promise.all([
          axios.get(`${baseURL}/api/departments`),
          axios.get(`${baseURL}/api/designations`),
        ]);
        setDepartments(normalizeList(deptRes?.data));
        setDesignations(normalizeList(desRes?.data));
      } catch (error) {
        console.error("Failed to load department or designation options", error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoadingStaff(true);
      setStaffId("");
      setStaffInfo(null);
      setModules([]);
      initialModulesRef.current = [];
      setSuccessMsg("");
      setErrorMsg("");
      try {
        const params = {};
        if (departmentId) params.department = departmentId;
        if (designationId) params.designation = designationId;
        const { data } = await axios.get(`${baseURL}/api/staff`, { params });
        setStaffList(normalizeList(data));
      } catch (error) {
        console.error("Failed to load staff", error);
        setStaffList([]);
        setErrorMsg(
          error.response?.data?.message || "Failed to load staff list."
        );
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaff();
  }, [departmentId, designationId]);

  useEffect(() => {
    if (!staffId) {
      setStaffInfo(null);
      setModules([]);
      initialModulesRef.current = [];
      return;
    }

    const fetchPermissions = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const { data } = await axios.get(
          `${baseURL}/api/staff-permissions/${staffId}`
        );
        setStaffInfo(data?.staff ?? null);
        const rows = Array.isArray(data?.data) ? data.data : [];
        applyPermissionRows(rows);
      } catch (error) {
        console.error("Failed to load staff permissions", error);
        setStaffInfo(null);
        setModules([]);
        initialModulesRef.current = [];
        setErrorMsg(
          error.response?.data?.message ||
            "Failed to load permissions for this staff member."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [staffId, applyPermissionRows]);

  const handleDepartmentChange = (e) => {
    setSuccessMsg("");
    setDepartmentId(e.target.value);
  };

  const handleDesignationChange = (e) => {
    setSuccessMsg("");
    setDesignationId(e.target.value);
  };

  const handleStaffChange = (e) => {
    setSuccessMsg("");
    setStaffId(e.target.value);
  };

  const togglePermission = (moduleId, action) => {
    setModules((prev) =>
      prev.map((row) => {
        if (row.module_id !== moduleId) return row;
        if (!actionExistsForModule(row, action)) return row;
        const roleDefault = Boolean(row.role?.[action]);
        const nextEffective = !Boolean(row.effective?.[action]);
        const overrideVal =
          nextEffective === roleDefault ? null : nextEffective;
        const updated = {
          ...row,
          override: { ...row.override, [action]: overrideVal },
        };
        return recomputeEffective(updated);
      })
    );
  };

  const updateRowMeta = (moduleId, field, value) => {
    setModules((prev) =>
      prev.map((row) =>
        row.module_id === moduleId ? { ...row, [field]: value } : row
      )
    );
  };

  const clearRowOverrides = (moduleId) => {
    setModules((prev) =>
      prev.map((row) => {
        if (row.module_id !== moduleId) return row;
        const override = { ...row.override };
        ALL_ACTIONS.forEach((action) => {
          if (actionExistsForModule(row, action)) override[action] = null;
        });
        return recomputeEffective({
          ...row,
          override,
          reason: "",
          expires_at: "",
        });
      })
    );
  };

  const buildSavePayload = useCallback((rows, initialRows) => {
    const initialById = Object.fromEntries(
      initialRows.map((r) => [r.module_id, r])
    );
    const payload = [];

    rows.forEach((row) => {
      const initial = initialById[row.module_id];
      if (!rowNeedsSave(row, initial)) return;

      const hasAnyOverride = ALL_ACTIONS.some(
        (action) =>
          actionExistsForModule(row, action) &&
          row.override?.[action] !== null &&
          row.override?.[action] !== undefined
      );
      const reason = (row.reason ?? "").trim();
      const expires_at = (row.expires_at ?? "").trim();
      const hasMeta = Boolean(reason || expires_at);

      if (!hasAnyOverride && !hasMeta) {
        payload.push({ module_id: row.module_id });
        return;
      }

      const item = { module_id: row.module_id };
      ALL_ACTIONS.forEach((action) => {
        if (!actionExistsForModule(row, action)) return;
        item[action] = row.override?.[action] ?? null;
      });
      if (reason) item.reason = reason;
      if (expires_at) item.expires_at = expires_at;
      payload.push(item);
    });

    return payload;
  }, []);

  const handleSave = async () => {
    if (!staffId || modules.length === 0) return;
    const payload = buildSavePayload(modules, initialModulesRef.current);
    if (payload.length === 0) {
      setErrorMsg("No changes to save.");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await axios.put(`${baseURL}/api/staff-permissions/${staffId}`, payload);
      setSuccessMsg("Staff permissions saved successfully.");
      const { data } = await axios.get(
        `${baseURL}/api/staff-permissions/${staffId}`
      );
      setStaffInfo(data?.staff ?? null);
      const rows = Array.isArray(data?.data) ? data.data : [];
      applyPermissionRows(rows);
    } catch (error) {
      console.error("Failed to save staff permissions", error);
      setErrorMsg(
        error.response?.data?.message || "Failed to save staff permissions."
      );
    } finally {
      setSaving(false);
    }
  };

  const selectedStaffFromList = staffList.find(
    (s) => String(s.id) === String(staffId)
  );

  const bannerName =
    staffInfo?.name ||
    (staffInfo ? staffDisplayName(staffInfo) : null) ||
    (selectedStaffFromList ? staffDisplayName(selectedStaffFromList) : null);

  const bannerRole = staffInfo?.role?.role_name;

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:shield-user-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title mb-0">Personal Access Permission</h5>
            </div>
          </div>
        </div>
        <div className="card-body">
          {errorMsg && (
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success" role="alert">
              {successMsg}
            </div>
          )}

          <div className="chfi-root staff-perm-filters">
            <div className="staff-perm-filter-item">
              <label className="form-label" htmlFor="staff-perm-department">
                <span className="label-dot" />
                Department
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:buildings-2-bold-duotone" width="18" />
                </span>
                <select
                  id="staff-perm-department"
                  className="form-select"
                  value={departmentId}
                  onChange={handleDepartmentChange}
                  aria-label="Filter by department"
                >
                  <option value="">All departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.department_name ?? d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="staff-perm-filter-item">
              <label className="form-label" htmlFor="staff-perm-designation">
                <span className="label-dot" />
                Designation
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:user-id-bold-duotone" width="18" />
                </span>
                <select
                  id="staff-perm-designation"
                  className="form-select"
                  value={designationId}
                  onChange={handleDesignationChange}
                  aria-label="Filter by designation"
                >
                  <option value="">All designations</option>
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.designation_name ?? d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="staff-perm-filter-item">
              <label className="form-label" htmlFor="staff-perm-staff">
                <span className="label-dot" />
                Select Staff
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:users-group-rounded-bold-duotone" width="18" />
                </span>
                <select
                  id="staff-perm-staff"
                  className="form-select"
                  aria-label="Select staff"
                  value={staffId}
                  onChange={handleStaffChange}
                  disabled={loadingStaff}
                >
                  <option value="">
                    {loadingStaff ? "Loading staff..." : "Select staff"}
                  </option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {staffDisplayName(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {bannerName && (
            <div className="staff-perm-profile">
              <div className="staff-perm-profile__icon" aria-hidden="true">
                <Icon icon="solar:user-circle-bold-duotone" width="28" />
              </div>
              <p className="staff-perm-profile__line mb-0">
                <span className="staff-perm-profile__name">{bannerName}</span>
                {bannerRole && (
                  <>
                    <span className="staff-perm-profile__sep" aria-hidden="true">
                      ·
                    </span>
                    <span className="staff-perm-profile__role">{bannerRole}</span>
                  </>
                )}
                {(staffInfo?.email || selectedStaffFromList?.email) && (
                  <>
                    <span className="staff-perm-profile__sep" aria-hidden="true">
                      ·
                    </span>
                    <span className="staff-perm-profile__email">
                      {staffInfo?.email ?? selectedStaffFromList?.email}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          {loading && (
            <p className="text-muted mb-0">Loading permissions...</p>
          )}

          {!loading && staffId && modules.length > 0 && (
            <div className="report-table-wrap">
              <table className="table report-table mb-0 staff-perm-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Group</th>
                    <th className="staff-perm-reason-col">Reason</th>
                    <th>Expires</th>
                    {ALL_ACTIONS.map((action) => (
                      <th key={action} className="text-center">
                        {actionLabel(action)}
                      </th>
                    ))}
                    <th className="text-center">Clear</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((row) => (
                    <tr
                      key={row.module_id}
                      className={row.override_active ? "staff-perm-row-override" : ""}
                    >
                      <td>
                        <div className="fw-semibold">{row.module_name}</div>
                        <small className="text-muted">{row.module_key}</small>
                      </td>
                      <td>{row.group_name ?? "—"}</td>
                      <td className="staff-perm-reason-col">
                        <input
                          type="text"
                          inputMode="text"
                          autoComplete="off"
                          className="form-control form-control-sm staff-perm-reason-input"
                          placeholder={REASON_PLACEHOLDER}
                          size={REASON_INPUT_SIZE}
                          style={{ width: `${REASON_INPUT_SIZE}ch` }}
                          value={
                            row.reason != null && row.reason !== ""
                              ? String(row.reason)
                              : ""
                          }
                          onChange={(e) =>
                            updateRowMeta(row.module_id, "reason", e.target.value)
                          }
                          aria-label={`Reason for ${row.module_name}`}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={row.expires_at ?? ""}
                          onChange={(e) =>
                            updateRowMeta(
                              row.module_id,
                              "expires_at",
                              e.target.value
                            )
                          }
                          aria-label={`Expires for ${row.module_name}`}
                        />
                      </td>
                      {ALL_ACTIONS.map((action) => (
                        <td
                          key={`${row.module_id}-${action}`}
                          className="text-center align-middle"
                        >
                          {actionExistsForModule(row, action) ? (
                            <input
                              type="checkbox"
                              className="form-check-input m-0"
                              checked={Boolean(row.effective?.[action])}
                              onChange={() =>
                                togglePermission(row.module_id, action)
                              }
                              aria-label={`${row.module_name} ${action}`}
                            />
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                      ))}
                      <td className="text-center align-middle">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => clearRowOverrides(row.module_id)}
                          title="Clear overrides for this module"
                        >
                          Reset
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && staffId && modules.length > 0 && (
            <div className="mt-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Permissions"}
              </button>
            </div>
          )}

          {!loading && staffId && modules.length === 0 && !errorMsg && (
            <p className="text-muted mb-0">
              No modules found for this staff member.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonalPermission;
