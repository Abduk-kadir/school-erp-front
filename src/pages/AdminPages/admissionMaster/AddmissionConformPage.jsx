
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
        { data: "first_name", title: "First Name<br>Last Name<br>Father Name<br>Mother Name" },
        { data: "", title: "Photo", render: (data, type, row) => { 
          return'<button class="btn action-btn action-btn-purple">View Photo</button>'
        } },

        { data: "class", title: "class" },
        { data: "email", title: "Email<br>Password<br>Mobile No" },
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
