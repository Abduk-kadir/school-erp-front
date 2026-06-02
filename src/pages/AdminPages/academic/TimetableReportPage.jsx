import React from 'react'
import AllTypeNotficationDataTable from '../../../components/AllTypeNotficationDataTable'
import baseURL from '../../../utils/baseUrl'

const TimetableReportPage = () => {
    const timetableColumns = [
        {data:"id",title:"ID"},
        {data:"batch_name",title:"Batch"},
        {data:"class_name",title:"Class"},
        {data:"division_name",title:"Division"},  
        {data:"subject_name",title:"Subject", defaultContent:""},
        {data:"teacher_name",title:"Teacher", defaultContent:""},
        {data:"valid_from",title:"Valid From", defaultContent:""},
        
    ]
  return (
    <div>
    
      <AllTypeNotficationDataTable url={`${baseURL}/api/timetables`} columns={timetableColumns} />
    </div>
  )
}

export default TimetableReportPage