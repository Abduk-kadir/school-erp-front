
import GenericTableDataLayer from "../../../components/GenericTable";
import AddProgram from "../../../components/child/subjectMaster/AddProgram";
import { useState } from "react";
import baseURL from "../../../utils/baseUrl";

const ProgramPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  return (
    <>

              <AddProgram/>
              <GenericTableDataLayer
                url={`${baseURL}/api/programs`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"program_name",title:"Program Name"},
                  
                ]}
                
                />

     

    </>
  );
};

export default ProgramPage;
