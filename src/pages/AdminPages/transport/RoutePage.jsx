
import GenericTableDataLayer from "../../../components/GenericTable"
import { useState } from "react";
import AddRoute from "../../../components/child/transport/AddRoute";

const RoutePage = () => {
 
  
  return (
    <>
            <AddRoute/>
             
              <GenericTableDataLayer
               
             
                url={'http://localhost:5000/api/routes'}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"route_name",title:"Route Name"},
                 
                    
                 
                ]}
                
                />

     

    </>
  );
};

export default RoutePage;
