import React, { useMemo } from "react";
import GenericTableDataLayer from "../../../components/GenericTable";
import baseURL from "../../../utils/baseUrl";

import axios from "axios";

import {useDispatch} from "react-redux";
import {getGenericEdit} from "../../../redux/slices/genericEdit";
import { useNavigate } from "react-router-dom";


const AllStaffPage = () => {
  const staffUrl = `${baseURL}/api/staff`;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const staffColumns = useMemo(
    () => [
      { data: "id", name: "id", title: "ID" },
      { data: "surname", name: "surname", title: "Surname" },
      { data: "firstname", name: "firstname", title: "First name" },
      { data: "email", name: "email", title: "Email" },
      { data: "mobile_number", name: "mobile_number", title: "Mobile" },
      { data: "departmentInfo.department_name", name: "department", title: "Department" },
      { data: "designationInfo.designation_name", name: "designation", title: "Designation" },
      { data: "userType", name: "userType", title: "User type" },
      
      {
        data: null,
        title: "Actions",
        orderable: false,
        searchable: false,
        render: (data, type, row) => {
          return `
                    <div class="table-action-group">
                      <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit institute">Edit</button>
                      <button type="button" class="table-action-btn table-action-delete" data-id="${row.id}" title="Delete institute">Delete</button>
                    </div>
                  `;
        },
      },
      
      
     
    ],
    []
  );

  const handleEdit = (id) => {
    console.log("Edit staff:", id);
    dispatch(getGenericEdit({url: `${staffUrl}/detail/${id}`,for_page:'staff-edit'}))
    navigate(`/staff-registration`)

  };

  const handleDelete = (id) => {
    console.log("Delete staff:", id);

    // open modal or set delete state
  };
  return (
    <div className='container py-3'>
      <h4 className='mb-3 fw-semibold'>All Staff</h4>
      <GenericTableDataLayer url={staffUrl} columns={staffColumns} 
      
      onEdit={handleEdit}
      onDelete={handleDelete}
      />
    </div>
  );
};

export default AllStaffPage;
