import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import GenericTableDataLayer from "../components/GenericTable";

import AddPhisallyDisable from "../components/child/master/AddPhisallyDisable";
import axios from "axios";
import baseURL from "../utils/baseUrl";
const PhisallyDisablePage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/physically-disable/${id}`)
      alert('Physically disable is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };

  const handleEdit = (id) => {
    console.log("Edit physically disable:", id);
    // open modal or set edit state
  };
  return (
    <>

     <AddPhisallyDisable/>

       <GenericTableDataLayer
                       url={'http://localhost:5000/api/physically-disable'}
                        columns={[
                         {data:"id",name:"id",title : "ID"},
                         {data:"value",title : "Disabiltiy"},
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

export default PhisallyDisablePage;
