import React from "react";
import DepartmentAndDesignation from "../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../components/GenericTable";
import axios from "axios";
import baseURL from "../utils/baseUrl";
import { useState } from "react";

const CastPage = () => {
  const [initialValues, setInitialValues] = useState({ value: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "value",
      label: "Cast",
      type: "text",
      required: true,
      placeholder: "Enter Cast",
      icon: "solar:user-id-bold-duotone",
    },
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(`${baseURL}/api/castes`, { cast_name: values.value });
      setSuccessMsg("Cast added successfully!");
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
      await axios.delete(`${baseURL}/api/castes/${id}`);
      alert("Cast is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit cast:", id);
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
        cardTitle="Cast"
        cardIcon="solar:users-group-two-rounded-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Castes"
        url={`${baseURL}/api/castes`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "value", title: "Cast" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Cast">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Cast">Delete</button>
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

export default CastPage;
