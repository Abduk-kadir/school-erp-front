import { useEffect } from "react";
import $ from "jquery";
import "datatables.net-dt";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../assets/css/academicOfflineFeeReport.css";
import "../assets/css/editdelete.css";

const GenericTableDataLayer = ({ url, columns, title = "Default Data Tables", onEdit, onDelete,onAssignClass }) => {
  useEffect(() => {
    const table = $("#dataTable").DataTable({
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
    $("#dataTable").on("click", ".table-action-edit", function () {
      const id = $(this).data("id");
      if (onEdit) onEdit(id);
    });
  
    $("#dataTable").on("click", ".table-action-delete", function () {
      const id = $(this).data("id");
      if (onDelete) onDelete(id, table);
    });

    $("#dataTable").on("click", ".table-action-assign-class", function () {
      const id = $(this).data("id");
      if (onAssignClass) onAssignClass(id, table);
    });
    return () => {
      table.destroy(true);
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
              <h5 className="card-title">{title}</h5>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="report-table-wrap">
            <table className="table report-table mb-0" id="dataTable" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default GenericTableDataLayer;
