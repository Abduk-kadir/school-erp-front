import React from 'react'
import { useState } from 'react';

const FormWizard = ({ currentStep }) => {

    console.log('current step in form wizard', currentStep)


    return (

        <div className='form-wizard-header overflow-x-auto scroll-sm pb-8 my-32'>
            <ul className='list-unstyled form-wizard-list style-two' >
                <li
                    className={`form-wizard-list__item
                      ${[2, 3, 4, 5, 6, 7, 8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 1 ? "active" : ""} `}
                >
                    <div className='form-wizard-list__line' >
                        <label className='count'>1</label>
                    </div>
                    <span className='text text-xs fw-semibold'>
                        Register{" "}
                    </span>
                </li>
                <li
                    className={`form-wizard-list__item
                      ${[3, 4, 5, 6, 7, 8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 2 ? "active" : ""} `}
                >
                    <div className='form-wizard-list__line'>
                        <span className='count'>2</span>
                    </div>
                    <span className='text text-xs fw-semibold'>
                        Personal Information
                    </span>
                </li>
                <li
                    className={`form-wizard-list__item
                      ${[4, 5, 6, 7, 8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 3 ? "active" : ""} `}
                >
                    <div className='form-wizard-list__line'>
                        <span className='count'>3</span>
                    </div>
                    <span className='text text-xs fw-semibold'>Educational Details</span>
                </li>
                <li
                    className={`form-wizard-list__item
                      ${[5, 6, 7, 8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 4 ? "active" : ""} `}
                >
                    <div className='form-wizard-list__line'>
                        <span className='count'>4</span>
                    </div>
                    <span className='text text-xs fw-semibold'>Subjects</span>
                </li>
                <li
                    className={`form-wizard-list__item
                      ${[6, 7, 8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 5 && "active"} `}
                >
                    <div className='form-wizard-list__line'>
                        <span className='count'>5</span>
                    </div>
                    <span className='text text-xs fw-semibold'>Transprot Details</span>
                </li>
                <li
                    className={`form-wizard-list__item
                      ${[7, 8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 6 ? "active" : ""} `}
                >
                    <div className='form-wizard-list__line'>
                        <span className='count'>6</span>
                    </div>
                    <span className='text text-xs fw-semibold'>Other Infromation</span>
                </li>
                <li
                    className={`form-wizard-list__item
                      ${[8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 7 ? "active" : ""} `}
                >
                    <div className='form-wizard-list__line'>
                        <span className='count'>7</span>
                    </div>
                    <span className='text text-xs fw-semibold'>Declaration</span>
                </li>
                <li
                    className={`form-wizard-list__item
                      ${[9].includes(currentStep) && "activated"}
                    ${currentStep === 8 ? "active" : ""} `}
                >
                    <div className='form-wizard-list__line'>
                        <span className='count'>8</span>
                    </div>
                    <span className='text text-xs fw-semibold'>Document</span>
                </li>




                <li
                    className={`form-wizard-list__item

                    ${currentStep === 9 && "active"} `}
                >
                    <div className='form-wizard-list__line'>
                        <span className='count'>4</span>
                    </div>
                    <span className='text text-xs fw-semibold'>Completed</span>
                </li>



            </ul>
        </div>

    )
}

export default FormWizard
