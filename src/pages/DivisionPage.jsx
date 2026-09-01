import React from "react";
import DepartmentAndDesignation from "../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../components/GenericTable";
import axios from "axios";
import baseURL from "../utils/baseUrl";
import { useState } from "react";

const DivisionPage = () => {
  const [initialValues, setInitialValues] = useState({
    division_name: "",
    division_code: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "division_name",
      label: "Division Name",
      type: "text",
      required: true,
      placeholder: "e.g. Division A",
      icon: "solar:notebook-bookmark-bold-duotone",
    },
    {
      name: "division_code",
      label: "Division Code",
      type: "text",
      required: true,
      placeholder: "e.g. DIV-A",
      icon: "solar:hashtag-square-bold-duotone",
    },
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(`${baseURL}/api/divisions`, values);
      setSuccessMsg("Division added successfully!");
      setInitialValues({ division_name: "", division_code: "" });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({ division_name: "", division_code: "" });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/divisions/${id}`);
      alert("Division is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit division:", id);
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
        cardTitle="Division"
        cardIcon="solar:layers-minimalistic-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Divisions"
        url={`${baseURL}/api/divisions`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "division_name", name: "division_name", title: "Division Name" },
          { data: "division_code", name: "division_code", title: "Division Code" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Division">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Division">Delete</button>
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

export default DivisionPage;
