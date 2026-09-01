import React from "react";
import DepartmentAndDesignation from "../../../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../../../components/GenericTable";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import { useState } from "react";

const AddBankPage = () => {
  const [initialValues, setInitialValues] = useState({
    bank_name: "",
    status: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "bank_name",
      label: "Bank Name",
      type: "text",
      required: true,
      min: 2,
      placeholder: "Enter bank name",
      icon: "solar:bank-bold-duotone",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      icon: "solar:shield-check-bold-duotone",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(`${baseURL}/api/banks`, values);
      setSuccessMsg("Bank added successfully!");
      setInitialValues({ bank_name: "", status: "" });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({ bank_name: "", status: "" });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/banks/${id}`);
      alert("Bank is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit bank:", id);
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
        cardTitle="Bank"
        cardIcon="solar:bank-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Banks"
        url={`${baseURL}/api/banks`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "bank_name", title: "Bank Name" },
          { data: "status", title: "Status" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Bank">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Bank">Delete</button>
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

export default AddBankPage;
