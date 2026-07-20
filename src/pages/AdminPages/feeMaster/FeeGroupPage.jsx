import React from "react";
import AddGroup from "../../../components/child/feeMaster/AddGroup";
import GenericTableDataLayer from "../../../components/GenericTable";
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
const FeeGroupPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/fee-groups/${id}`)
      alert('Fee group is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };

  const handleEdit = (id) => {
    console.log("Edit fee group:", id);
    // open modal or set edit state
  };
  return (
    <div className="container">
      <AddGroup className="mb-10" />
      <GenericTableDataLayer pageName="Fee Groups" columns={[
        {data:"id",title:"ID"},
        {data:"groupname",title:"Group Name"},
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
     
      ]} url={`${baseURL}/api/fee-groups`}
       onEdit={handleEdit}
        onDelete={handleDelete}
        />
    </div>
  );
};

export default FeeGroupPage;
