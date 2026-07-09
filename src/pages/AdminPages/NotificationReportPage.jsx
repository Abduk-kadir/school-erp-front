import React from 'react'
import AllTypeNotficationDataTable from '../../components/AllTypeNotficationDataTable'
import baseURL from '../../utils/baseUrl'

const NotificationReportPage = () => {
  const notesColumns = [
    { data: "id", title: "ID" },
    { data: "batch_name", title: "Batch" },
    { data: "class_name", title: "Class" },
    { data: "division_name", title: "Division" },
    { data: "message", title: "Message" },
    {data:"staff_name",title:"Teacher", defaultContent:""},
    {
      data: null,
      title: "Actions",
      orderable: false,
      searchable: false,
      render: (data, type, row) => {
        return `
          <div class="table-action-group">
            <button type="button" class="table-action-btn table-action-view-document" data-id="${row.id}" title="View document">View</button>
            <button type="button" class="table-action-btn table-action-download-document" data-id="${row.id}" title="Download document">Download</button>
          </div>
        `;
      },
    },

  ]
  return (
    <div>
      <AllTypeNotficationDataTable url={`${baseURL}/api/student-notifications`} columns={notesColumns} />
    </div>
  )
}

export default NotificationReportPage