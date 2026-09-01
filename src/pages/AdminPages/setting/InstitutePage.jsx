import React from "react";
import DepartmentAndDesignation from "../../../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../../../components/GenericTable";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import { useState } from "react";

const InstitutePage = () => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    code: "",
    support_statement: "",
    logo: null,
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "name",
      label: "Institute Name",
      type: "text",
      required: true,
      placeholder: "Enter institute name",
      icon: "solar:buildings-3-bold-duotone",
    },
    {
      name: "code",
      label: "Institute Code",
      type: "text",
      required: true,
      placeholder: "Enter institute code",
      icon: "solar:hashtag-bold-duotone",
    },
    {
      name: "support_statement",
      label: "Support Statement",
      type: "textarea",
      placeholder: "Enter support statement",
      rows: 4,
    },
    {
      name: "logo",
      label: "Institute Logo",
      type: "file",
      required: true,
      accept: "image/*",
      icon: "solar:gallery-bold-duotone",
    },
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("code", values.code);
      formData.append("support_statement", values.support_statement);
      formData.append("logo", values.logo);

      await axios.post(`${baseURL}/api/institute`, formData);
      setSuccessMsg("Institute added successfully!");
      setInitialValues({
        name: "",
        code: "",
        support_statement: "",
        logo: null,
      });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({
      name: "",
      code: "",
      support_statement: "",
      logo: null,
    });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/institute/${id}`);
      alert("Institute is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit institute:", id);
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
        cardTitle="Institute"
        cardIcon="solar:buildings-3-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Institutes"
        url={`${baseURL}/api/institute`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "name", title: "Name" },
          { data: "code", title: "Code" },
          { data: "support_statement", title: "Support Statement" },
          {
            data: "logo",
            title: "Logo",
            orderable: false,
            searchable: false,
            render: (data, type) => {
              if (type !== "display") return data;
              if (!data) return '<span class="table-cell-empty">No logo</span>';
              const src = data.startsWith("http") ? data : `${baseURL}${data}`;
              return `<img src="${src}" class="table-cell-thumb" alt="Institute logo" />`;
            },
          },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Institute">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Institute">Delete</button>
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

export default InstitutePage;
