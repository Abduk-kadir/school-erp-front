
import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
import AddSeatAllotment from '../../../components/child/admissionMaster.jsx/AddSeatAllotment'
import GenericTableDataLayer from '../../../components/GenericTable'


const SeatAllotmentPage = () => {
   
    return (
        <div>
        <AddSeatAllotment />
        <GenericTableDataLayer
         url={`http://localhost:5000/api/seat-allotments`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"class.class_name",title:"Class"},
                  {data:"category.name",title:"Category"},
                  {data:"no_seat",title : "NO Of Seat"},
                  {data:"is_merit_list",title : "Is Merit List", render: function(data, type, row) { return data ? 'Yes' : 'No'; }},
                  
                ]}
        
        
        
        />
        </div>
       
    )

}

export default SeatAllotmentPage
