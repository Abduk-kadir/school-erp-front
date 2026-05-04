import React, { useMemo } from "react";
import GenericTableDataLayer from "../../../components/GenericTable";
import baseURL from "../../../utils/baseUrl";

const AllStaffPage = () => {
  const staffUrl = `${baseURL}/api/staff`;

  const staffColumns = useMemo(
    () => [
      { data: "id", name: "id", title: "ID" },
      { data: "surname", name: "surname", title: "Surname" },
      { data: "firstname", name: "firstname", title: "First name" },
      
      
      { data: "email", name: "email", title: "Email" },
      { data: "mobile_number", name: "mobile_number", title: "Mobile" },
      { data: "department", name: "department", title: "Department" },
      { data: "designation", name: "designation", title: "Designation" },
      { data: "userType", name: "userType", title: "User type" },
      
      
      
     
    ],
    []
  );

  return (
    <div className='container py-3'>
      <h4 className='mb-3 fw-semibold'>All Staff</h4>
      <GenericTableDataLayer url={staffUrl} columns={staffColumns} />
    </div>
  );
};

export default AllStaffPage;
