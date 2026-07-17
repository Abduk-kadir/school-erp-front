import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
//import ClassTableDataLayer from "../components/ClassTableDataLayer";
import GenericTableDataLayer from "../components/GenericTable";
import AddCast from "../components/child/master/AddCast";
import axios from "axios"
import baseURL from "../utils/baseUrl";
const CastPage = () => {
  
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/castes/${id}`)
      alert('Cast is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };

  const handleEdit = (id) => {
    console.log("Edit cast:", id);
    // open modal or set edit state
  };
  return (
    <>

     <AddCast/>

        {/* TableDataLayer */}
        <GenericTableDataLayer
        url={`${baseURL}/api/castes`}
         columns={[
          {data:"id",name:"id",title : "ID"},
          {data:"value",title:"Cast"},
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

export default CastPage;
