import React from 'react'
import AllTypeNotficationDataTable from '../../components/AllTypeNotficationDataTable'
import baseURL from '../../utils/baseUrl'

const NotificationReportPage = () => {
 const notesColumns = [
    {data:"id",title:"ID"},
    {data:"batch_name",title:"Batch"},
    {data:"class_name",title:"Class"},
    {data:"division_name",title:"Division"},
    {data:"message",title:"Message"},
    ]
  return (
    <div>
      <AllTypeNotficationDataTable url={`${baseURL}/api/student-notifications`} columns={notesColumns} />
    </div>
  )
}

export default NotificationReportPage