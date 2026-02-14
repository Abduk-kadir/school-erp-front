import axios from "axios";
import { useEffect, useState } from "react";
import baseURL from "../../utils/baseUrl";
import { filterHash } from "@fullcalendar/core/internal";
import Spinner from "./Loader";
const AddField = () => {
  const [stages, setStages] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldTypeId, setFieldTypeId] = useState("");
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isRequired, setIsRequired] = useState("false"); // "true" or "false"
  const [order, setOrder] = useState("");
  const [stageId, setStageId] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableName,setTable]=useState([
    'Cast','Phyically_disable','State','City'
  ])
  const [selectedTable,setselectTable]=useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stageRes, fieldTypeRes] = await Promise.all([
          axios.get(`${baseURL}/api/stage`),
          axios.get(`${baseURL}/api/fieldType`),
          
          
        ]);

        setStages(stageRes.data?.data || []);
        setFieldTypes(fieldTypeRes.data?.data || []);
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to load stages or field types");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tableName=''
    let columnType=''
    console.log('stages:',stages)
    console.log('stage id:',stageId)
    let selStag=stages.find(elem=>elem?.id==stageId)
    let setStaName=selStag?.name
    switch(setStaName){
      case "Personal Information":
        tableName='personalinformations'
        columnType='VARCHAR(255)'
        break;
       case "Parent Particular":
        tableName='parentparticulars'
        columnType='VARCHAR(255)'
        break;
       case "Education Detail":
        tableName='educationdetails'
        columnType='VARCHAR(255)'
        break;
        case "Other Information":
        tableName='otherinformations'
        columnType='VARCHAR(255)'
        break;   
    }
    console.log(columnType)
    console.log(tableName)

    try {
      const payload = {
        name:fieldName,
        fieldTypeId: Number(fieldTypeId),
        label,
        placeholder,
        isRequired: isRequired === "true",
        tableName:tableName,
        columnType:columnType,
        order: Number(order),
      };
      console.log(fieldTypeId)
       setLoading(true)
      const res = await axios.post(
          `http://localhost:5000/api/stage/addfield/${stageId}`,
          payload
        );
    
     let {id}=res?.data?.data;
     let payload2={
      tablename:selectedTable
     }
     const res2 = await axios.post(
          `http://localhost:5000/api/fieldMultiple/${id}`,
          payload2
        );
     
  
      console.log("Success", res2?.data);
      
    } catch (error) {
      console.error("Submit error:", error.response?.data || error.message);
    }
    finally{
     setTimeout(() => setLoading(false), 1200);
    }
     
  };


  return (
    <div className="card">
      <div className="card-header">
        <h6 className="card-title mb-0">Add Field to Stage</h6>
      </div>

      <div className="card-body">



       
          <div className="row gy-3">
            <div className="col-3">
              <label className="form-label">Field Name *</label>
              <input
                type="text"
                className="form-control"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                required
              />
            </div>

            <div className="col-3">
              <label className="form-label">Type of Field *</label>
              <select
                className="form-select"
                value={fieldTypeId}
                onChange={(e) => setFieldTypeId(e.target.value)}
                required
              >
                <option value="">Select type of field</option>
                {fieldTypes.map((type) => (
                  <option key={type.id || type._id} value={type.id || type._id}>
                    {type.typeName}
                  </option>
                ))}
              </select>
            </div>

             <div className="col-3">
              <label className="form-label">Select Values</label>
              <select
                className="form-select"
                value={selectedTable}
                onChange={(e) => setselectTable(e.target.value)}
                required
              >
                <option value="">select values</option>
                {tableName.map((elem) => (
                  <option key={elem}>
                    {elem}
                  </option>
                ))}
              </select>
            </div>


            <div className="col-3">
              <label className="form-label">Label</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <div className="col-3">
              <label className="form-label">Placeholder</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter placeholder"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
              />
            </div>

            <div className="col-3">
              <label className="form-label">Required</label>
              <select
                className="form-select"
                value={isRequired}
                onChange={(e) => setIsRequired(e.target.value)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div className="col-3">
              <label className="form-label">Order</label>
              <input
                type="number"
                className="form-control"
                min="0"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="col-3">
              <label className="form-label">Stage *</label>
              <select
                className="form-select"
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                required
              >
                <option value="">Select Stage</option>
                {stages.map((stage) => (
                  <option key={stage.id || stage._id} value={stage.id || stage._id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {loading?<Spinner/>:<button
            type="submit"
            className="btn btn-primary mt-5"
            onClick={handleSubmit}

          >
            Submit
          </button>
           }
       
      </div>
    </div>
  );
};

export default AddField;