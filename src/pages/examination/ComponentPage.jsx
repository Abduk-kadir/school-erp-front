import React from "react";
import DepartmentAndDesignation from "../../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../../components/GenericTable";
import axios from "axios";
import baseURL from "../../utils/baseUrl";
import { useState } from "react";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ComponentPage = () => {
  const [initialValues, setInitialValues] = useState({
    component_name: "",
    type: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "component_name",
      label: "Component Name",
      type: "text",
      required: true,
      placeholder: "e.g. F1/Theory",
      icon: "solar:notebook-bookmark-bold-duotone",
    },
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      placeholder: "Select Type",
      icon: "solar:tag-bold-duotone",
      options: [
        { label: "Head", value: "Head" },
        { label: "Sub Head", value: "Sub Head" },
      ],
    },
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = {
        ...values,
      };
      await axios.post(`${baseURL}/api/components`, payload, {
        headers: authHeaders(),
      });
      setSuccessMsg("Component added successfully!");
      setInitialValues({
        component_name: "",
        type: "",
      });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({
      component_name: "",
      type: "",
    });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");

    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/components/${id}`, {
        headers: authHeaders(),
      });
      alert("Component is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit component:", id);
  };

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
        cardTitle="Component"
        cardIcon="solar:square-academic-cap-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        url={`${baseURL}/api/components`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "component_name", name: "component_name", title: "Component Name" },
          { data: "type", name: "type", title: "Type" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Component">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Component">Delete</button>
                </div>
              `;
            },
          },
        ]}
        pageName="Components"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ComponentPage;
