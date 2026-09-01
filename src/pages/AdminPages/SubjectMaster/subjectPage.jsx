import React from "react";
import DepartmentAndDesignation from "../../../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../../../components/GenericTable";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import { useState } from "react";

const SubjectPage = () => {
  const [initialValues, setInitialValues] = useState({
    value: "",
    subject_code: "",
    abbreviation_name: "",
    status: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const initialFields = [
    {
      name: "value",
      label: "Subject Name",
      type: "text",
      required: true,
      placeholder: "Enter Subject Name",
      icon: "solar:notebook-bookmark-bold-duotone",
    },
    {
      name: "subject_code",
      label: "Subject Code",
      type: "text",
      required: true,
      placeholder: "Enter Subject Code",
      icon: "solar:hashtag-square-bold-duotone",
    },
    {
      name: "abbreviation_name",
      label: "Abbreviation Name",
      type: "text",
      required: true,
      placeholder: "Enter Abbreviation",
      icon: "solar:text-bold-duotone",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      icon: "solar:shield-check-bold-duotone",
      options: [
        { value: "Active", label: "Active" },
        { value: "In Active", label: "In Active" },
      ],
    },
  ];

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(`${baseURL}/api/subjects`, values);
      setSuccessMsg("Subject added successfully!");
      setInitialValues({
        value: "",
        subject_code: "",
        abbreviation_name: "",
        status: "",
      });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setInitialValues({
      value: "",
      subject_code: "",
      abbreviation_name: "",
      status: "",
    });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/subjects/${id}`);
      alert("Subject is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit subject:", id);
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
        cardTitle="Subject"
        cardIcon="solar:book-bookmark-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Subjects"
        url={`${baseURL}/api/subjects`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "value", name: "value", title: "Subject Name" },
          { data: "subject_code", name: "subject_code", title: "Subject Code" },
          { data: "abbreviation_name", name: "abbreviation_name", title: "Abbreviation Name" },
          { data: "status", name: "status", title: "Status" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Subject">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Subject">Delete</button>
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

export default SubjectPage;
