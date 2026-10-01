import React, { useMemo, useState } from "react";
import DepartmentAndDesignation from "../../../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../../../components/GenericTable";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";

const ALLOWED_ACTIONS = [
  "display",
  "add",
  "edit",
  "delete",
  "view",
  "import",
  "export",
];

const emptyActionValues = Object.fromEntries(
  ALLOWED_ACTIONS.map((key) => [`action_${key}`, false])
);

const emptyValues = {
  module_key: "",
  module_name: "",
  group_name: "",
  sort_order: "",
  is_active: "true",
  ...emptyActionValues,
};

const buildAllowedActionsString = (values) =>
  ALLOWED_ACTIONS.filter((key) => values[`action_${key}`]).join(",");

const ModuleMaster = () => {
  const [initialValues, setInitialValues] = useState(emptyValues);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = useMemo(() => {
    return [
      {
        name: "module_key",
        label: "Module Key",
        type: "text",
        required: true,
        placeholder: "e.g. library",
        icon: "solar:key-bold-duotone",
      },
      {
        name: "module_name",
        label: "Module Name",
        type: "text",
        required: true,
        placeholder: "e.g. Library",
        icon: "solar:widget-5-bold-duotone",
      },
      {
        name: "group_name",
        label: "Group Name",
        type: "text",
        required: true,
        placeholder: "e.g. Masters",
        icon: "solar:folder-with-files-bold-duotone",
      },
      {
        name: "sort_order",
        label: "Sort Order",
        type: "number",
        required: true,
        placeholder: "e.g. 7",
        icon: "solar:sort-vertical-bold-duotone",
        min: 0,
      },
      {
        name: "allowed_actions_group",
        label: "Allowed Actions",
        type: "checkboxGroup",
        required: false,
        options: ALLOWED_ACTIONS.map((key) => ({
          name: `action_${key}`,
          label: key.charAt(0).toUpperCase() + key.slice(1),
        })),
      },
      {
        name: "is_active",
        label: "Active",
        type: "select",
        required: true,
        icon: "solar:check-circle-bold-duotone",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
      },
    ];
  }, []);

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");

    const allowed_actions = buildAllowedActionsString(values);
    if (!allowed_actions) {
      setErrorMsg("Select at least one allowed action.");
      return;
    }

    try {
      const payload = {
        module_key: values.module_key.trim(),
        module_name: values.module_name.trim(),
        group_name: values.group_name.trim(),
        parent_id: null,
        sort_order: Number(values.sort_order),
        allowed_actions,
        is_active: values.is_active === "true",
      };
      await axios.post(`${baseURL}/api/modules`, payload);
      setSuccessMsg("Module added successfully!");
      setInitialValues(emptyValues);
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues(emptyValues);
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/modules/${id}`);
      alert("Module deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit module:", id);
  };

  const formatBool = (value) => (value ? "Yes" : "No");

  return (
    <div>
      <DepartmentAndDesignation
        initialFields={initialFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButtonText="Save"
        resetButtonText="Reset"
        handleReset={handleReset}
        successMsg={successMsg}
        errorMsg={errorMsg}
        setSuccessMsg={setSuccessMsg}
        setErrorMsg={setErrorMsg}
        cardTitle="Module"
        cardIcon="solar:layers-minimalistic-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Modules"
        url={`${baseURL}/api/modules`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "module_key", title: "Module Key" },
          { data: "module_name", title: "Module Name" },
          { data: "group_name", title: "Group" },
          { data: "sort_order", title: "Sort Order" },
          { data: "allowed_actions", title: "Allowed Actions" },
          {
            data: "is_active",
            title: "Active",
            render: (data) => formatBool(data),
          },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Module">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Module">Delete</button>
                </div>
              `;
            },
          },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ModuleMaster;
