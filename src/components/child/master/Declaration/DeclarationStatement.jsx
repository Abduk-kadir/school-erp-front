
import DeclarationEditor from "./DeclarationEditor";
import axios from "axios";
import baseURL from "../../../../utils/baseUrl";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";


const DeclarationStatement = () => {

   const [classes,setClasses]=useState([])
   const [selectedClass,setSelectedClass]=useState('')
   const [personalInfoField,setPersonalInfoFiled]=useState('')

    useEffect(()=>{
        let  fetchData=async()=>{
         try{
         let {data}=await axios.get(`${baseURL}/api/classes`)
          setClasses(data?.data||[])
         }
         catch(err){
            console.log('not getting class data')
         }
        }
        fetchData()
    },[])
   

    const handleSaveDeclaration = async (htmlContent) => {
        // This will show the HTML content in console
         console.log('classId',selectedClass)
         console.log(htmlContent)
           try{
        await axios.post(`${baseURL}/api/declarations`, {class_id:Number(selectedClass),content:htmlContent})
        alert('declaration is saved successfully')
        }
        catch(err){
            alert('declartion saving error')
        }
      
    };

    return (
        <div>
            <div className="d-flex justify-content-between" style={{ maxWidth: 800, margin: "20px auto" }} aria-label="Default select example">
               
                     
                
                <div className="d-flex gap-4 align-items-center">
                    <h6 className="mb-0" >Select Class</h6>
                   
                    <select class="form-select form-select-sm" name='selectedClass'
                     value={selectedClass}
                     onChange={(e)=>setSelectedClass(e.target.value)}
                    style={{ width: "150px" }}>
                        <option selected>Open this select menu</option>
                        <option value="">Select</option>
                         {
                            classes.map(elem=>(
                                 <option value={elem.id}>{elem.class_name}</option>
                            ))
                         }
                    </select>
                </div>
                <div>
                    <Button className="btn btn-success">Submit</Button>
                </div>
            </div>
            <DeclarationEditor onSave={handleSaveDeclaration} />
        </div>
    );
};

export default DeclarationStatement;
