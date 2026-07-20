import React from 'react'
import DepartmentAndDesignation from '../../../components/child/master/DepartmentAndDesignation';
import { useState } from 'react';
import axios from 'axios';
import baseURL from '../../../utils/baseUrl'
import GenericTableDataLayer from '../../../components/GenericTable';

const DepartmentPage = () => {
    const [initialValues, setInitialValues] = useState({ department_name: '' });
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const initialFields = [
        {
            name: 'department_name',
            label: 'Department Name',
            type: 'text',
            required: true,
        },


    ];

    const handleSubmit = async (values) => {
        setSuccessMsg('');
        setErrorMsg('');
        try {
            console.log('Submitted Data:', values);
            const data = [
                { "department_name": values.department_name },
            ]
            await axios.post(`${baseURL}/api/departments`, data);
            setSuccessMsg('Department added successfully!');
            setInitialValues({ department_name: "" })

        }
        catch (error) {
            setErrorMsg(error.response?.data?.message || 'Something went wrong');

        }

    };
    const handleReset = (initialValues) => {
        console.log('Form has been reset to:', initialValues);
        setInitialValues({ department_name: '' });

        // You can add extra logic here (e.g., clear localStorage, show toast, etc.)
    };


    const handleDelete = async (id, table) => {
        const ok = window.confirm("Are you sure you want to delete this record?");
        if (!ok) return;
        try {
          console.log(id)
          let { data } = await axios.delete(`${baseURL}/api/departments/${id}`)
          alert('Department is deleted successfully')
          table.ajax.reload(); // refresh table
        }
        catch (error) {
          alert(error.response.data.message || error.message)
        }
      };
    
      const handleEdit = (id) => {
        console.log("Edit Department:", id);
        // open modal or set edit state
      };
    return (
        <div>
            <DepartmentAndDesignation
                initialFields={initialFields}
                initialValues={{ department_name: '' }} // optional
                onSubmit={handleSubmit}

                submitButtonText="Save"
                resetButtonText="Reset"
                handleReset={handleReset}
                successMsg={successMsg}
                errorMsg={errorMsg}
                setSuccessMsg={setSuccessMsg}
                setErrorMsg={setErrorMsg}
                cardTitle="Department"
                cardIcon="solar:buildings-2-bold-duotone"
            />

            <GenericTableDataLayer
                pageName="Department"


                url={`${baseURL}/api/departments`}
                columns={[
                    { data: "id", name: "id", title: "ID" },
                    { data: "department_name", title: "Department Name" },
                    {
                        data: null,
                        title: "Actions",
                        orderable: false,
                        searchable: false,
                        render: (data, type, row) => {
                            return `
                        <div class="table-action-group">
                          <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Department">Edit</button>
                          <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Department">Delete</button>
                        </div>
                      `;
                        },
                    },

                ]}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    )
}

export default DepartmentPage