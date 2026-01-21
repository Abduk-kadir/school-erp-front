

import GenericTableDataLayer from "../../../components/GenericTable";
import AddSubject from "../../../components/child/subjectMaster/AddSubject";
import { useState } from "react";

const SubjectPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  return (
    <>

              <AddSubject/>
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

export default SubjectPage;
