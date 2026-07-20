import React from 'react'
import AddBankDetail from '../../../components/child/feeMaster/AddBankDetail'
import GenericTableDataLayer from '../../../components/GenericTable'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
const BankDetailPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/bank-details/${id}`)
      alert('Bank detail is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };
  const handleEdit = (id) => {
    console.log("Edit bank detail:", id);
    // open modal or set edit state
  };
  return (
    <div className='container'>
      <AddBankDetail/>
      <GenericTableDataLayer
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

export default BankDetailPage
