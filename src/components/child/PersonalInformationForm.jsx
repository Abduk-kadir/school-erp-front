import { getPersonalInformationForm } from "../../redux/slices/dynamicForm/personalInfoFormSlice"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
const PersonalInformationForm = () => {
    let dispatch = useDispatch()
    let wholeForm = useSelector((state) => state?.personalInfoForms?.personalInfoForm?.data)
    let personalFormfields = wholeForm ? wholeForm[0]?.fields : []
    const [formData, setFormData] = useState({});

    console.log('form is:', personalFormfields)
    useEffect(() => {
        dispatch(getPersonalInformationForm({}));
    }, [dispatch]);

    return (
        <>
            <h6 className='text-md text-neutral-500'>
                Personal Information
            </h6>
            <div className='row gy-3'>
                <div className='col-4'>
                    <label className='form-label'>First Name*</label>
                    <div className='position-relative'>
                        <input
                            type='text'
                            className='form-control wizard-required'
                            placeholder='Enter User Name'
                            required=''
                        />
                        <div className='wizard-form-error' />
                    </div>
                </div>
                {
                    personalFormfields.map(elem => (
                        elem.type == 'dropdown' ? (
                            <div className='col-4'>
                                <label className='form-label'>{elem.label}*</label>
                                <div className='position-relative'>
                                    <select class="form-select" aria-label="Default select example">
                                        <option selected>{elem.placeholder}</option>
                                         {elem.options.map(elem2=>(
                                            <option value={elem2.value}>{elem2.value}</option>
                                         ))}
                                      
                                    </select>
                                    <div className='wizard-form-error' />
                                </div>
                            </div>

                        ) : 
                        elem.type=='input'?(
                            <div className='col-4'>
                    <label className='form-label'>{elem?.label}</label>
                    <div className='position-relative'>
                        <input
                            type={elem.type}
                            className='form-control wizard-required'
                            placeholder={elem?.placeholder}
                            required=''
                        />
                        <div className='wizard-form-error' />
                    </div>
                </div>
                        ):""
                    ))

                }

                <div className='col-sm-4'>
                    <label className='form-label'>Last Name*</label>
                    <div className='position-relative'>
                        <input
                            type='text'
                            className='form-control wizard-required'
                            placeholder='Father Name '
                            required=''
                        />
                        <div className='wizard-form-error' />
                    </div>
                </div>
                <div className='col-sm-4'>
                    <label className='form-label'>
                        Father Name*
                    </label>
                    <div className='position-relative'>
                        <input
                            type='text'
                            className='form-control wizard-required'
                            placeholder='Enter Card Expiration'
                            required=''
                        />
                        <div className='wizard-form-error' />
                    </div>
                </div>
                <div className='col-sm-4'>
                    <label className='form-label'>Mother Name</label>
                    <div className='position-relative'>
                        <input
                            type='text'
                            className='form-control wizard-required'
                            placeholder='Gender'
                            required=''
                        />
                        <div className='wizard-form-error' />
                    </div>
                </div>
                <div className='col-4'>
                    <label className='form-label'>Class</label>
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
                <div className='col-4'>
                    <label className='form-label'>Division</label>
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
                <div className='col-4'>
                    <label className='form-label'>Roll Number</label>
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
                <div className='col-4'>
                    <label className='form-label'>Gr No</label>
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
                <div className='col-4'>
                    <label className='form-label'>Contact Number</label>
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
                <div className='col-4'>
                    <label className='form-label'>Email</label>
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
                <div className='col-4'>
                    <label className='form-label'>Password</label>
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
                <div className='col-4'>
                    <label className='form-label'>Date of Birth</label>
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
                <div className='col-4'>
                    <label className='form-label'>Blood Group</label>
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
                <div className='col-4'>
                    <label className='form-label'>Father Contact Number</label>
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
                <div className='col-4'>
                    <label className='form-label'>Mother Contact Number</label>
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
                <div className='col-4'>
                    <label className='form-label'>Photo</label>
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
                <div className='col-4'>
                    <label className='form-label'>Current Address</label>
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
                <div className='col-4'>
                    <label className='form-label'>Current City</label>
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
                <div className='col-4'>
                    <label className='form-label'>Current State</label>
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
                <div className='col-4'>
                    <label className='form-label'>Current Pin</label>
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

                <div className='col-4'>
                    <label className='form-label'>Permanent Address</label>
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
                <div className='col-4'>
                    <label className='form-label'>Permanent City</label>
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
                <div className='col-4'>
                    <label className='form-label'>Permanent State</label>
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
                <div className='col-4'>
                    <label className='form-label'>Permanent Pin</label>
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







            </div>
        </>
    )

}

export default PersonalInformationForm