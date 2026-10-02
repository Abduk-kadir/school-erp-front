import React, { useEffect, useState } from "react";
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
  "is_assign_permissions"
  
];

const actionLabel = (key) => key.charAt(0).toUpperCase() + key.slice(1);

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function RolePermission() {
  const [roles, setRoles] = useState([]);
  const [roleid, setRoleid] = useState("");
  const [roleInfo, setRoleInfo] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/access-roles`);
        setRoles(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Failed to load roles", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!roleid) {
      setRoleInfo(null);
      setModules([]);
      setErrorMsg("");
      return;
    }

    const fetchPermissions = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const { data } = await axios.get(
          `${baseURL}/api/role-permissions/${roleid}`
        );
        setRoleInfo(data?.role ?? null);
        setModules(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Failed to load role permissions", error);
        setRoleInfo(null);
        setModules([]);
        setErrorMsg(
          error.response?.data?.message ||
            "Failed to load permissions for this role."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [roleid]);

  const isActionApplicable = (moduleRow, action) => {
    if (!moduleRow.allowed_actions?.includes(action)) return false;
    if (moduleRow.permissions?.[action] === null) return false;
    return true;
  };

  const handleRoleChange = (e) => {
    setSuccessMsg("");
    setRoleid(e.target.value);
  };

  const buildSavePayload = (rows) =>
    rows.map((row) => {
      const item = { module_id: row.module_id };
      ALL_ACTIONS.forEach((action) => {
        if (isActionApplicable(row, action)) {
          item[action] = Boolean(row.permissions?.[action]);
        }
      });
      return item;
    });

  const handleSave = async () => {
    if (!roleid || modules.length === 0) return;
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const payload = buildSavePayload(modules);
      await axios.put(`${baseURL}/api/role-permissions/${roleid}`, payload, {
        headers: authHeaders(),
      });
      setSuccessMsg("Role permissions saved successfully.");
    } catch (error) {
      console.error("Failed to save role permissions", error);
      setErrorMsg(
        error.response?.data?.message || "Failed to save role permissions."
      );
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (moduleId, action) => {
    setModules((prev) =>
      prev.map((row) => {
        if (row.module_id !== moduleId) return row;
        if (!isActionApplicable(row, action)) return row;
        return {
          ...row,
          permissions: {
            ...row.permissions,
            [action]: !row.permissions[action],
          },
        };
      })
    );
  };

  return (
    <div className="chfi-wrapper mb-3">
      <div className="chfi-card">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:shield-keyhole-bold-duotone" width="24" />
            </span>
            <div>
              <h5 className="card-title mb-0">Role Access Permission</h5>
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

          <div className="chfi-root role-perm-filters">
            <div className="staff-perm-filter-item">
              <label className="form-label" htmlFor="role-perm-select">
                <span className="label-dot" />
                Select Role
              </label>
              <div className="icon-field">
                <span className="icon">
                  <Icon icon="solar:user-check-rounded-bold-duotone" width="18" />
                </span>
                <select
                  id="role-perm-select"
                  className="form-select"
                  aria-label="Select role"
                  value={roleid}
                  onChange={handleRoleChange}
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {roleInfo && (
            <div className="staff-perm-profile role-perm-profile">
              <div
                className="staff-perm-profile__icon role-perm-profile__icon"
                aria-hidden="true"
              >
                <Icon icon="solar:shield-user-bold-duotone" width="28" />
              </div>
              <p className="staff-perm-profile__line mb-0">
                <span className="staff-perm-profile__name">
                  {roleInfo.role_name}
                </span>
                {roleInfo.is_super_admin != null && (
                  <>
                    <span className="staff-perm-profile__sep" aria-hidden="true">
                      ·
                    </span>
                    <span className="staff-perm-profile__role">
                      Super admin: {roleInfo.is_super_admin ? "Yes" : "No"}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          {loading && (
            <p className="text-muted mb-0">Loading permissions...</p>
          )}

          {!loading && roleid && modules.length > 0 && (
            <div className="report-table-wrap">
              <table className="table report-table mb-0">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Group</th>
                    {ALL_ACTIONS.map((action) => (
                      <th key={action} className="text-center">
                        {actionLabel(action)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modules.map((row) => (
                    <tr key={row.module_id}>
                      <td>
                        <div className="fw-semibold">{row.module_name}</div>
                        <small className="text-muted">{row.module_key}</small>
                      </td>
                      <td>{row.group_name ?? "—"}</td>
                      {ALL_ACTIONS.map((action) => (
                        <td key={`${row.module_id}-${action}`} className="text-center">
                          {isActionApplicable(row, action) ? (
                            <input
                              type="checkbox"
                              className="form-check-input m-0"
                              checked={Boolean(row.permissions?.[action])}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && roleid && modules.length > 0 && (
            <div className="chfi-root mt-3">
              <button
                type="button"
                className="btn btn-submit"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Permissions"}
              </button>
            </div>
          )}

          {!loading && roleid && modules.length === 0 && !errorMsg && (
            <p className="text-muted mb-0">No modules found for this role.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RolePermission;
