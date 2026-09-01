import React from "react";
import DepartmentAndDesignation from "../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../components/GenericTable";
import axios from "axios";
import baseURL from "../utils/baseUrl";
import { useState } from "react";

const PhisallyDisablePage = () => {
  const [initialValues, setInitialValues] = useState({ value: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "value",
      label: "Disability Name",
      type: "text",
      required: true,
      placeholder: "Enter disability name",
      icon: "solar:accessibility-bold-duotone",
    },
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(`${baseURL}/api/physically-disable`, { value: values.value });
      setSuccessMsg("Disability added successfully!");
      setInitialValues({ value: "" });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({ value: "" });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/physically-disable/${id}`);
      alert("Physically disable is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit physically disable:", id);
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
        cardTitle="Disability"
        cardIcon="solar:accessibility-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Physically Disable"
        url={`${baseURL}/api/physically-disable`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "value", title: "Disabiltiy" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Disability">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Disability">Delete</button>
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

export default PhisallyDisablePage;
