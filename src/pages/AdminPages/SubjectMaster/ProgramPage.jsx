import React from "react";
import DepartmentAndDesignation from "../../../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../../../components/GenericTable";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import { useState } from "react";

const ProgramPage = () => {
  const [initialValues, setInitialValues] = useState({ program_name: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "program_name",
      label: "Program Name",
      type: "text",
      required: true,
      placeholder: "Enter Program Name",
      icon: "solar:diploma-bold-duotone",
    },
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(`${baseURL}/api/programs`, values);
      setSuccessMsg("Program added successfully!");
      setInitialValues({ program_name: "" });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({ program_name: "" });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/programs/${id}`);
      alert("Program is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit program:", id);
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
        cardTitle="Program"
        cardIcon="solar:diploma-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Programs"
        url={`${baseURL}/api/programs`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "program_name", title: "Program Name" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Program">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Program">Delete</button>
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

export default ProgramPage;
