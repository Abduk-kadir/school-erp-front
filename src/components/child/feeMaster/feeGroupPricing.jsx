import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";



const initialForm = {
  feeGroupId: "",
  frequency: "",
  classId: "",
  backwardClass: false,
  gender: "",
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
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [yearprice, setYearprice] = useState([]);
  const [halfyearprice1, setHalfyearprice1] = useState([]);
  const [halfyearprice2, setHalfyearprice2] = useState([]);
  const [quaterprice1, setQuaterprice1] = useState([]);
  const [quaterprice2, setQuaterprice2] = useState([]);
  const [quaterprice3, setQuaterprice3] = useState([]);
  const frequencies = ["Monthly", "Quaterly", "Yearly", "One Time","Halfyearly","Four Monthly"];
  const tableHeads = [
    "Fee Head",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
  ];

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
                {MONTH_TOTAL_FIELDS.map((field) => (
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


  console.log('feegroup',feegroup)

  useEffect(() => {
    const fetchFeeheads = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/fee-heads`);
        const classesRes = await axios.get(`${baseURL}/api/classes`);
        const feegroupRes=await axios.get(`${baseURL}/api/fee-groups`);
        setFeeheads(response.data.data ?? []);
        setClasses(classesRes.data.data ?? []);
        setFeegroup(feegroupRes.data.data??[])
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
  }, [feeheads]);

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
      gender: form.gender,}
       if(form.frequency=="Halfyearly"){
        let groupPricingRecord=mergeFeeArrays(halfyearprice1,halfyearprice2)
        console.log('group details',groupdetails)
        console.log('group pricing record',groupPricingRecord)
        await axios.post(`${baseURL}/api/fee-groups/groupdetailandpricing`,{groupdetails,groupPricingRecord})
        
       }
       if(form.frequency=="Quaterly"){
        let groupPricingRecord=mergeFeeArrays(quaterprice1,quaterprice2,quaterprice3)
        console.log('group details',groupdetails)
        console.log('group pricing record',groupPricingRecord)
        await axios.post(`${baseURL}/api/fee-groups/groupdetailandpricing`,{groupdetails,groupPricingRecord})
       }
       if(form.frequency=="Monthly"){
        console.log('group details',groupdetails)
        console.log('year price is:',yearprice)
        await axios.post(`${baseURL}/api/fee-groups/groupdetailandpricing`,{groupdetails,yearprice})

       }
  }catch(error){

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
