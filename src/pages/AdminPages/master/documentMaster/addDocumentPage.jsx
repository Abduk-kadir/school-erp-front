import React from "react";
import DepartmentAndDesignation from "../../../../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../../../../components/GenericTable";
import axios from "axios";
import baseURL from "../../../../utils/baseUrl";
import { useState } from "react";

const AddDocumentPage = () => {
  const [initialValues, setInitialValues] = useState({ name: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "name",
      label: "Document Name",
      type: "text",
      required: true,
      placeholder: "Enter document name",
      icon: "solar:file-text-bold-duotone",
    },
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(`${baseURL}/api/document-types`, values);
      setSuccessMsg("Document added successfully!");
      setInitialValues({ name: "" });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({ name: "" });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/document-types/${id}`);
      alert("Document is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit document:", id);
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
        cardTitle="Document"
        cardIcon="solar:document-add-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Documents"
        url={`${baseURL}/api/document-types`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "name", title: "Document Name" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Document">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Document">Delete</button>
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

export default AddDocumentPage;
