
import GenericTableDataLayer from "../components/GenericTable";
import AddDivision from "../components/child/master/AddDivision";
import axios from "axios"
import baseURL from "../utils/baseUrl";

const DivisionPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/divisions/${id}`)
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

     <AddDivision/>

         <GenericTableDataLayer
                pageName="Divisions"
                url={`${baseURL}/api/divisions`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"division_name",name:"division_name",title:"Division Name"},
                  {data:"division_code",name:"division_code",title:"Division Code"},
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

export default DivisionPage;
