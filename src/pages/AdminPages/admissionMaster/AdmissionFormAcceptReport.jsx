
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
import GenericTableDataLayer from '../../../components/GenericTable'

const AddmissionFormAcceptReport = () => {
   
    return (
        <div>
        <div className='d-flex justify-content-end mb-3'>
            <button className='btn btn-success'>Download Exel</button>
        </div>
        <GenericTableDataLayer
         url={`http://localhost:5000/api/form-status/accept/report`}
                 columns={[
                  {data:"name",title:"Name"},
                  {data:"totalAccepted",title:"Total Accept"},
                  {data:"totalRejected",title : "Total Reject"},
                  {data:null,title : "Action",render: function (data, type, row) {
              // `row` contains the full object for this line → row.name, row.totalAccepted, etc.
              return (
                `<a href="#" 
                    class="view-students-btn fw-bold" 
                    data-id="${row._id || row.id || 'unknown'}" 
                    style="color:#0066cc; text-decoration:underline;">
                    Student Detail List
                 </a>`
              );
            }},

                 
                ]}
        
        />
        </div>
       
    )

}

export default AddmissionFormAcceptReport
