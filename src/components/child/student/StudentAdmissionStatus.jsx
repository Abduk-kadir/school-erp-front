
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

import { Icon } from '@iconify/react';
import baseURL from '../../../utils/baseUrl';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Loader from '../../../helper/Loader'

const StudentAdmissionStatus = () => {
  const pdfUrl = "/your-admission-form.pdf"; // ← change this
  const [searchParams]=useSearchParams()
    const reg_no = searchParams.get("reg_no");
  const [loading,setLoading]=useState(false)
  const handleDownload=async ()=>{
     try {
      
     
         setLoading(true)
        // Make POST request to your backend PDF route
        const response = await axios.post(
          `${baseURL}/api/admission/generate-pdf`,
          { reg_no },
          {
            responseType: "blob", // important → tells axios to treat response as binary
          }
        );
    
        // Create blob from response
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
    
        // Create temporary link to download
        const a = document.createElement("a");
        a.href = url;
        a.download = `admission-${reg_no}.pdf`; // set file name
        document.body.appendChild(a);
        a.click();
        a.remove();
    
        // Clean up URL
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("PDF download failed:", err);
      }
      finally {
          setLoading(false); // ✅ reset parent state
        }

  }
  if(loading){
   return <Loader message={'Pdf is dowloading'}/>
  }
  return (
    <div className="container d-flex justify-content-center align-items-center">

      <div className='row mt-20'>
      <div className='col-10'>
      <h5 className="mb-0 fw-medium text-dark">
        Download and print the PDF form. Attach photocopies of the uploaded documents and submit them to the institute
      </h5>
      </div> 
      <div className='col-2'>
    <Button

  variant="success btn-lg"
  onClick={handleDownload}
  disabled={loading}
>
  {loading ? <Loader /> : "Download PDF"}
</Button>
    </div> 
    </div>
    </div>
  );
};
export default  StudentAdmissionStatus
