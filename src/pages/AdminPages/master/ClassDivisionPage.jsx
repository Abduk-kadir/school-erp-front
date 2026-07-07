
import GenericTableDataLayer from "../../../components/GenericTable";
import AddSubject from "../../../components/child/subjectMaster/AddSubject";
import AddClassDivision from "../../../components/child/master/AddClassDivision";
import axios from "axios"
import baseURL from "../../../utils/baseUrl";
import { useState } from "react";
const ClassDivisionPage = () => {
 
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/class-div-map-masters/${id}`)
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

      <AddClassDivision />
      <GenericTableDataLayer
        url={'http://localhost:5000/api/class-div-map-masters'}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "classInfo.class_name", title: "Class Name" },
          { data: "divisionInfo.division_name", title: "Division Name" },
        
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

export default ClassDivisionPage;
