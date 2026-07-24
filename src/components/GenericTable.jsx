import { useEffect, useState, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../assets/css/academicOfflineFeeReport.css";
import "../assets/css/editdelete.css";
import DocumentViewer from "./child/DocumentViewer";
import baseURL from "../utils/baseUrl";

const buildFileUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${baseURL}${path}`;
};

const GenericTableDataLayer = ({
  url,
  columns,
  title = "Default Data Tables",
  pageName,
  onEdit,
  onDelete,
  onAssignClass,
}) => {
  const [viewUrl, setViewUrl] = useState(null);
  const tableRef = useRef(null);
  const datatableRef = useRef(null);
  const callbacksRef = useRef({ onEdit, onDelete, onAssignClass });

  useEffect(() => {
    callbacksRef.current = { onEdit, onDelete, onAssignClass };
  }, [onEdit, onDelete, onAssignClass]);

  useEffect(() => {
    if (!tableRef.current) return;

    const $table = $(tableRef.current);

    datatableRef.current = $table.DataTable({
      pageLength: 5,
      processing: true,
      serverSide: true,
      destroy: true,
      ajax: {
        url,
        type: "GET",
      },
      columns,
    });

    $table.on("click", ".table-action-view-document", function () {
      const documentUrl = $(this).attr("data-id");
      if (!documentUrl) return;
      setViewUrl(buildFileUrl(documentUrl));
    });

    $table.on("click", ".table-action-edit", function () {
      const id = $(this).data("id");
      callbacksRef.current.onEdit?.(id);
    });

    $table.on("click", ".table-action-delete", function () {
      const id = $(this).data("id");
      callbacksRef.current.onDelete?.(id, datatableRef.current);
    });

    $table.on("click", ".table-action-assign-class", function () {
      const id = $(this).data("id");
      callbacksRef.current.onAssignClass?.(id, datatableRef.current);
    });

    return () => {
      $table.off("click", ".table-action-view-document");
      $table.off("click", ".table-action-edit");
      $table.off("click", ".table-action-delete");
      $table.off("click", ".table-action-assign-class");
      if (datatableRef.current) {
        // Keep the <table> node so React can remount cleanly next time
        datatableRef.current.destroy();
        datatableRef.current = null;
      }
    };
  }, [url, columns]);

  return (
    <div className="chfi-wrapper">
      <section className="chfi-card report-table-card" aria-label="Data table">
        <div className="card-header">
          <div className="header-row">
            <span className="header-icon">
              <Icon icon="solar:document-text-bold-duotone" width="22" />
            </span>
            <div>
              <h5 className="card-title">{pageName || title}</h5>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="report-table-wrap">
            <table
              className="table report-table mb-0"
              ref={tableRef}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </section>
      <DocumentViewer
        url={viewUrl}
        show={!!viewUrl}
        onClose={() => setViewUrl(null)}
      />
    </div>
  );
};

export default GenericTableDataLayer;
