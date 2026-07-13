import React from 'react'
import DepartmentAndDesignation from '../../../components/child/master/DepartmentAndDesignation';
import { useState } from 'react';
import axios from 'axios';
import baseURL from '../../../utils/baseUrl'
import GenericTableDataLayer from '../../../components/GenericTable';
const DesignationPage = () => {
    const [initialValues, setInitialValues] = useState({ designation_name: '' });
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const initialFields = [
        {
            name: 'designation_name',
            label: 'Designation Name',
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
                { "designation_name": values.designation_name },
            ]
            await axios.post(`${baseURL}/api/designations`, data);
            setSuccessMsg('Department added successfully!');
            setInitialValues({ designation_name: "" })

        }
        catch (error) {
            setErrorMsg(error.response?.data?.message || 'Something went wrong');

        }

    };
    const handleReset = (initialValues) => {
        console.log('Form has been reset to:', initialValues);
        setInitialValues({ designation_name: '' });

        // You can add extra logic here (e.g., clear localStorage, show toast, etc.)
    };

    const handleDelete = async (id, table) => {
        const ok = window.confirm("Are you sure you want to delete this record?");
        if (!ok) return;
        try {
            console.log(id)
            let { data } = await axios.delete(`${baseURL}/api/designations/${id}`)
            alert('Institute is deleted successfully')
            table.ajax.reload(); // refresh table
        }
        catch (error) {
            alert(error.response.data.message || error.message)
        }
    };

    const handleEdit = (id) => {
        console.log("Edit institute:", id);
        // open modal or set edit state
    };

    return (
        <div>
            <DepartmentAndDesignation
                initialFields={initialFields}
                initialValues={{ designation_name: '' }} // optional
                onSubmit={handleSubmit}

                submitButtonText="Save"
                resetButtonText="Reset"
                handleReset={handleReset}
                successMsg={successMsg}
                errorMsg={errorMsg}
                setSuccessMsg={setSuccessMsg}
                setErrorMsg={setErrorMsg}
                cardTitle="Designation"
                cardIcon="solar:medal-ribbons-star-bold-duotone"
            />
            <GenericTableDataLayer


                url={'http://localhost:5000/api/designations'}
                columns={[
                    { data: "id", name: "id", title: "ID" },
                    { data: "designation_name", title: "Designation Name" },
                    {
                        data: null,
                        title: "Actions",
                        orderable: false,
                        searchable: false,
                        render: (data, type, row) => {
                            return `
        <div class="table-action-group">
          <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Designation">Edit</button>
          <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Designation">Delete</button>
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

export default DesignationPage