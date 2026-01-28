import OrderByFollowingStep from "./child/OrderByFollowingStep"
import { useState } from "react"
import PersonalInformationForm from "./child/PersonalInformationForm";
import DocumentStage from "./child/DocumentStage";
const RegisterLayer = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const nextStep = () => {
        if (currentStep < 9) {
            setCurrentStep(currentStep + 1);
        }
    };
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    return (
        <div>
            <div className='form-wizard-header overflow-x-auto scroll-sm pb-8 my-32'>
                <ul className='list-unstyled form-wizard-list style-two'>
                    <li
                        className={`form-wizard-list__item
                      ${[2, 3, 4, 5, 6, 7, 8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 1 && "active"} `}
                    >
                        <div className='form-wizard-list__line'>
                            <span className='count'>1</span>
                        </div>
                        <span className='text text-xs fw-semibold'>
                            Register{" "}
                        </span>
                    </li>
                    <li
                        className={`form-wizard-list__item
                      ${[3, 4, 5, 6, 7, 8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 2 && "active"} `}
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
                    ${currentStep === 3 && "active"} `}
                    >
                        <div className='form-wizard-list__line'>
                            <span className='count'>3</span>
                        </div>
                        <span className='text text-xs fw-semibold'>Education Detail</span>
                    </li>
                    <li
                        className={`form-wizard-list__item
                      ${[5, 6, 7, 8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 4 && "active"} `}
                    >
                        <div className='form-wizard-list__line'>
                            <span className='count'>4</span>
                        </div>
                        <span className='text text-xs fw-semibold'>Select Optional</span>
                    </li>
                    <li
                        className={`form-wizard-list__item
                      ${[6, 7, 8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 5 && "active"} `}
                    >
                        <div className='form-wizard-list__line'>
                            <span className='count'>5</span>
                        </div>
                        <span className='text text-xs fw-semibold'>Parents/Gardian</span>
                    </li>
                    <li
                        className={`form-wizard-list__item
                      ${[7, 8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 6 && "active"} `}
                    >
                        <div className='form-wizard-list__line'>
                            <span className='count'>36</span>
                        </div>
                        <span className='text text-xs fw-semibold'>Other Infromation</span>
                    </li>
                    <li
                        className={`form-wizard-list__item
                      ${[8, 9].includes(currentStep) && "activated"}
                    ${currentStep === 7 && "active"} `}
                    >
                        <div className='form-wizard-list__line'>
                            <span className='count'>7</span>
                        </div>
                        <span className='text text-xs fw-semibold'>Declare By Gardian</span>
                    </li>
                    <li
                        className={`form-wizard-list__item
                      ${[9].includes(currentStep) && "activated"}
                    ${currentStep === 8 && "active"} `}
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
            <div className="row border">


                <div className="col-12">
                    <div className='card'>
                        <div className='card-body'>
            
                            {/* Form Wizard Start */}
                            <div className='form-wizard'>
                                <div>

                                    <fieldset
                                        className={`wizard-fieldset ${currentStep === 1 && "show"} `}
                                    >
                                        <h6 className='text-md text-neutral-500'>
                                            Registration
                                        </h6>
                                        <div className='row gy-3'>
                                            <div className='col-sm-6'>
                                                <label className='form-label'>Sir Name*</label>
                                                <div className='position-relative'>
                                                    <input
                                                        type='text'
                                                        className='form-control wizard-required'
                                                        placeholder='Enter First Name'
                                                        required=''
                                                    />
                                                    <div className='wizard-form-error' />
                                                </div>
                                            </div>
                                            <div className='col-sm-6'>
                                                <label className='form-label'>First Name*</label>
                                                <div className='position-relative'>
                                                    <input
                                                        type='text'
                                                        className='form-control wizard-required'
                                                        placeholder='Enter Last Name'
                                                        required=''
                                                    />
                                                    <div className='wizard-form-error' />
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <label className='form-label'>Father Name*</label>
                                                <div className='position-relative'>
                                                    <input
                                                        type='email'
                                                        className='form-control wizard-required'
                                                        placeholder='Enter Email'
                                                        required=''
                                                    />
                                                    <div className='wizard-form-error' />
                                                </div>
                                            </div>
                                            <div className='col-sm-6'>
                                                <label className='form-label'>Mother Name*</label>
                                                <div className='position-relative'>
                                                    <input
                                                        type='password'
                                                        className='form-control wizard-required'
                                                        placeholder='Enter Password'
                                                        required=''
                                                    />
                                                    <div className='wizard-form-error' />
                                                </div>
                                            </div>
                                            <div className='col-sm-12'>
                                                <label className='form-label'>Please select the class for child promoted*</label>
                                                <div className='position-relative'>
                                                    <select class="form-select" aria-label="Default select example">
                                                        <option selected>class</option>
                                                        <option value="1">One</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                    <div className='wizard-form-error' />
                                                </div>
                                            </div>
                                            <div className='col-sm-6'>
                                                <label className='form-label'>Email*</label>
                                                <div className='position-relative'>
                                                    <input
                                                        type='password'
                                                        className='form-control wizard-required'
                                                        placeholder='Enter Password'
                                                        required=''
                                                    />
                                                    <div className='wizard-form-error' />
                                                    <label className='form-label text-danger'>Note-Emails are sent to this number</label>
                                                </div>
                                            </div>
                                            <div className='col-sm-6'>
                                                <label className='form-label'>Mobile Number*</label>
                                                <div className='position-relative'>
                                                    <input
                                                        type='password'
                                                        className='form-control wizard-required'
                                                        placeholder='Enter Password'
                                                        required=''
                                                    />
                                                    <div className='wizard-form-error' />
                                                </div>
                                                <label className='form-label text-danger'>Note-Messages will be this number</label>
                                            </div>
                                            <div className='col-sm-6'>

                                                <div className='position-relative'>
                                                    <button

                                                        type='button'
                                                        className='btn btn-success'
                                                    >
                                                        Send Otp
                                                    </button>
                                                </div>
                                                <label className='form-label text-danger'>Click Here to send otp</label>

                                            </div>
                                            <div className='form-group text-end'>

                                                <button
                                                    onClick={nextStep}
                                                    type='button'
                                                    className='form-wizard-next-btn btn btn-primary-600 px-32'
                                                >
                                                    Register Me
                                                </button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset
                                        className={`wizard-fieldset ${currentStep === 2 && "show"} `}
                                    >

                                        <div className='row gy-3'>
                                            {
                                                <PersonalInformationForm />
                                            }
                                            <div className='form-group d-flex align-items-center justify-content-end gap-8'>
                                                <button
                                                    onClick={prevStep}
                                                    type='button'
                                                    className='form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32'
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={nextStep}
                                                    type='button'
                                                    className='form-wizard-next-btn btn btn-primary-600 px-32'
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset
                                        className={`wizard-fieldset ${currentStep === 3 && "show"} `}
                                    >
                                        <h6 className='text-md text-neutral-500'>Document Stage</h6>
                                        <div className='row gy-3'>
                                          <DocumentStage/>
                                            <div className='form-group d-flex align-items-center justify-content-end gap-8'>
                                                <button
                                                    onClick={prevStep}
                                                    type='button'
                                                    className='form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32'
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={nextStep}
                                                    type='button'
                                                    className='form-wizard-next-btn btn btn-primary-600 px-32'
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset
                                        className={`wizard-fieldset ${currentStep === 4 && "show"} `}
                                    >
                                        <div className='text-center mb-40'>
                                            <img
                                                src='assets/images/gif/success-img3.gif'
                                                alt='WowDash React Vite'
                                                className='gif-image mb-24'
                                            />
                                            <h6 className='text-md text-neutral-600'>Congratulations </h6>
                                            <p className='text-neutral-400 text-sm mb-0'>
                                                Well done! You have successfully completed.
                                            </p>
                                        </div>
                                        <div className='form-group d-flex align-items-center justify-content-end gap-8'>
                                            <button
                                                onClick={prevStep}
                                                type='button'
                                                className='form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32'
                                            >
                                                Back
                                            </button>
                                            <button
                                                type='button'
                                                className='form-wizard-submit btn btn-primary-600 px-32'
                                            >
                                                Publish
                                            </button>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            {/* Form Wizard End */}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
export default RegisterLayer