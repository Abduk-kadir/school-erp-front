import React from 'react'
import AddBatch from '../../../components/child/master/AddBatch'
import GenericTableDataLayer from '../../../components/GenericTable'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'

const BatchPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/batches/${id}`)
      alert('Batch is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };

  const handleEdit = (id) => {
    console.log("Edit batch:", id);
    // open modal or set edit state
  };
  return (
    <div>
      <AddBatch />
      <GenericTableDataLayer url='http://localhost:5000/api/batches' columns={[
        {data:"id",name:"id",title:"ID"},
        {data:"batch_name",name:"batch_name",title:"Batch Name"},
        {data:"class_names",name:"class_names",title:"Classes"},
        {data:"division_names",name:"division_names",title:"Divisions"},
        {data:"starttime",name:"starttime",title:"Start Time"},
        {data:"endtime",name:"endtime",title:"End Time"},
        {data:"personname",name:"personname",title:"Person Name"},
        {data:"contactperson",name:"contactperson",title:"Contact Person"},
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

export default BatchPage