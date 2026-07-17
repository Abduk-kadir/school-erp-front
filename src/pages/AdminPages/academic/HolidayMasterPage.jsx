import HolidayEventCommon from "../../../components/child/academic/HolidayEventCommon";
import GenericTableDataLayer from "../../../components/GenericTable";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
const HolidayMasterPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/holiday-masters/${id}`)
      alert('Holiday master is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };

  const handleEdit = (id) => {
    console.log("Edit holiday master:", id);
    // open modal or set edit state
  };
  return (
    <div>
      <HolidayEventCommon
        title="Holiday Master"
        icon="solar:calendar-mark-bold-duotone"
        nameLabel="Holiday"
        saveUrl="/api/holiday-masters"
      />
      <GenericTableDataLayer url={`${baseURL}/api/holiday-masters`} columns={[
        {data:"id",name:"id",title:"ID"},
        {data:"holiday",name:"holiday",title:"Holiday Name"},
        {data:"date",name:"date",title:"Date"},
        
        {data:"class",name:"class",title:"Class"},
        {data:"division",name:"division",title:"Division"},
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
  );
};

export default HolidayMasterPage;