import { Fragment, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/showAllError.css";

const API_PATH = "/api/error/error-check";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.errors)) return payload.errors;
  return [];
};

const statusClass = (code) => {
  if (code == null || code === "") return "error-code-unknown";
  const n = Number(code);
  if (n >= 500) return "error-code-5xx";
  if (n >= 400) return "error-code-4xx";
  if (n >= 200 && n < 400) return "error-code-2xx";
  return "error-code-unknown";
};

const formatDate = (value) => {
  if (value == null || value === "") return "—";
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return String(value);
  }
};

const ShowAllError = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const { data } = await axios.get(`${baseURL}${API_PATH}`);
      setRows(normalizeList(data));
    } catch (err) {
      console.error("Error log fetch failed:", err);
      setFetchError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load error log."
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRow = (id) => {
    setExpandedId((cur) => (cur === id ? null : id));
  };

  return (
    <div className="error-log-scope pb-4">
      <div className="error-log-hero d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex gap-2 align-items-center min-w-0">
          <span
            className="error-log-hero-icon d-inline-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
            aria-hidden
          >
            <Icon
              icon="solar:danger-triangle-bold-duotone"
              className="fs-4"
            />
          </span>
          <div className="min-w-0">
            <h6 className="mb-0">Error log</h6>
            <p>
              Server-side errors captured for debugging. Expand a row to view
              stack trace and request body.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn error-log-refresh btn-sm rounded-pill px-2 px-sm-3 d-inline-flex align-items-center gap-1 shadow-sm"
          onClick={load}
          disabled={loading}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm error-spin"
              role="status"
              aria-hidden
            />
          ) : (
            <Icon icon="solar:refresh-bold-duotone" className="fs-6" />
          )}
          Refresh
        </button>
      </div>

      {fetchError && (
        <div
          className="alert alert-danger d-flex align-items-center gap-2 mb-3 rounded-3 border-0 shadow-sm"
          role="alert"
        >
          <Icon icon="solar:close-circle-bold" className="fs-4 flex-shrink-0" />
          <div>{fetchError}</div>
        </div>
      )}

      <div className="error-log-card">
        {loading && rows.length === 0 && !fetchError ? (
          <div className="error-state-panel">
            <div className="error-state-icon">
              <span
                className="spinner-border error-spin"
                style={{ width: "2.5rem", height: "2.5rem" }}
                role="status"
              />
            </div>
            <p className="error-state-title mb-0">Loading errors…</p>
          </div>
        ) : !loading && rows.length === 0 && !fetchError ? (
          <div className="error-state-panel">
            <div className="error-state-icon">
              <Icon icon="solar:check-read-bold-duotone" />
            </div>
            <p className="error-state-title">No errors recorded</p>
            <p className="mb-0 small">The log is empty for this endpoint.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table error-log-table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Method</th>
                  <th scope="col">URL</th>
                  <th scope="col" className="d-none d-lg-table-cell">
                    When
                  </th>
                  <th scope="col" className="cell-message">
                    Message
                  </th>
                  <th scope="col" className="text-end" style={{ width: 56 }}>
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const id = row?.id ?? row?._id;
                  const isOpen = expandedId === id;
                  return (
                    <Fragment key={id}>
                      <tr>
                        <td>
                          <span className="text-secondary font-monospace small">
                            #{id}
                          </span>
                        </td>
                        <td>
                          {row?.type ? (
                            <span className="error-pill error-pill-type">
                              <Icon
                                icon="solar:bug-minimalistic-bold-duotone"
                                className="fs-6"
                              />
                              {row.type}
                            </span>
                          ) : (
                            <span className="text-secondary">—</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge error-status-badge ${statusClass(
                              row?.status_code
                            )}`}
                          >
                            {row?.status_code != null
                              ? row.status_code
                              : "—"}
                          </span>
                        </td>
                        <td>
                          {row?.method ? (
                            <span className="error-pill error-pill-method">
                              {row.method}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          {row?.url != null && row.url !== "" ? (
                            <div className="error-url-path">{row.url}</div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="d-none d-lg-table-cell error-time-text">
                          <span className="d-inline-flex align-items-center gap-1">
                            <Icon
                              icon="solar:calendar-bold-duotone"
                              className="fs-5 opacity-50"
                            />
                            {formatDate(row?.created_at)}
                          </span>
                        </td>
                        <td className="cell-message">
                          <div
                            className="text-truncate-custom"
                            title={row?.message || ""}
                          >
                            {row?.message != null && row.message !== ""
                              ? row.message
                              : "—"}
                          </div>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="error-expand-btn"
                            onClick={() => toggleRow(id)}
                            aria-expanded={isOpen}
                            aria-label={isOpen ? "Hide details" : "Show details"}
                            title={isOpen ? "Hide details" : "Stack & body"}
                          >
                            <Icon
                              icon={
                                isOpen
                                  ? "solar:alt-arrow-up-bold"
                                  : "solar:alt-arrow-down-bold"
                              }
                              className="fs-5"
                            />
                          </button>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="error-detail-row">
                          <td colSpan={8}>
                            <div className="error-detail-inner">
                              <div className="error-detail-block">
                                <div className="error-detail-label">
                                  <Icon
                                    icon="solar:letter-bold-duotone"
                                    className="fs-5"
                                  />
                                  Full message
                                </div>
                                <pre className="error-stack-pre mb-0">
                                  {row?.message != null && row.message !== ""
                                    ? row.message
                                    : "—"}
                                </pre>
                              </div>
                              <div className="error-detail-block">
                                <div className="error-detail-label">
                                  <Icon
                                    icon="solar:code-square-bold-duotone"
                                    className="fs-5"
                                  />
                                  Stack trace
                                </div>
                                {row?.stack != null && row.stack !== "" ? (
                                  <pre className="error-stack-pre">
                                    {row.stack}
                                  </pre>
                                ) : (
                                  <p className="error-body-null mb-0">No stack trace.</p>
                                )}
                              </div>
                              <div className="error-detail-block">
                                <div className="error-detail-label">
                                  <Icon
                                    icon="solar:document-text-bold-duotone"
                                    className="fs-5"
                                  />
                                  Request body
                                </div>
                                {row?.body == null ? (
                                  <p className="error-body-null mb-0">null</p>
                                ) : typeof row.body === "object" ? (
                                  <pre className="error-body-pre">
                                    {JSON.stringify(row.body, null, 2)}
                                  </pre>
                                ) : (
                                  <pre className="error-body-pre">
                                    {String(row.body)}
                                  </pre>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllError;
