
import GenericTableDataLayer from "../../../../components/GenericTable";
import { useState } from "react";
import AssignDocument from "../../../../components/child/master/documentMaster/assignDocument";
import axios from "axios";
import baseURL from "../../../../utils/baseUrl";
const AssignDocumentPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/requirement-documents/${id}`)
      alert('Requirement document is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };

  const handleEdit = (id) => {
    console.log("Edit requirement document:", id);
    // open modal or set edit state
  };
 
  return (
    <>
            <AssignDocument/>
             
              <GenericTableDataLayer
               
             
                url={`${baseURL}/api/requirement-documents`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"class_name",title:"Class"},
                   {data:"document_type",title:"Document"},
                    {data:"category",title:"Category"},
                     {data:"condition_attribute",title:"condition_attribute"},
                      {data:"condition_value",title:" Condition value"},
                       {data:"is_mandatory",title:"Mandatory"},
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

export default AssignDocumentPage;
