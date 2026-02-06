
import GenericTableDataLayer from "../../../components/GenericTable";
import AddSubject from "../../../components/child/subjectMaster/AddSubject";
import AddInstitute from "../../../components/child/setting/AddInstitute";
import { useState } from "react";
const InstitutePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  return (
    <>

              <AddInstitute/>
              <GenericTableDataLayer
               
             
                url={'http://localhost:5000/api/institute'}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"name",title:"Name"},
                  {data:"code",title:"Code"},
                  
                ]}
                
                />

     

    </>
  );
};

export default InstitutePage;
