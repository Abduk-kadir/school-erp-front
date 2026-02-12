import React from 'react'
import FormWizard from './FormWizard'
import { useNavigate } from 'react-router-dom'

const EducationalDetailStage = () => {
    const navigate = useNavigate();
    return (
        <div className='container mt-5'>
            <div className='card shadow'>
                <FormWizard currentStep={3} />
                <h1>Educational Detail Stage</h1>
                <div className="d-flex justify-content-end gap-3 mb-10">
                    <button
                        type="Previous"
                        className="btn btn-success mt-3 px-5"
                        onClick={() => navigate(`/personal-information?step=2`)}
                    >
                        Prev
                    </button>
                    <button
                        type="Next"
                        className="btn btn-success mt-3 px-5"
                        onClick={() => navigate(`/subject-stage?step=4`)}

                    >
                        Next
                    </button>
                </div>
            </div>

        </div>
    )
}

export default EducationalDetailStage
