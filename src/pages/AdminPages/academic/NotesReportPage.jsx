import React from 'react'
import AllTypeNotficationDataTable from '../../../components/AllTypeNotficationDataTable'
import baseURL from '../../../utils/baseUrl'

const NotesReportPage = () => {
 const notesColumns = [
    {data:"id",title:"ID"},
    {data:"batch_name",title:"Batch"},
    {data:"class_name",title:"Class"},
    {data:"division_name",title:"Division"},
    {data:"subject_name",title:"Subject", defaultContent:""},
    {data:"teacher_name",title:"Teacher", defaultContent:""},
    {data:"topic",title:"Topic", defaultContent:""},
    {data:"chapter",title:"Chapter", defaultContent:""},
 ]
  return (
    <div>
      <AllTypeNotficationDataTable url={`${baseURL}/api/notes`} columns={notesColumns} />
    </div>
  )
}

export default NotesReportPage