
import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'

import GenericTableDataLayer from '../../../components/GenericTable'
import AddClasswiseSchool from '../../../components/child/classwiseSchool/AddClasswiseSchool'


const ClasswiseSchoolPage = () => {
    return (
        <div>
            <AddClasswiseSchool />
            <GenericTableDataLayer
                url={'http://localhost:5000/api/classwise-institute'}
                columns={[
                    { data: "id", name: "id", title: "ID" },
                    { data: "class.class_name", title: "Class" },
                    { data: "address", title: "address" },
                    { data: "email", title: "Email" },
                    { data: "contact_number", title: "Contact Numlber" },
                    { data: "gst_number", title: "Gst Numlber" },
                   {
      data: "logo",
      title: "Logo Debug",
      render: (value) => {
        if (!value) return "No logo";
        return `<img src="${value}" style="max-width:120px;" />`;  // ← string HTML
      }
    }

                ]}
            />
        </div>

    )

}

export default ClasswiseSchoolPage
