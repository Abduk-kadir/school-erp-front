
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
         url={'http://localhost:5000/api/personal-information/all'}

        columns={[
             { data: null, name: "id", title: "ID" },
             { data: null, title: "Class" },
             { data: null, title: "Category" },
             {data:null,title:"Alloted Seats"},
             { data: null, title: "is it merit List" },
             { data: null, title: "Action"
                ,
                render: (data, type, row) => {
                    return<td>
                <Link
                  to='#'
                  className='w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center'
                >
                  <Icon icon='iconamoon:eye-light' />
                </Link>
                <Link
                  to='#'
                  className='w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center'
                >
                  <Icon icon='lucide:edit' />
                </Link>
                <Link
                  to='#'
                  className='w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center'
                >
                  <Icon icon='mingcute:delete-2-line' />
                </Link>
              </td>
              },
            }
            
        ]}
        
        
        />
        </div>
       
    )

}

export default SeatAllotmentPage
