import React from 'react'
import AddFeesType from '../../../components/child/feeMaster/AddFeesType'
import GenericTableDataLayer from '../../../components/GenericTable'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
const FeeTypePage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/fees-types/${id}`)
      alert('Fees type is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };
  const handleEdit = (id) => {
    console.log("Edit fees type:", id);
    // open modal or set edit state
  };
  return (
    <div className='container'>
      <AddFeesType/>
      <GenericTableDataLayer


        url={'http://localhost:5000/api/fees-types'}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "name", title: "Fees Type" },
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

export default FeeTypePage
