import { useEffect } from "react";
import $ from "jquery";
import "datatables.net-dt";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import ClassHorizontalInputFormWithIcons from './child/ClassHorizontalInputFormWithIcons'
const ClassTableDataLayer = () => {
  useEffect(() => {
    const table = $("#dataTable").DataTable({
      pageLength: 10,
    });
    return () => {
      table.destroy(true);
    };
  }, []);
  return (
    <div> <Breadcrumb title="Basic Table" />
    <ClassHorizontalInputFormWithIcons/>
    <div className='card basic-data-table'>
      
      <div className='card-header'>
        <h5 className='card-title mb-0'>Default Data Tables</h5>
      </div>
      <div className='card-body'>
        <table
          className='table bordered-table mb-0'
          id='dataTable'
          data-page-length={10}
        >
          <thead>
            <tr>
              <th scope='col'>
                <div className='form-check style-check d-flex align-items-center'>
                  <input className='form-check-input' type='checkbox' />
                  <label className='form-check-label'>S.L</label>
                </div>
              </th>
              <th scope='col'>Class Name</th>
              <th scope='col'>Class Code</th>
              <th scope='col'>Faculty</th>
              <th scope='col' className='dt-orderable-asc dt-orderable-desc'>
                Admision Form Amount
              </th>
               <th scope='col' className='dt-orderable-asc dt-orderable-desc'>
                Direct Admission or Meritwise
              </th>
              <th scope='col'>Status</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className='form-check style-check d-flex align-items-center'>
                  <input className='form-check-input' type='checkbox' />
                  <label className='form-check-label'>01</label>
                </div>
              </td>
              <td>
               
      
                  <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                    Sylabus 1
                  </h6>
               
              </td>
              <td>
                <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                    Class Code1
                  </h6>
              </td>
              <td>
                <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                    Abdul kadir
                  </h6>
          </td>
              <td>
                <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                    Rs 200
                  </h6>
              </td>
               <td>
                {" "}
                <span className='bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm'>
                  Direct
                </span>
              </td>
              <td>
                {" "}
                <span className='bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm'>
                  Active
                </span>
              </td>
              <td>
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
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default ClassTableDataLayer;
