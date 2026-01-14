import { Icon } from "@iconify/react/dist/iconify.js";

const EmployeeForm = () => {
  return (
    <div className='col-md-12 mb-10'>
      <div className='card'>
        <div className='card-header'>
          <h5 className='card-title mb-0'>Add Employee</h5>
        </div>
        <div className='card-body'>
          <div className='row mb-24 gy-3 align-items-center'>
            <label className='form-label mb-0 col-sm-2'>Employee Name</label>
            <div className='col-sm-10'>
              <div className='icon-field'>
                <span className='icon'>
                  <Icon icon='f7:person' />
                </span>
                <input
                  type='text'
                  name='#0'
                  className='form-control'
                  placeholder='Enter Academic Year'
                />
              </div>
            </div>
          </div>
          <div className='row mb-24 gy-3 align-items-center'>
            <label className='form-label mb-0 col-sm-2'>Father Name</label>
            <div className='col-sm-10'>
              <div className='icon-field'>
                <span className='icon'>
                  <Icon icon='f7:person' />
                </span>
                <input
                  type='text'
                  name='#0'
                  className='form-control'
                  placeholder='Enter Start Date'
                />
              </div>
            </div>
          </div>
           <div className='row mb-24 gy-3 align-items-center'>
            <label className='form-label mb-0 col-sm-2'>Husband/wife Name</label>
            <div className='col-sm-10'>
              <div className='icon-field'>
                <span className='icon'>
                  <Icon icon='f7:person' />
                </span>
                <input
                  type='text'
                  name='#0'
                  className='form-control'
                  placeholder='Enter Date'
                />
              </div>
            </div>
          </div>
            <div className='row mb-24 gy-3 align-items-center'>
            <label className='form-label mb-0 col-sm-2'>Sir Name</label>
            <div className='col-sm-10'>
              <div className='icon-field'>
                <span className='icon'>
                  <Icon icon='f7:person' />
                </span>
                <input
                  type='text'
                  name='#0'
                  className='form-control'
                  placeholder='Enter Date'
                />
              </div>
            </div>
          </div>
            <div className='row mb-24 gy-3 align-items-center'>
            <label className='form-label mb-0 col-sm-2'>Date of Birth</label>
            <div className='col-sm-10'>
              <div className='icon-field'>
                <span className='icon'>
                  <Icon icon='f7:person' />
                </span>
                <input
                  type='text'
                  name='#0'
                  className='form-control'
                  placeholder='Enter Date'
                />
              </div>
            </div>
          </div>
            <div className='row mb-24 gy-3 align-items-center'>
            <label className='form-label mb-0 col-sm-2'>Mobile Number</label>
            <div className='col-sm-10'>
              <div className='icon-field'>
                <span className='icon'>
                  <Icon icon='f7:person' />
                </span>
                <input
                  type='text'
                  name='#0'
                  className='form-control'
                  placeholder='Enter Date'
                />
              </div>
            </div>
          </div>
            <div className='row mb-24 gy-3 align-items-center'>
            <label className='form-label mb-0 col-sm-2'>Rfid</label>
            <div className='col-sm-10'>
              <div className='icon-field'>
                <span className='icon'>
                  <Icon icon='f7:person' />
                </span>
                <input
                  type='text'
                  name='#0'
                  className='form-control'
                  placeholder='Enter Date'
                />
              </div>
            </div>
          </div>
            <div className='row mb-24 gy-3 align-items-center'>
            <label className='form-label mb-0 col-sm-2'>Gender</label>
            <div className='col-sm-10 d-flex align-items-center gap-4'>
                 <input
                 class="form-check-input" type="radio"
                />
                <label class="form-check-label" for="exampleRadios1">
                Male
               </label>
                <input
                 class="form-check-input" type="radio"
                />
                <label class="form-check-label" for="exampleRadios1">
                Female
               </label>
              
            </div>
          </div>
         
          <div className='row mb-24 gy-3 align-items-center'>
            <label className='form-label mb-0 col-sm-2'>Status</label>
            <div className='col-sm-10'>
              <select className='form-select' defaultValue='US'>
                  <option value='US'>Active</option>
                  <option value='UK'>In Active</option>
                  
                </select>
               
            </div>
          </div>
          
          
          <button type='submit' className='btn btn-primary-600'>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
