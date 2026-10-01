import React, { useState } from "react";
import DepartmentAndDesignation from "../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../components/GenericTable";
import axios from "axios";
import baseURL from "../utils/baseUrl";

const emptyValues = {
  role_name: "",
  description: "",
  is_super_admin: "false",
  is_active: "true",
};

const RolePage = () => {
  const [initialValues, setInitialValues] = useState(emptyValues);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "role_name",
      label: "Role Name",
      type: "text",
      required: true,
      placeholder: "e.g. Librarian",
      icon: "solar:user-id-bold-duotone",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: false,
      placeholder: "e.g. Manages library",
      rows: 3,
    },
    {
      name: "is_super_admin",
      label: "Super Admin",
      type: "select",
      required: true,
      icon: "solar:shield-user-bold-duotone",
      options: [
        { value: "false", label: "No" },
        { value: "true", label: "Yes" },
      ],
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

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = {
        role_name: values.role_name.trim(),
        description: values.description?.trim() ?? "",
        is_super_admin: values.is_super_admin === "true",
        is_active: values.is_active === "true",
      };
      await axios.post(`${baseURL}/api/access-roles`, payload);
      setSuccessMsg("Role added successfully!");
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
      await axios.delete(`${baseURL}/api/access-roles/${id}`);
      alert("Role deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit access role:", id);
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
        cardTitle="Access Role"
        cardIcon="solar:shield-keyhole-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Access Roles"
        url={`${baseURL}/api/access-roles`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "role_name", title: "Role Name" },
          { data: "description", title: "Description" },
          {
            data: "is_super_admin",
            title: "Super Admin",
            render: (data) => formatBool(data),
          },
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
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Role">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Role">Delete</button>
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

export default RolePage;
