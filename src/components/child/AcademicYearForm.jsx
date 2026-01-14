import { Icon } from "@iconify/react/dist/iconify.js";

const AcademicYearForm = () => {
  return (
    <div className='col-md-12 mb-10'>
      <div className='card'>
        <div className='card-header'>
          <h5 className='card-title mb-0'>Add Classes</h5>
        </div>
        <div className='card-body'>
          <div className='row mb-24 gy-3 align-items-center'>
            <label className='form-label mb-0 col-sm-2'>Academic Year Name</label>
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
            <label className='form-label mb-0 col-sm-2'>Start Date</label>
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
            <label className='form-label mb-0 col-sm-2'>End Date</label>
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

export default AcademicYearForm;
