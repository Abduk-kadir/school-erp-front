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

const AssesmentTypePage = () => {
  const [initialValues, setInitialValues] = useState({
    group: "",
    
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "group",
      label: "Assessment type",
      type: "text",
      required: true,
      placeholder: "Enter assessment type",
      icon: "solar:square-academic-cap-bold-duotone",
    },
   
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = {
        ...values,
      };
      await axios.post(`${baseURL}/api/assessment-groups`, payload, {
        headers: authHeaders(),
      });
      setSuccessMsg("Assessment type added successfully!");
      setInitialValues({
        group: "",
      });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({
      group: "",
    });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");

    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/assessment-groups/${id}`, {
        headers: authHeaders(),
      });
      alert("Assessment type is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit assessment type:", id);
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
        cardTitle="Assessment Type"
        cardIcon="solar:square-academic-cap-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        url={`${baseURL}/api/assessment-groups`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "group", name: "group", title: "Assessment Type" },
          
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Assessment Type">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Assessment Type">Delete</button>
                </div>
              `;
            },
          },
        ]}
        pageName="Assessment Types"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AssesmentTypePage;
