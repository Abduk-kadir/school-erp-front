import React from 'react'
import FormWizard from './FormWizard'
import { useNavigate,useSearchParams } from 'react-router-dom'

const OtherInformationStage = () => {
  const [searchParams] = useSearchParams();
  const navigate=useNavigate()
  return (
    <div className='container mt-5'>
      <FormWizard currentStep={Number(searchParams.get('step'))}/>
      <div className='card'>
      <h1>Other Information Stage</h1>
       <div className="d-flex justify-content-end gap-3 mb-10">
          <button
            type="Previous"
            className="btn btn-success mt-3 px-5"
            onClick={() => navigate(`/other-information-stage?step=7`)}
          >
            Prev
          </button>
          <button
            type="Next"
            className="btn btn-success mt-3 px-5"
            onClick={() => navigate(`/declaration-stage?step=8`)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default OtherInformationStage
