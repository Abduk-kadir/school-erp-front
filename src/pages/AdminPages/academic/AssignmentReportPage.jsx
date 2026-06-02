import React from 'react'
import AllTypeNotficationDataTable from '../../../components/AllTypeNotficationDataTable'
import baseURL from '../../../utils/baseUrl'

const AssignmentReportPage = () => {
    const columns=[
        {data:"id",title:"ID"},
        {data:"batch_name",title:"Batch"},
        {data:"class_name",title:"Class"},
        {data:"division_name",title:"Division"},
        {data:"title",title:"Title"},
        {data:"subject_name",title:"Subject", defaultContent:""},
        {data:"teacher_name",title:"Teacher", defaultContent:""},
    ]
  return (
    <div>
      <AllTypeNotficationDataTable url={`${baseURL}/api/assignments`} columns={columns} />
    </div>
  )
}

export default AssignmentReportPage