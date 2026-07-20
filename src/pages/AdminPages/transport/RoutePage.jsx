
import GenericTableDataLayer from "../../../components/GenericTable"
import { useState } from "react";
import AddRoute from "../../../components/child/transport/AddRoute";
import baseURL from "../../../utils/baseUrl";

const RoutePage = () => {
 
  
  return (
    <>
            <AddRoute/>
             
              <GenericTableDataLayer
                pageName="Routes"


                url={`${baseURL}/api/routes`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"route_name",title:"Route Name"},
                 
                    
                 
                ]}
                
                />

     

    </>
  );
};

export default RoutePage;
