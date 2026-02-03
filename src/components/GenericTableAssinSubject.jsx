import { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const GenericTableAssignSubject = ({url,columns}) => {
  // const tableRef = useRef();
  useEffect(() => {
    const table = $("#dataTable").DataTable({
      pageLength: 5,
      processing:true,
      serverSide:true,
      destroy:true,
      ajax:{
        url,
        type:"GET"
      },
      columns
    });
    return () => {
      table.destroy(true);
    };
  }, [url,columns]);
  return (
    <div className='card basic-data-table'>
      <div className='card-header'>
        <h5 className='card-title mb-0'>Default Data Tables</h5>
      </div>
      <div className='card-body'>
        <table
          className='table bordered-table mb-0'
          id='dataTable'
        >
        </table>
      </div>
    </div>
  );
};

export default GenericTableAssignSubject;
