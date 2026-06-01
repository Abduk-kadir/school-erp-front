import React from 'react'
import AddBatch from '../../../components/child/master/AddBatch'
import GenericTableDataLayer from '../../../components/GenericTable'

const BatchPage = () => {
  return (
    <div>
      <AddBatch />
      <GenericTableDataLayer url='http://localhost:5000/api/batches' columns={[
        {data:"id",name:"id",title:"ID"},
        {data:"batch_name",name:"batch_name",title:"Batch Name"},
       
      ]}
      />
    </div>
  )
}

export default BatchPage