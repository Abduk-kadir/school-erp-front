import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "../../utils/baseUrl";

const DeclarationStage = () => {
  const [regNo, setReg] = useState(1235)
  const [formNo, setFormNo] = useState(345)
  const [classId, setClassid] = useState(7)
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [declarationId,setDeclarationId]=useState(null)

  useEffect(()=>{
     let fetchData=async()=>{
      try{
      let {data}=await axios.get(`${baseURL}/api/declarations/5`)
      setDeclarationId(data?.data?.id)
      }
      catch(err){
        console.log('erro in fetching declaration')
      }
      
     }
     fetchData()
  },[])

  const handleSubmit = async() => {

    console.log({
      declarationId,
      regNo,
      formNo,
      classId,
      place,
      date,
      accepted,
    });
    try{
    await axios.post(`${baseURL}/api/student-declarations`,
    {reg_no:regNo,declaration_id:declarationId,accepted:accepted,date:date,location:place})
    alert('successfully addeed declaration')
    }
    catch(err){
      
   alert('not added declaration')

    }


  };

  return (
    <div className="d-flex justify-content-center">

      {/* First Row - centered */}
      <div className="card  border p-10" style={{ width: "60%" }}>
        <div className="d-flex gap-2 flex-row justify-content-between flex-wrap">
          <div>
            <label className="form-label fw-bold">Regestration Id</label>
            <input type="text" className="form-control mb-2" value={regNo} disabled />
          </div>
          <div>
            <label className="form-label fw-bold">Form No</label>
            <input type="text" className="form-control mb-2" value={formNo} disabled />
          </div>
          <div>
            <label className="form-label fw-bold">Standard Studing In</label>
            <input type="text" className="form-control mb-2" placeholder="Username" value={classId} disabled />
          </div>
        </div>

        <div className="mt-10">
          <p className="fw-semibold">fjdkfjdlkfjlkdjflkdjf
            fkldjflkdjfkldsjfkldf
            fjdlkjflkdjfkldjflkdjf
            fldkjfldkjfkldjfd
            fjdlkfjdklfjdkljfdf
            fjdkljfkldjflkdjfkldjf
            fjdkfjdlkjfldkjflkdjflk
          </p>
        </div>
        <div className="form-check d-flex align-items-center mb-2 border">
          <input
            className="form-check-input me-2"
            type="checkbox"
            id="check1"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <label className="form-check-label fw-bold" htmlFor="check1">
            I accept all terms and conditions for this Institute
          </label>
        </div>



        <div className="row mt-3">
          <div className="col-6 mb-2">
            <label className="form-label fw-bold">Place</label>
            <input type="text" className="form-control" value={place}
              onChange={(e) => setPlace(e.target.value)} />
          </div>

          <div className="col-6">
            <label className="form-label fw-bold">Date</label>
            <input type="date" className="form-control" value={date}
              onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="mt-10">
          <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
        </div>


      </div>
      

    </div>
  );
};

export default DeclarationStage;
