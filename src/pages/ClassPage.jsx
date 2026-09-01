import React from "react";
import DepartmentAndDesignation from "../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../components/GenericTable";
import axios from "axios";
import baseURL from "../utils/baseUrl";
import { useState } from "react";

const ClassPage = () => {
  const [initialValues, setInitialValues] = useState({
    class_name: "",
    class_code: "",
    status: "1",
    admission_form_fee: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "class_name",
      label: "Class Name",
      type: "text",
      required: true,
      placeholder: "e.g. Class 10 - A",
      icon: "solar:notebook-bookmark-bold-duotone",
    },
    {
      name: "class_code",
      label: "Class Code",
      type: "text",
      required: true,
      placeholder: "e.g. CLS-10A",
      icon: "solar:hashtag-square-bold-duotone",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      icon: "solar:shield-check-bold-duotone",
      options: [
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" },
      ],
    },
    {
      name: "admission_form_fee",
      label: "Admission Form Fee",
      type: "number",
      required: true,
      min: 0,
      placeholder: "e.g. 500",
      icon: "solar:wallet-money-bold-duotone",
    },
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = {
        ...values,
        status: Number(values.status),
        admission_form_fee: Number(values.admission_form_fee),
      };
      await axios.post(`${baseURL}/api/classes`, payload);
      setSuccessMsg("Class added successfully!");
      setInitialValues({
        class_name: "",
        class_code: "",
        status: "1",
        admission_form_fee: "",
      });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({
      class_name: "",
      class_code: "",
      status: "1",
      admission_form_fee: "",
    });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");

    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/classes/${id}`);
      alert("Class is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit class:", id);
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
        cardTitle="Class"
        cardIcon="solar:square-academic-cap-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        url={`${baseURL}/api/classes`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "class_name", name: "class_name", title: "Class Name" },
          { data: "class_code", name: "class_code", title: "Class Code" },
          { data: "admission_form_fee", name: "admission_form_fee", title: "Fee" },
          {
            data: "status",
            name: "status",
            title: "Status",
            render: (data, type) => {
              if (type !== "display") return data;
              const isActive = data === true || data === 1 || data === "1";
              return isActive ? "Active" : "Inactive";
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
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Class">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Class">Delete</button>
                </div>
              `;
            },
          },
        ]}
        pageName="Classes"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ClassPage;
