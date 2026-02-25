import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import axios from 'axios';
import baseURL from '../../../utils/baseUrl';
import { useNavigate } from 'react-router-dom';

import { setStaffId } from "../../../redux/slices/dynamicForm/editByStaffSlice";
import { getPersonalInformationForm } from '../../../redux/slices/dynamicForm/personalInfoFormSlice';
import { setRegistrationNo } from "../../../redux/slices/registrationNo";
import DOMPurify from "dompurify";



const AllStageShown = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const reg_no = useSelector((state) => state?.registrationNo?.reg_no);
  const [personalInformationData, setPersonalInformationData] = useState(null)
  const [educationalData, setEducationData] = useState(null)
  const [subjectData, setSubjectData] = useState([])
  const [parentparticularData, setParentParticularData] = useState(null)
  const [transportData, setTransportData] = useState(null)
  const [otherInformationData, setotherInformationData] = useState(null);
  const [declarationData, setDeclarationData] = useState(null);
  const [documentData, setDocumentData] = useState([]);
  

  useEffect(() => {
    let fetchData = async () => {
      const results = await Promise.allSettled([
        axios.get(`${baseURL}/api/personal-information/reg_no/${reg_no}`),
        axios.get(`${baseURL}/api/educational-detail/${reg_no}`),
        axios.get(`${baseURL}/api/studentsubjects/student/${reg_no}`),
        axios.get(`${baseURL}/api/parent-particular/${reg_no}`),
        axios.get(`${baseURL}/api/student-transport/student/${reg_no}`),
        axios.get(`${baseURL}/api/other-information/${reg_no}`),
        axios.get(`${baseURL}/api/student-declarations/student/${reg_no}`),
        axios.get(`${baseURL}/api/student-documents/student/${reg_no}`),

      ]);

      if (results[0].status === "fulfilled") {
        setPersonalInformationData(results[0].value.data?.data);

      }
      if (results[1].status === "fulfilled") {
        setEducationData(results[1].value.data?.data);

      }
      if (results[2].status === "fulfilled") {
        setSubjectData(results[2].value.data?.data);


      }
      if (results[3].status === "fulfilled") {


        setParentParticularData(results[3].value?.data?.data)

      }
      if (results[4].status === "fulfilled") {


        setTransportData(results[4].value?.data?.data)

      }
      if (results[5].status === "fulfilled") {


        setotherInformationData(results[5].value?.data?.data)

      }
      if (results[6].status === "fulfilled") {


        setDeclarationData(results[6].value?.data?.data)

      }
       if (results[7].status === "fulfilled") {


        setDocumentData(results[7].value?.data?.data)

      }

    }
    fetchData()

  }, [])
  // console.log('personal infromation data is', personalInformationData)
  //console.log('education Data:', educationalData)
  //console.log('subject data:', subjectData)
  //console.log('transport data:',transportData)
 // console.log('declaration data:', declarationData)
   console.log('doucment data',documentData)

   const handleEdit=async(current_step)=>{
         
           Promise.all([
           dispatch(getPersonalInformationForm({})),
           //dispatch(setRegistrationNo({ reg_no:reg_no })), beacuse it previos page call
           dispatch(setStaffId({ staff_id:2 }))

           ])
             switch(Number(current_step)){
                    case 1:
                      navigate(`/registration?step=${current_step}&reg_no=${reg_no}`);
                      break;
                    case 2:
                      navigate(`personal-information?step=${current_step}&reg_no=${reg_no}`)
                      break; 
                       case 3:
                      navigate(`/educational-detail-stage?step=${current_step}&reg_no=${reg_no}`);
                      break;
                    case 4:
                      navigate(`/subject-stage?step=${current_step}&reg_no=${reg_no}`)
                      break; 
                       case 5:
                       navigate(`/parent-particular-stage?step=${current_step}&reg_no=${reg_no}`)
                      break;
                    case 6:
                      navigate(`/transport-detail-stage?step=${current_step}&reg_no=${reg_no}`)
                      break; 
                      case 7:
                      navigate(`/other-information-stage?step=${current_step}&reg_no=${reg_no}`)
                      break; 
                      case 8:
                      navigate(`/declaration-stage?step=${current_step}&reg_no=${reg_no}`)
                      break; 
                       case 9:
                      navigate(`/document-stage?step=${current_step}&reg_no=${reg_no}`)
                      break;  
                  }

        
      

   }


  return (
    <div className='container'>

      <div className='row border m-2  p-4 '>
        <div className="d-flex justify-content-between gap-3 mb-3">
          <h5 className="">Personal Information</h5>

          <button
            type="Next"
            className=" btn btn-success px-5"
            onClick={() => handleEdit(2)}

          >
            Edit
          </button>


        </div>

        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">Reg No</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={personalInformationData?.reg_no} disabled></input>
        </div>
        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">First Name</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={personalInformationData?.first_name} disabled></input>
        </div>
        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">Last Name</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={personalInformationData?.first_name} disabled></input>
        </div>
        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">Class</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={personalInformationData?.class} disabled></input>
        </div>
        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">Division</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={personalInformationData?.division} disabled></input>
        </div>
        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">Father Name</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={personalInformationData?.father_name} disabled></input>
        </div>
        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">Mother Name</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={personalInformationData?.mother_name} disabled></input>
        </div>
        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">Contact No</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={personalInformationData?.contact_number} disabled></input>
        </div>
        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">State</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={personalInformationData?.State} disabled></input>
        </div>
        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">City</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={personalInformationData?.city} disabled></input>
        </div>
      </div>
      <div className='row border m-2  p-4 '>
        <div className="d-flex justify-content-between gap-3 mb-3">
          <h5 className="">Education Detail</h5>

          <button
            type="Next"
            className=" btn btn-success px-5"
             onClick={() => handleEdit(3)}

          >
            Edit
          </button>


        </div>

        {Object.entries(educationalData || {}).map(([key, value]) => {
          const ignoreEducationFields = ["id", "reg_no", "createdAt", "updatedAt"]; // match exact key names

          if (ignoreEducationFields.includes(key)) return null; // skip these exact keys



          return (


            <div className='col-3' key={key}>
              <label for="exampleFormControlInput1" class="form-label"> {key}</label>
              <input type="email" class="form-control" id="exampleFormControlInput1" value={value} disabled></input>
            </div>

          );
        })}







      </div>

      <div className="row border m-2  p-4 ">
        <div className="d-flex justify-content-between gap-3 mb-3">
          <h5>Subject Detail</h5>
          <button
            type="button"
            className=" btn btn-success px-5"
             onClick={() => handleEdit(4)}
          >
            Edit
          </button>
        </div>

        {/* Compulsory Subjects */}
        <h6 className="fw-bold mb-2">Compulsory Subjects</h6>
        <div className="row mb-3">
          {subjectData
            .filter(elem => !elem?.elective_bbasket_id)
            .map((elem, index) => (
              <div className="col-3 mb-2" key={elem.id}>
                <input
                  type="text"
                  className="form-control"
                  value={elem?.subject?.value || ''}
                  disabled
                />
              </div>
            ))}
        </div>

        {/* Optional Subjects */}
        <h6 className="fw-bold mb-2">Optional Subjects</h6>
        <div className="row">
          {subjectData
            .filter(elem => elem?.elective_bbasket_id)
            .map((elem, index) => (
              <div className="col-3 mb-2" key={elem.id}>
                <input
                  type="text"
                  className="form-control"
                  value={elem?.subject?.value || ''}
                  disabled
                />
              </div>
            ))}
        </div>
      </div>

      <div className='row border m-2  p-4 '>
        <div className="d-flex justify-content-between gap-3 mb-3">
          <h5 className="">Parent Particular</h5>

          <button
            type="Next"
            className=" btn btn-success px-5"
             onClick={() => handleEdit(5)}

          >
            Edit
          </button>


        </div>

        {Object.entries(parentparticularData || {}).map(([key, value]) => {
          const ignoreEducationFields = ["id", "reg_no", "createdAt", "updatedAt"]; // match exact key names

          if (ignoreEducationFields.includes(key)) return null; // skip these exact keys



          return (


            <div className='col-3' key={key}>
              <label for="exampleFormControlInput1" class="form-label"> {key}</label>
              <input type="email" class="form-control" id="exampleFormControlInput1" value={value} disabled></input>
            </div>

          );
        })}







      </div>

      <div className='row border m-2  p-4 '>
        <div className="d-flex justify-content-between gap-3 mb-3">
          <h5 className="">Transport</h5>

          <button
            type="Next"
            className=" btn btn-success px-5"
             onClick={() => handleEdit(6)}

          >
            Edit
          </button>


        </div>

        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">Route</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={transportData?.Route?.route_name} disabled></input>
        </div>
        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label">Sub Route</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={transportData?.SubRoute?.sub_route_name} disabled></input>
        </div>







      </div>

      <div className='row border m-2  p-4 '>
        <div className="d-flex justify-content-between gap-3 mb-3">
          <h5 className="">Other Information</h5>

          <button
            type="Next"
            className=" btn btn-success px-5"
             onClick={() => handleEdit(7)}
          >
            Edit
          </button>


        </div>

        {Object.entries(otherInformationData || {}).map(([key, value]) => {
          const ignoreEducationFields = ["id", "reg_no", "createdAt", "updatedAt"]; // match exact key names

          if (ignoreEducationFields.includes(key)) return null; // skip these exact keys



          return (


            <div className='col-3' key={key}>
              <label for="exampleFormControlInput1" class="form-label"> {key}</label>
              <input type="email" class="form-control" id="exampleFormControlInput1" value={value} disabled></input>
            </div>

          );
        })}







      </div>

      <div className='row border m-2  p-4 '>
        <div className="d-flex justify-content-between gap-3 mb-3">
          <h5 className="">Declaration</h5>

          <button
            type="Next"
            className=" btn btn-success px-5 px-5"
             onClick={() => handleEdit(8)}

          >
            Edit
          </button>


        </div>



        <div className='col-12'>
          <label for="exampleFormControlInput1" class="form-label fw-bold">Declaration</label>

          <div className="mt-10" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(declarationData?.declaration?.content || '') }} />
        </div>

        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label fw-bold">Place</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={declarationData?.location} disabled></input>
        </div>

        <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label fw-bold">Date</label>
          <input
            type="date"
            className="form-control"
            value={
              declarationData?.date
                ? new Date(declarationData.date).toISOString().split("T")[0]
                : ""
            }
            disabled
          />
        </div>




      </div>

      <div className='row border m-2  p-4 '>
        <div className="d-flex justify-content-between gap-3 mb-3">
          <h5 className="">Document Uploaded</h5>

          <button
            type="Next"
            className=" btn btn-success px-5 px-5"
             onClick={() => handleEdit(9)}

          >
            Edit
          </button>


        </div>



        

       {
        documentData.map(elem=>{
          return(
          <div className='col-3'>
          <label for="exampleFormControlInput1" class="form-label fw-bold">Document Name</label>
          <input type="email" class="form-control" id="exampleFormControlInput1" value={elem?.original_filename} disabled></input>
        </div>
          )
        })
       }

      




      </div>

    </div>
  )
}

export default AllStageShown
