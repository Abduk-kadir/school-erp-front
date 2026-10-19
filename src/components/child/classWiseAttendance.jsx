import { useState,useEffect } from "react";
import { Icon } from "@iconify/react";
import baseURL from "../../utils/baseUrl";
import axios from "axios";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

const getPageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 2, total - 4));
  return Array.from({ length: 5 }, (_, i) => start + i);
};

const ClassWiseAttendance = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
 
  const [students,setStudents]=useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStudents = students.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [students, pageSize]);
  useEffect(()=>{
      let fetchStudets=async()=>{
        try{
          let response=await axios.get(`${baseURL}/api/in-out-attendance/reports/summary`)
          console.log('students data*******************',response.data)
          setStudents(response.data.data)
        }catch(error){
          console.log('error in fetching students data*******************',error)
        }
      }
      fetchStudets()
  },[])


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`${baseURL}/api/in-out-attendance/reports/summary?filter[date]=${date}`)
    .then(response=>{
      
      setStudents(response.data.data)
    })
    .catch(error=>{
      console.log('error in fetching students data*******************',error)
    })
    
  };

  return (
    <div className='adm-panel'>
      <div className='chfi-card'>
        <div className='card-header'>
          <div className='header-row'>
            <span className='header-icon'>
              <Icon icon='solar:clipboard-check-bold-duotone' width='16' />
            </span>
            <div>
              <h5 className='card-title'>Class Wise Attendance</h5>
            </div>
            <div className='header-meta d-flex flex-wrap align-items-center gap-2'>
              <select
                className='adm-page-size'
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                aria-label='Rows per page'
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <form
                onSubmit={handleSubmit}
                className='d-flex flex-wrap align-items-center gap-2'
              >
                <input
                  type='date'
                  className='adm-date-input'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-label='Attendance date'
                />
                <button type='submit' className='adm-btn-header'>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className='card-body'>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table xsm-table mb-0 adm-table'>
              <thead>
                <tr>
                  <th scope='col'>Class</th>
                  <th scope='col' className='text-end'>
                  Division 
                  </th>
                  <th scope='col' className='text-end'>
                    Total Students
                  </th>
                  
                  <th scope='col' className='text-end'>
                    Present count
                  </th>
                  <th scope='col' className='text-end'>
                    Absent count
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='text-center text-secondary-light py-8'
                    >
                      No attendance rows for this date.
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((row, index) => (
                    <tr key={`${row.class}-${startIndex + index}`}>
                      <td className='fw-bold'>{row?.class}</td>
                      <td className='text-end'>{row?.div}</td>
                      <td className='text-end'>{row?.total_student}</td>
                      <td className='text-end'>
                        <span className='adm-badge adm-badge-success'>
                          {row.present_count}
                        </span>
                      </td>
                      <td className='text-end'>
                        <span className='adm-badge adm-badge-danger'>
                          {row?.absent_count}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {students.length > 0 && (
            <div className='adm-pagination'>
              <div className='adm-pagination-info'>
                Showing {startIndex + 1}–
                {Math.min(startIndex + pageSize, students.length)} of{" "}
                {students.length}
              </div>

              <div className='adm-pagination-controls'>
                <button
                  type='button'
                  className='adm-page-btn'
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  aria-label='Previous page'
                >
                  <Icon icon='solar:alt-arrow-left-linear' width='14' />
                </button>
                {getPageNumbers(currentPage, totalPages).map((page) => (
                  <button
                    key={page}
                    type='button'
                    className={`adm-page-btn ${page === currentPage ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type='button'
                  className='adm-page-btn'
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  aria-label='Next page'
                >
                  <Icon icon='solar:alt-arrow-right-linear' width='14' />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassWiseAttendance;
