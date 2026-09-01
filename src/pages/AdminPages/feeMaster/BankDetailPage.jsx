import React, { useEffect, useMemo, useState } from "react";
import DepartmentAndDesignation from "../../../components/child/master/DepartmentAndDesignation";
import GenericTableDataLayer from "../../../components/GenericTable";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";

const BankDetailPage = () => {
  const [banks, setBanks] = useState([]);
  const [initialValues, setInitialValues] = useState({
    bank_id: "",
    ifsc_code: "",
    account_number: "",
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
        name: "bank_id",
        label: "Bank",
        type: "select",
        required: true,
        icon: "solar:bank-bold-duotone",
        options: banks.map((bank) => ({
          value: String(bank.id),
          label: `${bank.bank_name}${bank.short_name ? ` (${bank.short_name})` : ""}`,
        })),
      },
      {
        name: "ifsc_code",
        label: "IFSC Code",
        type: "text",
        required: true,
        placeholder: "e.g. HDFC0000123",
        icon: "solar:hashtag-square-bold-duotone",
      },
      {
        name: "account_number",
        label: "Account Number",
        type: "text",
        required: true,
        min: 6,
        max: 20,
        placeholder: "Enter account number",
        icon: "solar:wallet-2-bold-duotone",
      },
    ],
    [banks]
  );

  const handleSubmit = async (values) => {
    setSuccessMsg("");
    setErrorMsg("");

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(values.ifsc_code)) {
      setErrorMsg("Invalid IFSC format (e.g. SBIN0001234)");
      return;
    }

    if (!/^\d+$/.test(values.account_number)) {
      setErrorMsg("Account number must contain only numbers");
      return;
    }

    try {
      await axios.post(`${baseURL}/api/bank-details`, values);
      setSuccessMsg("Bank detail added successfully!");
      setInitialValues({ bank_id: "", ifsc_code: "", account_number: "" });
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
    setInitialValues({ bank_id: "", ifsc_code: "", account_number: "" });
    setTableRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      await axios.delete(`${baseURL}/api/bank-details/${id}`);
      alert("Bank detail is deleted successfully");
      table.ajax.reload();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit bank detail:", id);
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
        cardTitle="Bank Account Detail"
        cardIcon="solar:card-bold-duotone"
      />
      <GenericTableDataLayer
        key={tableRefreshKey}
        pageName="Bank Details"
        url={`${baseURL}/api/bank-details`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "bank.bank_name", title: "Bank Name" },
          { data: "account_number", title: "Account Number" },
          { data: "ifsc_code", title: "Ifsc code" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                <div class="table-action-group">
                  <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Bank Detail">Edit</button>
                  <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Bank Detail">Delete</button>
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

export default BankDetailPage;
