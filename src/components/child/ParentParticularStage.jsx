import React from 'react'
import FormWizard from './FormWizard'
import { useSearchParams, useNavigate } from 'react-router-dom'

const ParentParticularStage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()

  const step = searchParams.get('step')
  console.log('current step in parent particular stage is:', step)
  return (
    <div className='container mt-5'>
      <FormWizard currentStep={Number(step)} />
      <div className='card'>

        <h1>Parent Particular Stage</h1>

        <div className="d-flex justify-content-end gap-3 mb-10">
          <button
            type="Previous"
            className="btn btn-success mt-3 px-5"
            onClick={() => navigate(`/subject-stage/?step=4`)}
          >
            Prev
          </button>
          <button
            type="Next"
            className="btn btn-success mt-3 px-5"
            onClick={() => navigate(`/transport-detail-stage/?step=6`)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default ParentParticularStage
