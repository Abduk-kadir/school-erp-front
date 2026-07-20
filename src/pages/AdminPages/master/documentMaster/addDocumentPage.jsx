
import GenericTableDataLayer from "../../../../components/GenericTable";

import { useState } from "react";
import AddDocument from "../../../../components/child/master/documentMaster/AddDocument";
import axios from "axios";
import baseURL from "../../../../utils/baseUrl";
const AddDocumentPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/document-types/${id}`)
      alert('Institute is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message || error.message)
    }
  };

  const handleEdit = (id) => {
    console.log("Edit institute:", id);
    // open modal or set edit state
  };

  return (
    <>

      <AddDocument />
      <GenericTableDataLayer
        pageName="Documents"


        url={`${baseURL}/api/document-types`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "name", title: "Document Name" },
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



    </>
  );
};

export default AddDocumentPage;
