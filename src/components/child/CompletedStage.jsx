import React from 'react'
import FormWizard from './FormWizard'
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";


const CompletedStage = () => {
    const [searchParams] = useSearchParams();
    const navigate=useNavigate()
  
    let step = searchParams.get("step")
    step = Number(step)
    return (
        <div className='container'>
              <FormWizard currentStep={step} />
            <div className='card' >
                <div className='text-center mb-40'>
                    <img
                        src='assets/images/gif/success-img3.gif'
                        alt='WowDash React Vite'
                        className='gif-image mb-24'
                    />
                    <h4 className='mb-20'>Congratulations </h4>
                    <p className='fw-bold'>
                        Well done! You have successfully completed.
                    </p>
                </div>
                <div className='form-group d-flex align-items-center justify-content-end gap-8 mb-10 mt-40 me-5'>
                    <button
                        onClick={() => navigate(`/document-stage/?step=9`)}
                       
                        className='btn btn-success px-32'
                    >
                        Prev
                    </button>
                    <button
                       
                        className='btn btn-success-600 px-32'
                    >
                        Publish
                    </button>
                </div>


            </div>
        </div>
    )
}

export default CompletedStage
