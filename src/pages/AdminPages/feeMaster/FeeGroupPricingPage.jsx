import React from 'react'
import FeeGroupPricing from '../../../components/child/feeMaster/feeGroupPricing'
import GenericTableDataLayer from '../../../components/GenericTable'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
const FeeGroupPricingPage = () => {
  const handleDelete = async (id, table) => {
    const ok = window.confirm("Are you sure you want to delete this record?");
    if (!ok) return;
    try {
      console.log(id)
      let { data } = await axios.delete(`${baseURL}/api/fee-groups/group-details/${id}`)
      alert('Fee group pricing is deleted successfully')
      table.ajax.reload(); // refresh table
    }
    catch (error) {
      alert(error.response.data.message||error.message)
    }
  };
  const handleEdit = (id) => {
    console.log("Edit fee group pricing:", id);
    // open modal or set edit state
  };
  return (
    <div className='container'>
        <FeeGroupPricing />
        <GenericTableDataLayer
        url={`${baseURL}/api/fee-groups/group-details`}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "feeGroup.groupname", title: "Group" },
          { data: "scheduletype", title: "Schedule" },
          { data: "isbackwardclass", title: "Is Backward" },
          { data: "feeType.name", title: "Fee Type" },
          { data: "isAdded_student", title: "Is Added" },
          { data: "is_elective", title: "Is Elective" },
          {
            data: "subject.value",
            name: "subject",
            title: "Subject",
            defaultContent: "-",
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
    </div>
  )
}

export default FeeGroupPricingPage