
import React from 'react'
import GenericTableAssignSubject from '../../../components/GenericTableAssinSubject'
import { useState, useEffect } from 'react'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'

const AddmissionConformPage = () => {


  return (

    <GenericTableAssignSubject
      url={'http://localhost:5000/api/personal-information/all'}
      columns={[
        { data: "id", name: "id", title: "ID" },
        { data: "reg_no", title: "Reg No" },
        { data: "reg_no", title: "Form No" },
        { data: "", title: "Accept by" },
        {
          data: null,                    // ← important: we don't bind to one field
          title: `<span class="text-danger">First Name</span><br/>
          <span class="text-primary">Last Name</span><br/>
          <span class="text-success">Father Name</span><br/>
          <span class="text-purple">Mother Name</span>`,
          render: function (data, type, row) {
            // row = full object for this row (from your API)
            return `
      <span class="text-danger">${row.first_name || ''}</span><br/>
      <span class="text-primary">${row.last_name || ''}</span><br/>
      <span class="text-success">${row.father_name || row.father || ''}</span><br/>
      <span class="text-purple">${row.mother_name || row.mother || ''}</span>
    `;
          }
        },
        {
          data: "", title: "Photo", render: (data, type, row) => {
            return '<button class="btn action-btn action-btn-purple">View Photo</button>'
          }
        },

        { data: "class", title: "class" },
        {
          data: null, title: `
          <span class="text-danger">Email</span><br/>
    <span class="text-primary">Mobile No</span><br/>
    <span class="text-success">Password</span><br/>`,
    render: function (data, type, row) {
            // row = full object for this row (from your API)
            return `
      <span class="text-danger">${row.email || ''}</span><br/>
      <span class="text-primary">${row.contact_number || ''}</span><br/>
      <span class="text-success">${row.password || ''}</span><br/>
     
    `;
          }



        },
        { data: "cast", title: "Category" },
        { data: "", title: "Status" },
        { data: "", title: "Form Current Stage" },
        { data: "", title: "Ellective Suject" },
        {
          data: null,
          title: "Action",
          render: (data, type, row) => {
            return `
      <div class="container">
        <div class="row mb-2">
          <div class="col-6 d-grid">
            <button class="btn  action-btn view-edit ">View & Accept</button>
          </div>
          <div class="col-6 d-grid">
            <button class="btn btn-secondary  action-btn">Download PDF</button>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-6 d-grid">
            <button class="btn btn-warning  action-btn">Edit by Staff</button>
          </div>
          <div class="col-6 d-grid">
            <button class="btn btn-info  action-btn">Edit by Student</button>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-6 d-grid">
            <button class="btn btn-success  action-btn">Accept</button>
          </div>
          <div class="col-6 d-grid">
            <button class="btn btn-danger  action-btn">Reject</button>
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

export default AddmissionConformPage
