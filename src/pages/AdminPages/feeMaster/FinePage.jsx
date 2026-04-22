import React from 'react'
import AddFine from '../../../components/child/feeMaster/AddFine'
import GenericTableDataLayer from '../../../components/GenericTable'

const FinePage = () => {
  return (
    <div className='container'>
      <AddFine/>
      <GenericTableDataLayer
        url={'http://localhost:5000/api/fines'}
        columns={[
          { data: "id", name: "id", title: "ID" },
          {data:"class.class_name",title:"Class Name"},
          {data:"fine_for_month",title:"Month"},
          {data:"fine_type",title:"Fine Type"},
          {data:"fine_start_date",title:"Start Date"},
          {data:"fine_amount",title:"Amount"}
          

        ]}

      />

    </div>
  )
}

export default FinePage
