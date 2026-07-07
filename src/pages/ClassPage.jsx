import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import GenericTableDataLayer from "../components/GenericTable";
import AddClass from "../components/child/AddClass";
import axios from "axios";
import baseURL from "../utils/baseUrl";

const ClassPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");

    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/classes/${id}`)
      alert('Class is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message || error.message)
    }
  };

  const handleEdit = (id) => {
    console.log("Edit class:", id);
    // open modal or set edit state
  };
  return (
    <>

      <AddClass />
      <GenericTableDataLayer
        url={'http://localhost:5000/api/classes'}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "class_name", name: "class_name", title: "Class Name" },
          { data: "class_code", name: "class_code", title: "Class Code" },
        
          { data: "admission_form_fee", name: "admission_form_fee", title: "Fee" },
          {
            data: "status",
            name: "status",
            title: "Status",
            render: (data, type) => {
              if (type !== "display") return data;
              const isActive = data === true || data === 1 || data === "1";
              return isActive ? "Active" : "Inactive";
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

export default ClassPage;
