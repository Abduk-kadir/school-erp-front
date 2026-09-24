import { useState,useEffect } from "react";
import { Icon } from "@iconify/react";
import baseURL from "../../utils/baseUrl";
import axios from "axios";


const ClassWiseAttendance = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
 
  const [students,setStudents]=useState([])
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
            <div className='header-meta'>
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
                      colSpan={4}
                      className='text-center text-secondary-light py-8'
                    >
                      No attendance rows for this date.
                    </td>
                  </tr>
                ) : (
                  students.map((row, index) => (
                    <tr key={`${row.class}-${index}`}>
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
        </div>
      </div>
    </div>
  );
};

export default ClassWiseAttendance;
