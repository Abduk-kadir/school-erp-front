import { use, useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../utils/baseUrl";
import { Formik, Form, ErrorMessage, useFormikContext } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate,useSearchParams } from "react-router-dom";
import FormWizard from "./FormWizard";
import { useSelector, useDispatch } from "react-redux"
const DocumentStage = () => {
  const navigate = useNavigate();
  const [docReq, setDocReq] = useState([]);
  let [document,setDocuments]=useState({})
  const [userDocument,setUserDocument]=useState([])
  const [searchParams] = useSearchParams();
  const [uploadedDocs, setUploadedDocs] = useState({})
  const  [edit,setEdit]=useState(false);
  const [personalData, setPersonalData] = useState({})
  const reg_no = useSelector((state) => state?.registrationNo?.reg_no);
  let step = searchParams.get("step")
  step = Number(step)
  let editdocument={}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/requirement-documents`, {
          params: { class_id: 4 },
        });
       
        setDocReq(res.data.data || []);
       
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchData();
  }, []);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          await axios.get(`${baseURL}/api/student-documents/student/${reg_no}`),
          axios.get(`${baseURL}/api/personal-information/reg_no/${reg_no}`)
        ]);

        // subroutes response
        if (results[0].status === "fulfilled") {
         setUserDocument(results[0].value.data?.data || []);
         setEdit(true)
        }

        // transport response
       
         if (results[1].status === "fulfilled") {
           setPersonalData(results[1].value?.data?.data);
        } 
        
        else {
          
        }

      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    if (reg_no) {
      fetchData();
    }
  }, []);

  // Remove duplicates and prepare unique document types
  let uniqueDocs = Array.from(
    new Map(docReq.map((item) => [item.document_type, item])).values()
  );

  

 // console.log('my uniquie:::',uniqueDocs)
 // console.log('user document:',userDocument)
  console.log('document is:',document)
  console.log('my uniquie:::',uniqueDocs)
  console.log('uplodded docs***',uploadedDocs)
  console.log('user document:',userDocument)

  const handleChange = (docType,file) => {
  if (!file) return;

  setDocuments((prev) => ({
    ...prev,
   
    [docType]: file,   // dynamic key
  }));
};


const handleSubmit = async (document_type, document_id,id) => {
  const doc = document[document_type];
 
  if (!doc) {
    alert("Please select file first");
    return;
  }
  
  const formData = new FormData();
  formData.append("document", doc);
  formData.append("reg_number", reg_no);
  formData.append("document_id", document_id);

  try {
    if(!id){
    const response = await axios.post(
     `${baseURL}/api/student-documents/upload`,
     formData
    );
     console.log("Upload success:", response.data);
     setUploadedDocs((prev)=>({
      ...prev,
      [document_id]:true
    }))
  }
  if(edit&&id){
    const response2 = await axios.put(`${baseURL}/api/student-documents/${id}`,formData);
      console.log("Update success:", response2.data);
    alert('Document updated successfully')
  }

   
    
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
  }
    
};

const handleNext = async() => {
   let formStatusPayload = { current_step: 4, reg_no: reg_no }
   await axios.post(`${baseURL}/api/form-status/upsert`, formStatusPayload)
        
   navigate(`/complete-stage?step=10`)
}


  
 
  return (
    <div className="container mt-5 mt-5">
        <FormWizard currentStep={step}/>
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
      
       
          <div className="card-body">
             <div className=''> 
          <div className="d-flex justify-content-between gap-3 ">
                     <h4 className="fw-semibold">Upload Document</h4> 

                    <button
                        type="Next"
                        className="btn btn-success"
                        onClick={() => navigate('/')}

                    >
                        Logout
                    </button>
                </div>
                <div className='row mb-3'>
                    <div className='col-3'>
                        <label className="form-label">Reg NO</label>
                        <input className='form-control' value={reg_no} disabled />
                    </div>
                    <div className='col-3'>
                        <label className="form-label">First Name</label>
                        <input className='form-control' value={personalData?.first_name} disabled />

                    </div>
                    <div className='col-3'>
                        <label className="form-label">Last Name</label>
                        <input className='form-control' value={personalData?.last_name} disabled />
                    </div>
                    <div className='col-3'>
                        <label className="form-label">Class</label>
                        <input className='form-control' value={personalData?.class} disabled />
                    </div>
                </div>
                </div>
         
          <p className="text-danger fw-bold mb-4">
            <span className="me-1">★</span>Fields marked with star are mandatory
          </p>
      
       
            {uniqueDocs.map((elem) =>{
              
               const isUploaded = uploadedDocs[elem.document_id];
               //this is for showing the already uploaded document,if user come back to this page from declaration stage for editing the document
              const uploadedfileName=userDocument.find(doc=>doc.document_id===elem.document_id)?.original_filename
              const uploadedDocument=userDocument.find(doc=>doc.document_id===elem.document_id)
              
              return(
               
              <div key={elem.id || elem.document_type} className="row mb-5 gap-3">
                 

                <div className="col-12 col-md-3">
                  <label className="form-label fs-5 fw-semibold mb-0">
                    Upload {elem.document_type}
                    {elem.is_mandatory === 1 && <span className="text-danger"> *</span>}
                  </label>
                </div>

                <div className="col-12 col-md-4">
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.jpg,.jpeg,.png" // ← adjust as needed

                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleChange(elem.document_type,file);
                }}
                  />
                  {uploadedfileName&&<label className="form-label text-success">{uploadedfileName} is uploaded</label>}
                  {isUploaded&& <label className="form-label text-success">Document uploaded successfully</label>}
                </div>
                <div className="col-12 col-md-3 ">

                  <label onClick={()=>handleSubmit(elem.document_type,elem.document_id,uploadedDocument?.id)}
                    htmlFor='basic-upload'
                    className='border border-primary-600 fw-medium text-primary-600 px-16 py-10 radius-12 d-inline-flex align-items-center gap-2 bg-hover-primary-50'
                  >
                    <Icon icon='solar:upload-linear' className='text-xl' />
                    Click to upload
                  </label>
                </div>




              </div>
            )})}

           <div className="d-flex justify-content-end gap-3 mb-10">
                    <button
                        type="Previous"
                        className="btn btn-success mt-3 px-5"
                        onClick={() => navigate(`/declaration-stage?step=8`)}
                    >
                        Prev
                    </button>
                    <button
                        type="Next"
                        className="btn btn-success mt-3 px-5"
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
         
        </div>
     </div>
    </div>
  );
};

export default DocumentStage;