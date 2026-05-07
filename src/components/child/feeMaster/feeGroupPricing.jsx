import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";



const initialForm = {
  feeGroupId: "",
  frequency: "",
  fee_for:"",
  isAdded_student:"unAdded",
  classId: "",
  backwardClass: false,
  gender: "both",
  is_elective:"no",
  subject_id:null,
  start_month:""
  
};

const priceRowFromFeehead = (feehead) => ({
  feehead: feehead.id,
  feehead_name: feehead.fee_head_name,
  apr_total: 0,
  may_total: 0,
  jun_total: 0,
  jul_total: 0,
  aug_total: 0,
  sep_total: 0,
  oct_total: 0,
  nov_total: 0,
  dec_total: 0,
  jan_total: 0,
  feb_total: 0,
  mar_total: 0,
});

const MONTH_TOTAL_FIELDS = [
  "apr_total",
  "may_total",
  "jun_total",
  "jul_total",
  "aug_total",
  "sep_total",
  "oct_total",
  "nov_total",
  "dec_total",
  "jan_total",
  "feb_total",
  "mar_total",
];

function mergeFeeArrays(...arrays) {
  const map = new Map();
  arrays.forEach(arr => {
    arr.forEach(item => {
      const id = item.feehead;

      if (!map.has(id)) {
        map.set(id, { ...item }); // First time - copy the object
      } else {
        const existing = map.get(id);
        const months = ["apr_total","may_total","jun_total","jul_total","aug_total","sep_total","oct_total","nov_total","dec_total","jan_total","feb_total","mar_total"];
        
        months.forEach(month => {
          existing[month] = (existing[month] || 0) + (item[month] || 0);
        });
      }
    });
  });

  return Array.from(map.values());
}





const FeeGroupPricing = () => {
  const [feeheads, setFeeheads] = useState([]);
  const [feegroup,setFeegroup]=useState([])
  const [feesType,setFeesType]=useState([])
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [yearprice, setYearprice] = useState([]);
  const [halfyearprice1, setHalfyearprice1] = useState([]);
  const [halfyearprice2, setHalfyearprice2] = useState([]);
  const [quaterprice1, setQuaterprice1] = useState([]);
  const [quaterprice2, setQuaterprice2] = useState([]);
  const [quaterprice3, setQuaterprice3] = useState([]);
  const [quaterprice4,setQuaterprice4]=useState([])
  
  const frequencies = ["Monthly", "Quaterly","Halfyearly",];
  let tableHeads = [
    "Fee Head",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ];


   //this is for sortin the table header base on the selected month
  function sortMonthsFrom(month) {
    const feeHead = tableHeads[0];
    const months = tableHeads.slice(1); // only months
  
    const index = months.indexOf(month);
  
    if (index === -1) return tableHeads;
  
    const sortedMonths = [
      ...months.slice(index),
      ...months.slice(0, index),
    ];
  
    return [feeHead, ...sortedMonths];
  }
   tableHeads=form?.start_month==""?tableHeads:sortMonthsFrom(form?.start_month)

   //this is for sortin tabel fields based on the selected month
  const sortedMonthFields = (() => {
    if (!form?.start_month) return MONTH_TOTAL_FIELDS;
    const startField = `${form.start_month.toLowerCase()}_total`;
    const startIdx = MONTH_TOTAL_FIELDS.indexOf(startField);
    if (startIdx === -1) return MONTH_TOTAL_FIELDS;
    return [
      ...MONTH_TOTAL_FIELDS.slice(startIdx),
      ...MONTH_TOTAL_FIELDS.slice(0, startIdx),
    ];
  })();
  const updatePriceRow = (setRows, feeheadId, field, e) => {
    const raw = e.target.value;
    const parsed = raw === "" ? 0 : Number(raw);
    const next = Number.isFinite(parsed) ? parsed : 0;
    setRows((prev) =>
      prev.map((row) =>
        row.feehead === feeheadId ? { ...row, [field]: next } : row
      )
    );
  };

  const makeTable = (data, setData) => {
    return (
      <div className="table-responsive rounded border shadow-sm mt-4">
        <table className="table table-sm table-bordered table-hover align-middle mb-0">
          <thead>
            <tr>
              {tableHeads.map((elem) => (
                <th
                  key={elem}
                  className="small text-nowrap px-2 py-2 text-dark"
                  style={{ backgroundColor: "#d8f0e0" }}
                >
                  {elem}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.feehead}>
                <th scope="row" className="small fw-medium text-nowrap bg-white px-2 py-2">
                  {item.feehead_name}
                </th>
                {sortedMonthFields.map((field) => (
                  <td key={field} className="p-1">
                    <input
                     
                      className="form-control form-control-sm border-0 bg-transparent px-2"
                      value={item[field]}
                      onChange={(e) => updatePriceRow(setData, item.feehead, field, e)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


 // console.log('feegroup',feegroup)

  useEffect(() => {
    const fetchFeeheads = async () => {
      try {
        const feesTypeRes = await axios.get(`${baseURL}/api/fees-types`);
        const classesRes = await axios.get(`${baseURL}/api/classes`);
        const feegroupRes=await axios.get(`${baseURL}/api/fee-groups`);
        const subjectsRes=await axios.get(`${baseURL}/api/subjects`);
        setFeesType(feesTypeRes.data.data ?? []);
        setClasses(classesRes.data.data ?? []);
        setFeegroup(feegroupRes.data.data??[])
        setSubjects(subjectsRes.data.data ?? []);
      } catch (error) {
        console.error("Error fetching fee heads:", error);
      }
    };
    fetchFeeheads();
  }, []);

  useEffect(() => {
    setYearprice(feeheads.map(priceRowFromFeehead));
    setHalfyearprice1(feeheads.map(priceRowFromFeehead));
    setHalfyearprice2(feeheads.map(priceRowFromFeehead));
    setQuaterprice1(feeheads.map(priceRowFromFeehead));
    setQuaterprice2(feeheads.map(priceRowFromFeehead));
    setQuaterprice3(feeheads.map(priceRowFromFeehead));
    setQuaterprice4(feeheads.map(priceRowFromFeehead));
  }, [feeheads]);


  //this useeffect is use for sorting the table fields base on the selected mont
  useEffect(() => {
    if (!form?.start_month) return;

    const startField = `${form.start_month.toLowerCase()}_total`;
    const startIdx = MONTH_TOTAL_FIELDS.indexOf(startField);
    if (startIdx === -1) return;

    const sortedFields = [
      ...MONTH_TOTAL_FIELDS.slice(startIdx),
      ...MONTH_TOTAL_FIELDS.slice(0, startIdx),
    ];

    const sortRows = (rows) =>
      rows.map((row) => {
        const sorted = {
          feehead: row.feehead,
          feehead_name: row.feehead_name,
        };
        sortedFields.forEach((field) => {
          sorted[field] = row[field];
        });
        return sorted;
      });

    setYearprice((prev) => sortRows(prev));
    setHalfyearprice1((prev) => sortRows(prev));
    setHalfyearprice2((prev) => sortRows(prev));
    setQuaterprice1((prev) => sortRows(prev));
    setQuaterprice2((prev) => sortRows(prev));
    setQuaterprice3((prev) => sortRows(prev));
    setQuaterprice4((prev) => sortRows(prev));
  }, [form?.start_month]);

 console.log('halfyearprice1',halfyearprice1)
 console.log('halfyearprice2',halfyearprice2)


  useEffect(() => {
    const fetchFeeheads = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/fee-groups/fee-heads/${form.feeGroupId}`);
        setFeeheads(response.data.data ?? []);
      } catch (error) {
        console.error("Error fetching fee heads:", error);
      }
    };
    fetchFeeheads();
  }, [form.feeGroupId]);

  const updateField = (field) => (e) => {
   
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
    let groupdetails={
      feegroupid: form.feeGroupId,
      frequency: form.frequency,
      classId: form.classId,
      isbackwardclass: form.backwardClass,
      gender: form.gender,
      fee_for: form.fee_for,
      isAdded_student: form.isAdded_student,
      is_elective: form.is_elective,
      subject_id: form.subject_id,
    }
       if(form.frequency=="Halfyearly"){
        let groupPricingRecord=mergeFeeArrays(halfyearprice1,halfyearprice2)
        //console.log('group details',groupdetails)
        //console.log('group pricing record',groupPricingRecord)
        await axios.post(`${baseURL}/api/fee-groups/groupdetailandpricing`,{groupdetails,groupPricingRecord})
        
       }
       if(form.frequency=="Quaterly"){
        let groupPricingRecord=mergeFeeArrays(quaterprice1,quaterprice2,quaterprice3,quaterprice4)
        //console.log('group details',groupdetails)
        //console.log('group pricing record',groupPricingRecord)
        await axios.post(`${baseURL}/api/fee-groups/groupdetailandpricing`,{groupdetails,groupPricingRecord})
       }
       if(form.frequency=="Monthly"){
       // console.log('group details',groupdetails)
        //console.log('year price is:',yearprice)
        await axios.post(`${baseURL}/api/fee-groups/groupdetailandpricing`,{groupdetails,groupPricingRecord:yearprice})

       }
       alert('Fee group pricing added successfully')
  }catch(error){
    alert(error?.response?.data?.message||'failed to add fee group pricing')
  }
     

  };

  return (
    <div className="container py-3">
      <div className="row">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary-subtle border-0 py-3">
            <h6 className="mb-0 fw-semibold text-dark">Fee Group Pricing</h6>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>

              <div className="row mb-3 align-items-center">
                <label htmlFor="fee-for" className="col-sm-4 col-md-3 col-form-label text-sm-start">
                  Fee Type
                </label>
                <div className="col-sm-8 col-md-6">
                  <select
                    id="fee-for"
                    className="form-select"
                    value={form.fee_for}
                    onChange={updateField("fee_for")}
                  >
                    <option value="">Select Fee For</option>
                    {feesType.map((feesType) => (
                      <option key={feesType.id} value={feesType.id}>
                        {feesType.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3 align-items-center">
                <label htmlFor="fee-group" className="col-sm-4 col-md-3 col-form-label text-sm-start">
                  Fee Group
                </label>
                <div className="col-sm-8 col-md-6">
                  <select
                    id="fee-group"
                    className="form-select"
                   
                    value={form.feeGroupId}
                    onChange={updateField("feeGroupId")}
                  >
                    <option value="">Select Fee Group</option>
                    {feegroup.map((feegroup) => (
                      <option key={feegroup.id} value={feegroup.id}>
                        {feegroup.groupname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3 align-items-center">
                <label htmlFor="frequency" className="col-sm-4 col-md-3 col-form-label text-sm-start">
                  Frequency
                </label>
                <div className="col-sm-8 col-md-6">
                  <select
                    id="frequency"
                    className="form-select"
                    value={form.frequency}
                    onChange={updateField("frequency")}
                  >
                    <option value="">Select Frequency</option>
                    {frequencies.map((freq) => (
                      <option key={freq} value={freq}>
                        {freq}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3 align-items-center">
                <label htmlFor="class-select" className="col-sm-4 col-md-3 col-form-label text-sm-start">
                  Classes
                </label>
                <div className="col-sm-8 col-md-6">
                  <select
                    id="class-select"
                    className="form-select"
                    value={form.classId}
                    onChange={updateField("classId")}
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mb-3 align-items-center">
                <div className="col-sm-4 col-md-3 col-form-label text-sm-start">Is Backward Class</div>
                <div className="col-sm-8 col-md-6">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="backwardClass"
                      id="backward-yes"
                      value="yes"
                      checked={form.backwardClass === true}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, backwardClass: true }))
                      }
                    />
                    <label className="form-check-label ms-3" htmlFor="backward-yes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="backwardClass"
                      id="backward-no"
                      value="no"
                      checked={form.backwardClass === false}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, backwardClass: false }))
                      }
                    />
                    <label className="form-check-label ms-3" htmlFor="backward-no">
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="row mb-3 align-items-center">
                <div className="col-sm-4 col-md-3 col-form-label text-sm-start">Gender</div>
                <div className="col-sm-8 col-md-6">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="gender-male"
                      value="male"
                      checked={form.gender === "male"}
                      onChange={updateField("gender")}
                    />
                    <label className="form-check-label ms-3" htmlFor="gender-male">
                      Male
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="gender-female"
                      value="female"
                      checked={form.gender === "female"}
                      onChange={updateField("gender")}
                    />
                    <label className="form-check-label ms-3 " htmlFor="gender-female">
                      Female
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="gender-both"
                      value="both"
                      checked={form.gender === "both"}
                      onChange={updateField("gender")}
                    />
                    <label className="form-check-label ms-3" htmlFor="gender-both">
                      Both
                    </label>
                  </div>
                </div>
              </div>


              <div className="row mb-3 align-items-center">
                <div className="col-sm-4 col-md-3 col-form-label text-sm-start">Student Type</div>
                <div className="col-sm-8 col-md-6">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="isAdded_student"
                      id="isAdded_student-yes"
                      value="added"
                      checked={form.isAdded_student === "added"}
                      onChange={updateField("isAdded_student")}
                    />
                    <label className="form-check-label ms-3" htmlFor="gender-male">
                      added
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="isAdded_student"
                      id="isAdded_student-no"
                      value="unAdded"
                      checked={form.isAdded_student === "unAdded"}
                      onChange={updateField("isAdded_student")}
                    />
                    <label className="form-check-label ms-3 " htmlFor="isAdded_student-no">
                      unAdded
                    </label>
                  </div>
                  
                </div>
              </div>

              <div className="row mb-3 align-items-center">
                <div className="col-sm-4 col-md-3 col-form-label text-sm-start">Is Elective</div>
                <div className="col-sm-8 col-md-6">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="is_elective"
                      id="is_elective-yes"
                      value="yes"
                      checked={form.is_elective === "yes"}
                      onChange={updateField("is_elective")}
                    />
                    <label className="form-check-label ms-3" htmlFor="is_elective-yes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="is_elective"
                      id="is_elective-no"
                      value="no"
                      checked={form.is_elective === "no"}
                      onChange={updateField("is_elective")}
                    />
                    <label className="form-check-label ms-3 " htmlFor="is_elective-no">
                      No
                    </label>
                  </div>
                  
                </div>
              </div>
              {form.is_elective === "yes" && (
                <div className="row mb-3 align-items-center">
                  <div className="col-sm-4 col-md-3 col-form-label text-sm-start">
                    Subject
                  </div>
                  <div className="col-sm-8 col-md-6">
                    <select
                      id="subject-select"
                      className="form-select"
                      value={form.subject_id}
                      onChange={updateField("subject_id")}
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="row mb-3 align-items-center">
                <label htmlFor="class-select" className="col-sm-4 col-md-3 col-form-label text-sm-start">
                  Selected Month
                </label>
                <div className="col-sm-8 col-md-6">
                  <select
                    id="class-select"
                    className="form-select"
                    value={form?.start_month}
                    onChange={updateField("start_month")}
                  >
                    <option value="">Select Month</option>
                    {[...tableHeads.slice(1)].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              


              <div className="row mt-4 pt-2 border-top">
                <div className="col-12 d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary px-4">
                    Submit
                  </button>
                </div>
              </div>
              {form.frequency === "Monthly" && makeTable(yearprice, setYearprice)}
              {form.frequency === "Quaterly" && (
                <>
                  {makeTable(quaterprice1, setQuaterprice1)}
                  {makeTable(quaterprice2, setQuaterprice2)}
                  {makeTable(quaterprice3, setQuaterprice3)}
                  {makeTable(quaterprice4, setQuaterprice4)}
                </>
              )}
              {form.frequency === "Halfyearly" && (
                <>
                  {makeTable(halfyearprice1, setHalfyearprice1)}
                  {makeTable(halfyearprice2, setHalfyearprice2)}
                </>
              )}


            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeGroupPricing;
