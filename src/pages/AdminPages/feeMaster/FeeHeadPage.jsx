import React from 'react'
import AddFeeHead from '../../../components/child/feeMaster/AddFeeHead'
import GenericTableDataLayer from '../../../components/GenericTable'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
const FeeHeadPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/fee-heads/${id}`)
      alert('Fee head is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };
  const handleEdit = (id) => {
    console.log("Edit fee head:", id);
    // open modal or set edit state
  };
  return (
    <div className='container'>
      
       <AddFeeHead/>
        <GenericTableDataLayer
        pageName="Fee Heads"


        url={`${baseURL}/api/fee-heads`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "fee_head_name", title: "Fee Head" },
          { data: "bank.bank_name", title: "Bank Name" },
          { data: "is_refundable", title: "Is Refundable"},
          { data: "status", title: "Status" },
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

export default FeeHeadPage
