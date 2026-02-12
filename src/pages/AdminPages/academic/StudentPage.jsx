
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
import StudentTable from '../../../components/child/academic/StudentTable'

const StudentPage = () => {
  return (

    <StudentTable
      url={'http://localhost:5000/api/personal-information/all'}
      columns={[
        { data: "id", name: "id", title: "ID" },
        { data: "reg_no", title: "Reg No" },
        
        {
          data: "first_name", title: `<span class="text-danger">First Name</span><br/>
    <span class="text-primary">Last Name</span><br/>
    <span class="text-success">Father Name</span><br/>
    <span class="text-purple">Mother Name</span><br/>` },
        {
          data: "", title: "Photo", render: (data, type, row) => {
            return '<button class="btn action-btn action-btn-purple">View Photo</button>'
          }
        },

        {
          data: "class",
          title: `
    <span class="text-danger">Class</span><br/>
    <span class="text-primary">Div</span><br/>
    <span class="text-success">Roll NO</span><br/>
    <span class="text-purple">Gr No</span><br/>
  `
        }
        ,
        {
          data: "email", title: `<span class="text-danger">Email</span><br/>
    <span class="text-primary">Mobile No</span><br/>
    <span class="text-success">Password</span><br/>
    ` },
        { data: null, title: `<span class="text-danger">Is Taken Bus</span><br/>
    <span class="text-primary">Route Name</span><br/>
    <span class="text-success">Sub Route Name</span><br/>` },
        { data: null, title: "  " },
        { data: null, title: "  " },
        { data: null, title: " " },
        {
          data: null,
          title: "Action",
          render: (data, type, row) => {
            return `
      <div class="container">
        <div class="row mb-2">
           <div class="col-6 d-grid">
            <button class="btn btn-warning  action-btn">Edit by Staff</button>
          </div>
          <div class="col-6 d-grid">
            <button class="btn btn-secondary  action-btn">Download PDF</button>
          </div>
        </div>

        <div class="row mb-2">
          
          <div class="col-6 d-grid">
            <button class="btn btn-info  action-btn">ChangeDetail</button>
          </div>
        </div>

        
      </div>
    `;
          }
        }


      ]}

    />

  )
}

export default StudentPage
