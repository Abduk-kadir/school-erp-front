
import GenericTableDataLayer from "../../../components/GenericTable";
import AddSubject from "../../../components/child/subjectMaster/AddSubject";
import AddInstitute from "../../../components/child/setting/AddInstitute";
import axios from "axios"
import baseURL from "../../../utils/baseUrl";
import { useState } from "react";
const InstitutePage = () => {
 
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/institute/${id}`)
      alert('Institute is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };

  const handleEdit = (id) => {
    console.log("Edit institute:", id);
    // open modal or set edit state
  };

  return (
    <>

      <AddInstitute />
      <GenericTableDataLayer
        url={`${baseURL}/api/institute`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "name", title: "Name" },
          { data: "code", title: "Code" },
          {
            data: "logo",
            title: "Logo",
            orderable: false,
            searchable: false,
            render: (data, type) => {
              if (type !== "display") return data;
              if (!data) return '<span class="table-cell-empty">No logo</span>';
              return `<img src="${data}" class="table-cell-thumb" alt="Institute logo" />`;
            },
          },
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

export default InstitutePage;
