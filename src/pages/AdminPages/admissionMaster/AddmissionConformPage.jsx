
import React from 'react'
import GenericTableAssignSubject from '../../../components/GenericTableAssinSubject'
import { useState,useEffect } from 'react'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'


const AddmissionConformPage = () => {
 
    
  return (
    <div>
      <GenericTableAssignSubject
       url={'http://localhost:5000/api/personal-information/all'}
                 columns={[
                  {data:"id",name:"id",title :"ID"},
                  {data:"first_name",title:"Name"},
                  {data:"class",title:"class"},
                  {data:"email",title:"email"}
                 
                ]}
      
      />
    </div>
  )
}

export default AddmissionConformPage
