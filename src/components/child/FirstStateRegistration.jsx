
const FirstStageRegistration = () => {
    <>
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
    </>
}
export default FirstStageRegistration