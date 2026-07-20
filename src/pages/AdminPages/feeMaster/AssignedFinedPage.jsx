import GenericTableDataLayer from '../../../components/GenericTable';
import AssignedFined from '../../../components/child/feeMaster/AssignedFined';
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
const AssignedFinedPage=()=>{
    const handleDelete = async (id, table) => {
        const ok = window.confirm("Are you sure you want to delete this record?");
        if (!ok) return;
        try {
          console.log(id)
          let { data } = await axios.delete(`${baseURL}/api/fine-assigned/${id}`)
          alert('Fine assigned is deleted successfully')
          table.ajax.reload(); // refresh table
        }
        catch (error) {
          alert(error.response.data.message||error.message)
        }
      };
    
      const handleEdit = (id) => {
        console.log("Edit fine assigned:", id);
        // open modal or set edit state
      };
    return(
        <div className='container'>
            <AssignedFined/>
            <GenericTableDataLayer
            pageName="Assigned Fines"

            url={`${baseURL}/api/fine-assigned`}
            columns={[
                {data:"id",name:"id",title:"ID"},
                {data:"class.class_name",name:"class_name",title:"Class Name"},
                {data:"student.first_name",name:"first_name",title:"First Name"},
              
                {data:"fine_amount",name:"fine_amount",title:"Fine Amount"},
                {data:"fine_pay_till_date",name:"fine_pay_till_date",title:"Fine Pay Till Date"},
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
    )
}
export default AssignedFinedPage