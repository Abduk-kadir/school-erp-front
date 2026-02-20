
import React from 'react'
import GenericTableAssignSubject from '../../../components/GenericTableAssinSubject'
import { useState, useEffect } from 'react'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
import Stage_accordingStep from '../../../helper/stageStep'
import Form_Status from '../../../helper/fromStatus'

const AddmissionConformPage = () => {

  return (

    <GenericTableAssignSubject
      url={'http://localhost:5000/api/admission-conform'}
      columns={[

        { data: "reg_no", title: "Reg No" },
        { data: "reg_no", title: "Form No" },
        { data: "", title: "Accept by" },
        {
          data: 'first_name',                    // ← important: we don't bind to one field
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
          data: 'email', title: `
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
        { data: null, title: "Status", 
          render: (data, type, row) =>
            `<span class="fw-bold">${Form_Status(row?.formStatus?.form_status)}</span>`
        },
        {
          data: null, title: "Form Current Stage",
          render: (data, type, row) =>
            `<span class="fw-bold">${Stage_accordingStep(row?.formStatus?.current_step)}</span>`
        },
        {
          data: null,
          title: "Elective Subjects",
          // give enough width for readability
          render: function (data, type, row) {
            let subjects = row.studentSubjects || [];
            subjects = subjects.filter(elem => elem?.elective_bbasket_id)


            // Build list with one subject per line
            const lines = subjects
              .map(item => {
                const name = item.subject?.value;

                return `<span class="fw-bold">${name}</span>`
              })



            // Join with <br> for line breaks
            return lines.join('<br>');
          }
        },
       {
  data: null,
  title: "Action",
  render: function (data, type, row) {
    const currentStep = row.formStatus?.current_step ;

    // Determine if Accept button should be active
    const isAcceptEnabled = currentStep <9;
   
    const allActionsDisabled = isAcceptEnabled; 

    const disabledClass = allActionsDisabled ? " disabled" : "";
   
    return `
      <div class="container">
        <div class="row mb-2">
          <div class="col-6 d-grid">
             <button class="btn view-edit action-btn${disabledClass}">
              View & Accept
            </button>
          </div>
          <div class="col-6 d-grid">
            <button class="btn btn-secondary action-btn${disabledClass}">
              Download PDF
            </button>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-6 d-grid">
            <button class="btn btn-warning action-btn${disabledClass}">
              Edit by Staff
            </button>
          </div>
          <div class="col-6 d-grid">
            <button class="btn btn-info action-btn${disabledClass}">
              Edit by Student
            </button>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-6 d-grid">
            <button class="btn btn-success action-btn${disabledClass}">
              Accept
            </button>
          </div>
          <div class="col-6 d-grid">
            <button class="btn btn-danger action-btn${disabledClass}">
              Reject
            </button>
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
