import { use, useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../utils/baseUrl";
import { Formik, Form, ErrorMessage, useFormikContext } from "formik";
import { Icon } from "@iconify/react/dist/iconify.js";

const DocumentStage = () => {
  const [docReq, setDocReq] = useState([]);
  let [document,setDocuments]=useState({})
  const [userDocument,setUserDocument]=useState([])
 
  const [uploadedDocs, setUploadedDocs] = useState({})

  let edit=true;
  let editdocument={}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/requirement-documents`, {
          params: { class_id: 4 },
        });
        const res2 = await axios.get(`${baseURL}/api/student-documents/student/${123}`, {
  
        });
        setDocReq(res.data.data || []);
        setUserDocument(res2.data.data || [])
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchData();
  }, []);

  // Remove duplicates and prepare unique document types
  const uniqueDocs = Array.from(
    new Map(docReq.map((item) => [item.document_type, item])).values()
  );

  

 // console.log('my uniquie:::',uniqueDocs)
 // console.log('user document:',userDocument)
  console.log('document is:',document)

  if(edit==true)userDocument.map(elem=>editdocument[elem.document_id]=true)
  console.log('edit document is:',editdocument)
 
 
  
  const handleChange = (docType,file) => {
  if (!file) return;

  setDocuments((prev) => ({
    ...prev,
   
    [docType]: file,   // dynamic key
  }));
};


const handleSubmit = async (document_type, document_id) => {
  const doc = document[document_type];

  if (!doc) {
    alert("Please select file first");
    return;
  }

  const formData = new FormData();
  formData.append("document", doc);
  formData.append("reg_number", 123);
  formData.append("document_id", document_id);

  try {
    const response = await axios.post(
      `${baseURL}/api/student-documents/upload`,
      formData
    );

    console.log("Upload success:", response.data);
    setUploadedDocs((prev)=>({
      ...prev,
      [document_id]:true
    }))
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
  }
};

  
 console.log('uplodded docs***',uploadedDocs)
  return (
    <div className="container  card p-5 shadow ">
      <h4 className="mb-10">Document Stage</h4>
       <label className=" mb-10 text-danger fw-bold">Star mark is  Complusary</label>
      
       
            {uniqueDocs.map((elem) =>{
              
               //const isUploaded = uploadedDocs[elem.document_id];
              const isUploaded = edit==true?editdocument[elem.document_id]:uploadedDocs[elem.document_id];
              return(
               
              <div key={elem.id || elem.document_type} className="row mb-5 gap-3">
                 

                <div className="col-12 col-md-2">
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
                  {isUploaded&&<label className="form-label text-success">{elem.document_type} is uploaded</label>}
                </div>
                <div className="col-12 col-md-3 ">

                  <label onClick={()=>handleSubmit(elem.document_type,elem.document_id)}
                    htmlFor='basic-upload'
                    className='border border-primary-600 fw-medium text-primary-600 px-16 py-10 radius-12 d-inline-flex align-items-center gap-2 bg-hover-primary-50'
                  >
                    <Icon icon='solar:upload-linear' className='text-xl' />
                    Click to upload
                  </label>
                </div>




              </div>
            )})}

           
         
       
     
    </div>
  );
};

export default DocumentStage;