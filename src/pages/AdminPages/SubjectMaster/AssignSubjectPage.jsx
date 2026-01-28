
import GenericTableDataLayer from "../../../components/GenericTable";
import AssignSubject from "../../../components/child/subjectMaster/AssignSubject";
import { useState } from "react";
const AssignSubjectPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  return (
    <>

              <AssignSubject/>
              <GenericTableDataLayer
                key={refreshKey}
             
                url={'http://localhost:5000/api/subjects'}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"value",name:"value",title:"Subject Name"},
                  {data:"subject_code",name:"subject_code",title:"Subject Code"},
                  {data:"abbreviation_name",name:"abbreviation_name",title:"Abbreviation Name"},
                  {data:"status",name:"status",title:"Status"},
                ]}
                
                />

     

    </>
  );
};

export default AssignSubjectPage;
