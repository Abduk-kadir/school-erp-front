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

const ExamnamePage = () => {
  const [initialValues, setInitialValues] = useState({
    exam_name: "",
    
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "exam_name",
      label: "Exam Name",
      type: "text",
      required: true,
      placeholder: "e.g. Unit Test 1",
      icon: "solar:document-text-bold-duotone",
    },
   
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = {
        ...values,
      };
      await axios.post(`${baseURL}/api/exam-names`, payload, {
        headers: authHeaders(),
      });
      setSuccessMsg("Exam name added successfully!");
      setInitialValues({
        exam_name: "",
      });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({
      exam_name: "",
    });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");

    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/exam-names/${id}`, {
        headers: authHeaders(),
      });
      alert("Exam name is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit exam name:", id);
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
        cardTitle="Exam Name"
        cardIcon="solar:square-academic-cap-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        url={`${baseURL}/api/exam-names`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "exam_name", name: "exam_name", title: "Exam Name" },
          
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Exam Name">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Exam Name">Delete</button>
                </div>
              `;
            },
          },
        ]}
        pageName="Exam Names"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ExamnamePage;
