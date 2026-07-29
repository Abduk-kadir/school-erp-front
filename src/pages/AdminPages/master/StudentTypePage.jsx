import React from 'react'
import DepartmentAndDesignation from '../../../components/child/master/DepartmentAndDesignation';
import { useState } from 'react';
import axios from 'axios';
import baseURL from '../../../utils/baseUrl'
import GenericTableDataLayer from '../../../components/GenericTable';
const StudentTypePage = () => {
    const [initialValues, setInitialValues] = useState({studenttype: '' });
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [tableRefreshKey, setTableRefreshKey] = useState(0);
    const initialFields = [
        {
            name: 'studenttype',
            label: 'Student Type',
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
                { "studenttype": values.studenttype },
            ]
            await axios.post(`${baseURL}/api/studenttypes`, data);
            setSuccessMsg('Student Type added successfully!');
            setInitialValues({ studenttype: "" })
            setTableRefreshKey((prev) => prev + 1);
        }
        catch (error) {
            setErrorMsg(error.response?.data?.message || 'Something went wrong');

        }

    };
    const handleReset = (initialValues) => {
        console.log('Form has been reset to:', initialValues);
        setInitialValues({ studenttype: '' });
        setTableRefreshKey((prev) => prev + 1);

        // You can add extra logic here (e.g., clear localStorage, show toast, etc.)
    };

    const handleDelete = async (id, table) => {
        const ok = window.confirm("Are you sure you want to delete this record?");
        if (!ok) return;
        try {
            console.log(id)
            let { data } = await axios.delete(`${baseURL}/api/studenttypes/${id}`)
            alert('Student Type is deleted successfully')
            table.ajax.reload(); // refresh table
        }
        catch (error) {
            alert(error.response.data.message || error.message)
        }
    };

    const handleEdit = (id) => {
        console.log("Edit student type:", id);
        // open modal or set edit state
    };

    return (
        <div>
            <DepartmentAndDesignation
                initialFields={initialFields}
                initialValues={initialValues} // optional
                onSubmit={handleSubmit}
                submitButtonText="Save"
                resetButtonText="Reset"
                handleReset={handleReset}
                successMsg={successMsg}
                errorMsg={errorMsg}
                setSuccessMsg={setSuccessMsg}
                setErrorMsg={setErrorMsg}
                cardTitle="Student Type"
                cardIcon="solar:medal-ribbons-star-bold-duotone"
            />
            <GenericTableDataLayer
                key={tableRefreshKey}
                pageName="Student Type"


                url={`${baseURL}/api/studenttypes`}
                columns={[
                    { data: "id", name: "id", title: "ID" },
                    { data: "studenttype", title: "Student Type" },
                    {
                        data: null,
                        title: "Actions",
                        orderable: false,
                        searchable: false,
                        render: (data, type, row) => {
                            return `
        <div class="table-action-group">
          <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit Student Type">Edit</button>
          <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete Student Type">Delete</button>
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

export default StudentTypePage