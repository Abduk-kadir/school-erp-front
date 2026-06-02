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
        {data:"starttime",name:"starttime",title:"Start Time"},
        {data:"endtime",name:"endtime",title:"End Time"},
        {data:"personname",name:"personname",title:"Person Name"},
        {data:"contactperson",name:"contactperson",title:"Contact Person"},
        
       
      ]}
      />
    </div>
  )
}

export default BatchPage