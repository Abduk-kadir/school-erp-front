import React from 'react'
import AddFine from '../../../components/child/feeMaster/AddFine'
import GenericTableDataLayer from '../../../components/GenericTable'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
const FinePage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/fines/${id}`)
      alert('Fine is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };
  const handleEdit = (id) => {
    console.log("Edit fine:", id);
    // open modal or set edit state
  };
  return (
    <div className='container'>
      <AddFine/>
      <GenericTableDataLayer
        pageName="Fines"
        url={`${baseURL}/api/fines`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          {data:"class.class_name",title:"Class Name"},
          {data:"fine_for_month",title:"Month"},
          {data:"fine_type",title:"Fine Type"},
          {data:"fine_start_date",title:"Start Date"},
          {data:"fine_amount",title:"Amount"},
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

export default FinePage
