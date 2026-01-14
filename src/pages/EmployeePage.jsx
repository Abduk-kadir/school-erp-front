
import GenericTableDataLayer from "../components/GenericTable";
const EmployeePage = () => {
  return (
    <>

       <GenericTableDataLayer
                url={'http://localhost:5000/api/employees'}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"father_name",name:"father_name",title:"Father Name"},
                  {data:"husband_wife_name",name:"husband_wife_name",title:"Husband/Wife"},
                  {data:"sir_name",name:"sir_name",title:"Sir Name"},
                   {data:"dob",name:"dob",title:"D.O.B"},
                  {data:"mobile_number",name:"mobile_number",title:"Mobile Number"},
                ]}
                
                />


    </>
  );
};

export default EmployeePage;
