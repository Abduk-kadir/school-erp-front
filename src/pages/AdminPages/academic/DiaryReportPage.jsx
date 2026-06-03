import React from 'react'
import AllTypeNotficationDataTable from '../../../components/AllTypeNotficationDataTable'
import baseURL from '../../../utils/baseUrl'

const DiaryReportPage = () => {
 const notesColumns = [
    {data:"id",title:"ID"},
    {data:"batch_name",title:"Batch"},
    {data:"class_name",title:"Class"},
    {data:"division_name",title:"Division"},
    {data:"subject_name",title:"Subject", defaultContent:""},
    {data:"message",title:"Message"},
    ]
  return (
    <div>
      <AllTypeNotficationDataTable url={`${baseURL}/api/diaries`} columns={notesColumns} />
    </div>
  )
}

export default DiaryReportPage