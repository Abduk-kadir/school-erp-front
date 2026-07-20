
import GenericTableDataLayer from "../../../components/GenericTable"
import { useState } from "react";
import AddSubRoute from "../../../components/child/transport/AddSubRoute";
import baseURL from "../../../utils/baseUrl";

const SubRoutePage = () => {
 
  return (
    <>
           
             <AddSubRoute/>
              <GenericTableDataLayer
                pageName="Sub Routes"
                url={`${baseURL}/api/subroutes`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"sub_route_name",title:"Sub Route Name"},
                  {data:"Route.route_name",title:"Route Name"},
                 
                ]}
                
                />

     

    </>
  );
};

export default SubRoutePage;
