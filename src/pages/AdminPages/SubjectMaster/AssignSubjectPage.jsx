import { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import AssignSubject from "../../../components/child/subjectMaster/AssignSubject";
import { Link } from "react-router-dom";

const AssignSubjectPage = () => {
  const [programSubject, setProgramSubject] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('')
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${baseURL}/api/program-subjects/byclasssemester`);
      const res = await axios.get(`${baseURL}/api/classes`);
      setProgramSubject(data?.data || []);
      setClasses(res.data?.data || []);
    };
    fetchData();
  }, []);
 const filteredSubjects = programSubject.filter(item => {
  const matchClass = selectedClass ? item.className === selectedClass : true;

  const programName = item.programName || ""; // fallback if null
  const semester = item.semester !== null && item.semester !== undefined ? item.semester.toString() : "";

  const matchSearch = search
    ? programName.toLowerCase().includes(search.toLowerCase()) ||
      semester.includes(search)
    : true;

  return matchClass && matchSearch;
});



  return (
    <>
      <AssignSubject />

      <div className="container mt-4">
        <div className='card-body mb-3'>

          <div className="row ">
            <div className="col-2 ">
              <div className='dropdown'>
                <button
                  className='btn btn-outline-primary-600 not-active px-18 py-9'
                  type='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  {" "}
                  Select Class{" "}
                </button>
                <ul className='dropdown-menu'>
                  {
                    classes.map(elem => (
                      <li onClick={() => setSelectedClass(elem.class_name)} className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900">
                        {elem.class_name}
                      </li>
                    ))
                  }


                </ul>
              </div>
            </div>
            <div className="col-4">
              <input class="form-control py-11" type="text"
                placeholder="Search by program,semester "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="default input example" />


            </div>

          </div>



        </div>
        <div className="card shadow-sm">


          <div className="card-body p-0">
            <table className="table table-bordered table-striped table-hover mb-0">
              <thead className="text-center">
                <tr>
                  <th>Batch</th>
                  <th>Class Name</th>
                  <th>Program Name</th>
                  <th>Semester</th>
                  <th>Compulsory Subjects</th>
                  <th>Optional Subjects</th>
                </tr>
              </thead>

              <tbody>
                {filteredSubjects.map((elem, index) => (
                  <tr key={index}>
                    <td className="fw-semibold">{elem.batch}</td>
                    <td className="fw-semibold">{elem.className}</td>
                    <td className="fw-semibold">{elem.programName}</td>
                    <td className="text-center">Sem {elem.semester}</td>

                    {/* Compulsory Subjects */}
                    <td>
                      {elem.compulsorySubjects.map(s => s.subjectName).join(", ")}
                    </td>

                    {/* Optional Subjects */}
                    <td>
                      {elem.optionalSubjects
                        .flatMap(opt => opt.subjects)
                        .map(s => s.subjectName)
                        .join(", ")}
                    </td>
                  </tr>
                ))}

                {programSubject.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted p-3">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignSubjectPage;
