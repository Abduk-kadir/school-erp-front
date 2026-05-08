import React from 'react'
import FeeGroupPricing from '../../../components/child/feeMaster/feeGroupPricing'
import GenericTableDataLayer from '../../../components/GenericTable'

const FeeGroupPricingPage = () => {
  return (
    <div className='container'>
        <FeeGroupPricing />
        <GenericTableDataLayer
        url={'http://localhost:5000/api/fee-groups/group-details'}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "feeGroup.groupname", title: "Group" },
          { data: "scheduletype", title: "Schedule" },
          { data: "isbackwardclass", title: "Is Backward" },
          { data: "feeType.name", title: "Fee Type" },
          { data: "isAdded_student", title: "Is Added" },
          { data: "is_elective", title: "Is Elective" },
          { data: "subject?.value", title: "Subject Name" },
          
        ]}
        />
    </div>
  )
}

export default FeeGroupPricingPage