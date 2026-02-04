import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

const GenericTableAssignSubject = ({ url, columns }) => {
  const tableRef = useRef(null);
  const datatableRef = useRef(null);

  let classNameRef = useRef(null)
  let programNameRef = useRef(null)

  const handleFilter = () => {

    if (datatableRef.current) {
      datatableRef.current.draw();
    }
  }

  useEffect(() => {
    datatableRef.current = $(tableRef.current).DataTable({
      pageLength: 5,
      processing: true,
      serverSide: true,
      destroy: true,
      ajax: {
        url,
        type: "GET",
        data: (d) => {
          d.filter = {
            className: classNameRef.current,
            programName: programNameRef.current,
          }
        }
      },
      columns
    });
    return () => {
      if (datatableRef.current) {
        datatableRef.current.destroy(true)
      }
    };
  }, [url, columns]);


  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <input className="form-control" type="text" value={classNameRef.current} onChange={e => classNameRef.current = e.target.value} />
            </div>
            <div className="col-md-4">
              <input className="form-control" type="text" value={programNameRef.current} onChange={e => programNameRef.current = e.target.value} />
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary" onClick={handleFilter}>Submit</button>
            </div>
          </div>
        </div>
      </div>

      <div className='card basic-data-table'>

        <div className='card-header'>
          <h5 className='card-title mb-0'>Default Data Tables</h5>
        </div>
        <div className='card-body'>

          <table
            className='table bordered-table mb-0'
            id='dataTable'
            ref={tableRef}
          >
          </table>
        </div>
      </div>
    </>
  );
};

export default GenericTableAssignSubject;
