import React, { useMemo,useState } from "react";
import GenericTableDataLayer from "../../../components/GenericTable";
import baseURL from "../../../utils/baseUrl";

import axios from "axios";

import {useDispatch} from "react-redux";
import {getGenericEdit} from "../../../redux/slices/genericEdit";
import { useNavigate } from "react-router-dom";
import GenericformModal from "../../../components/child/GenericformModal";



const AllStaffPage = () => {
  const staffUrl = `${baseURL}/api/staff`;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
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
        title: "Photo",
        orderable: false,
        searchable: false,
        render: (data, type, row) => {
          return `
          <div class="table-action-group">
            <button type="button" class="table-action-btn table-action-view-document" data-id="${row.staff_photo || ""}" title="View photo">View</button>
          </div>`;
        },
      },
      {
        data: null,
        title: "Signature",
        orderable: false,
        searchable: false,
        render: (data, type, row) => {
          return `
          <div class="table-action-group">
            <button type="button" class="table-action-btn table-action-view-document" data-id="${row.staff_sig_photo || ""}" title="View signature">View</button>
          </div>`;
        },
      },
      {
        data: null,
        title: "Actions",
        orderable: false,
        searchable: false,
        render: (data, type, row) => {
          return `
                    <div class="table-action-group">
                      <button type="button" class="table-action-btn table-action-edit" data-id="${row.id}" title="Edit staff">Edit</button>
                      <button type="button" class="table-action-btn table-action-assign-class" data-id="${row.id}" title="Assign Class and Div">Assign Class and Div</button>
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

  const handleAssignClass = (id) => {
    console.log("handleAssignClass:", id);
    setShowModal(true)
    // open modal or set delete state
  };
  return (
    <div className='container py-3'>
      {showModal && <GenericformModal show={showModal} title="Assign Class and Div" onClose={() => setShowModal(false)} />}
      
      <GenericTableDataLayer
       url={staffUrl} 
       columns={staffColumns} 
       pageName="All Staff"
       onAssignClass={handleAssignClass}
       onEdit={handleEdit}
      
      />
    </div>
  );
};

export default AllStaffPage;
