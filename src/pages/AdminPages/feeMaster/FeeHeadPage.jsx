import React, { useEffect, useMemo, useState } from "react";
import DepartmentAndDesignation from "../../../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../../../components/GenericTable";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";

const FeeHeadPage = () => {
  const [banks, setBanks] = useState([]);
  const [initialValues, setInitialValues] = useState({
    fee_head_name: "",
    bank_id: "",
    is_refundable: "",
    status: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/banks`);
        setBanks(res.data.data || res.data || []);
      } catch (error) {
        setErrorMsg("Failed to load bank list. Please try again later.");
      }
    };

    fetchBanks();
  }, []);

  const initialFields = useMemo(
    () => [
      {
        name: "fee_head_name",
        label: "Fee Head",
        type: "text",
        required: true,
        placeholder: "Enter fee head",
        icon: "solar:tag-price-bold-duotone",
      },
      {
        name: "bank_id",
        label: "Bank",
        type: "select",
        required: true,
        icon: "solar:card-bold-duotone",
        options: banks.map((bank) => ({
          value: String(bank.id),
          label: `${bank.bank_name}${bank.short_name ? ` (${bank.short_name})` : ""}`,
        })),
      },
      {
        name: "is_refundable",
        label: "Is Refundable",
        type: "select",
        required: true,
        icon: "solar:refresh-circle-bold-duotone",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
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
    ],
    [banks]
  );

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post(`${baseURL}/api/fee-heads`, values);
      setSuccessMsg("Fee head added successfully!");
      setInitialValues({
        fee_head_name: "",
        bank_id: "",
        is_refundable: "",
        status: "",
      });
      setTableRefreshKey((prev) => prev + 1);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong"
      );
    }
  };

  const handleReset = () => {
    setInitialValues({
      fee_head_name: "",
      bank_id: "",
      is_refundable: "",
      status: "",
    });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/fee-heads/${id}`);
      alert("Fee head is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit fee head:", id);
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
        cardTitle="Fee Head"
        cardIcon="solar:wallet-money-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Fee Heads"
        url={`${baseURL}/api/fee-heads`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "fee_head_name", title: "Fee Head" },
          { data: "bank.bank_name", title: "Bank Name" },
          { data: "is_refundable", title: "Is Refundable" },
          { data: "status", title: "Status" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Fee Head">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Fee Head">Delete</button>
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

export default FeeHeadPage;
