import React from 'react'
import AddFeeHead from '../../../components/child/feeMaster/AddFeeHead'
import GenericTableDataLayer from '../../../components/GenericTable'

const FeeHeadPage = () => {
  return (
    <div className='container'>
      
       <AddFeeHead/>
        <GenericTableDataLayer


        url={'http://localhost:5000/api/fee-heads'}
        columns={[
          { data: "id", name: "id", title: "ID" },
          { data: "fee_head_name", title: "Fee Head" },
          { data: "bank.bank_name", title: "Bank Name" },
          { data: "is_refundable", title: "Is Refundable"},
          { data: "status", title: "Status" },

        ]}

      />

   
    </div>
  )
}

export default FeeHeadPage
