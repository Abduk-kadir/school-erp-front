import React from 'react'
import Breadcrumb from '../../../components/Breadcrumb'
import BulkStudentUpdate from '../../../components/child/academic/BulkStudentUpdate'

const StudentBulkUpdatePage = () => {
  return (
    <>
      <Breadcrumb title="Student Bulk Update" />
      <BulkStudentUpdate />
    </>
  )
}

export default StudentBulkUpdatePage