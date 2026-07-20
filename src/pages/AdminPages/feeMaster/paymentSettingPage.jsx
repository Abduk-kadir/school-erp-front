import React from 'react'
import PaymentSetting from '../../../components/child/feeMaster/paymentSetting'
import GenericTableDataLayer from '../../../components/GenericTable'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
const PaymentSettingPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/payment-settings/${id}`)
      alert('Payment setting is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };
  const handleEdit = (id) => {
    console.log("Edit payment setting:", id);
    // open modal or set edit state
  };
  return (
    <div>
      <PaymentSetting />
      <GenericTableDataLayer
        pageName="Payment Settings"
        url={`${baseURL}/api/payment-settings`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "paymentGateway", title: "Payment Gateway" },
          { data: "class.class_name", title: "Class" ,defaultContent:""},
          { data: "merchantId", title: "Merchant ID" },
          { data: "key", title: "Key" },
          { data: "accessCode", title: "Access Code" },
          { data: "feeType.name", title: "Fee Type" },
          { data: "isSplit", title: "Is Split" },
          {
            data: null,
            title: "Actions",
            orderable: false,
            searchable: false,
            render: (data, type, row) => {
              return `
                        <div class="table-action-group">
                          <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit institute">Edit</button>
                          <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete institute">Delete</button>
                        </div>
                      `;
            },
          },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}

      />
    </div>
  )
}

export default PaymentSettingPage