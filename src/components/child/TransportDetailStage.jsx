import React from 'react'
import FormWizard from './FormWizard'
import { useSearchParams,useNavigate } from 'react-router-dom'

const TransportDetailStage = () => {
const [searchParams] = useSearchParams();
const navigate=useNavigate()
  return (
    <div className='container mt-5'>
       <FormWizard currentStep={Number(searchParams.get('step'))}/>
       <div className='card'>
       
         <h1>Transport Detail Stage</h1>

         <div className="d-flex justify-content-end gap-3 mb-10">
          <button
            type="Previous"
            className="btn btn-success mt-3 px-5"
            onClick={() => navigate(`/parent-particular-stage/?step=5`)}
          >
            Prev
          </button>
          <button
            type="Next"
            className="btn btn-success mt-3 px-5"
            onClick={() => navigate(`/other-information-stage?step=7`)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransportDetailStage
