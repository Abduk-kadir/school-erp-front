import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import axios from "axios";
import baseURL from "../utils/baseUrl";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setStaffId } from "../redux/slices/dynamicForm/editByStaffSlice";
import { getPersonalInformationForm } from '../redux/slices/dynamicForm/personalInfoFormSlice';
import { setRegistrationNo } from "../redux/slices/registrationNo";
const GenericTableAssignSubject = ({ url, columns }) => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const tableRef = useRef(null);
  const datatableRef = useRef(null);

  const [classes, setClasses] = useState([]);
  const [stages, setStages] = useState([]);

  // Controlled filter values
  const [classFilter, setClassFilter] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [regFilter, setRegFilter] = useState("")

  // Refs to hold current filter values for DataTable ajax
  const classFilterRef = useRef("");
  const programFilterRef = useRef("");
  const regFilterRef = useRef("");



  // Update refs when state changes
  useEffect(() => {
    classFilterRef.current = classFilter;
  }, [classFilter]);

  useEffect(() => {
    programFilterRef.current = programFilter;
  }, [programFilter]);

  useEffect(() => {
    regFilterRef.current = regFilter;
  }, [regFilter]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get(`${baseURL}/api/classes`),
          axios.get(`${baseURL}/api/stage`),
        ]);
        setClasses(res1?.data?.data || []);
        setStages(res2?.data?.data || []);
      } catch (err) {
        console.error("Failed to load classes/stages", err);
      }
    };
    fetchData();
  }, []);

  const handleFilter = () => {
    if (datatableRef.current) {
      datatableRef.current.draw(); // ← this triggers new ajax call
    }
  };

  const handleAccept = async (data) => {
    console.log('handle accept is calling')
    try {
      console.log('data is:', data)
      let res = await axios.put(`${baseURL}/api/admission-conform/updateStatus`, {
        reg_no: Number(data.reg_no)
      });

      console.log('api is called')
      if (datatableRef.current) {
        datatableRef.current.draw(); // ← this triggers new ajax call
      }

    }
    catch (err) {

    }



  }

  const handleEditByStudent = async (data) => {

    try {
      console.log('data is:', data)
      let res = await axios.put(`${baseURL}/api/admission-conform/editbystudent`, {
        reg_no: Number(data.reg_no)
      });

      console.log('api is called')
      if (datatableRef.current) {
        datatableRef.current.draw(); // ← this triggers new ajax call
      }

    }
    catch (err) {

    }


  }

  const handleEditByStaff = async (data) => {

    try {
      await dispatch(getPersonalInformationForm({}));
       await dispatch(setRegistrationNo({ reg_no:data?.reg_no }))
       await dispatch(setStaffId({ staff_id:2 }))
      navigate(`/personal-information?step=${2}&reg_no=${data?.reg_no}`)
      console.log('data is:', data)
    

      

    }
    catch (err) {

    }


  }

  const handleEditAndView = async (data) => {

    try {
      //await dispatch(getPersonalInformationForm({}));
      // await dispatch(setRegistrationNo({ reg_no:data?.reg_no }))
       //await dispatch(setStaffId({ staff_id:2 }))
      navigate(`/dashboard/admission/view-accept`)
      console.log('data is:', data)
    

      

    }
    catch (err) {

    }


  }

  




  useEffect(() => {
    if (!tableRef.current) return;

    datatableRef.current = $(tableRef.current).DataTable({
      pageLength: 2,
      processing: true,
      serverSide: true,
      destroy: true,

      ajax: {
        url,
        type: "GET",
        data: (d) => {
          d.filter = {
            className: classFilterRef.current.trim(),
            programName: programFilterRef.current.trim(),
            regNo: regFilterRef.current.trim()
          };
        },
      },
      columns,
      createdRow: function (row, data, dataIndex) {

        // Accept button click btn-edit-by-staff
        $(row).find(".btn-accept").on("click", function () {

          handleAccept(data)

        });

        $(row).find(".btn-student").on("click", function () {


          handleEditByStudent(data)

        });

         $(row).find(".btn-staff").on("click", function () {


          handleEditByStaff(data)

        });

         $(row).find(".edit-view").on("click", function () {


          handleEditAndView(data)

        });

      },
      headerCallback: function (thead) {
        $(thead).find("th").css("white-space", "nowrap");
      }
    });

    return () => {
      if (datatableRef.current) {
        datatableRef.current.destroy(true);
      }
    };
  }, [url, columns]); // Important: do NOT put classFilter/programFilter here

  return (
    <>
      <div className="mb-20" >
        <div >
          <div className="row g-3 align-items-center">   {/* ← key change: align-items-center */}

            <div className="col-md-3">
              <label className="form-label fw-bold">Reg No</label>
              <input
                className="form-control"
                type="text"
                placeholder="enter reg_no"
                value={regFilter}
                onChange={(e) => setRegFilter(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Class</label>
              <select
                className="form-select"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}   // ← this was missing!
              >
                <option selected>Select Class</option>
                {classes.map((elem, index) => (
                  <option key={index} value={elem?.id || elem?.class_name}>
                    {elem?.class_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Stage</label>

              <select
                className="form-select"
                value={programFilter}                         // ← wrong state!
                onChange={(e) => setProgramFilter(e.target.value)}  // ← was missing!
              >
                <option value="">Select Stage</option>
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3 col-12 d-flex align-items-end mt-5">  {/* ← or align-items-center */}
              <button
                className="btn btn-success px-5"
                onClick={handleFilter}
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="card basic-data-table mt-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Assigned Subjects</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive" style={{ overflowY: "hidden", overflowX: "auto" }}>
            <table
              className="table bordered-table mb-0"
              id="dataTable"
              ref={tableRef}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GenericTableAssignSubject;