
import GenericTableDataLayer from "../../../components/GenericTable"
import { useState } from "react";
import AddSubRoute from "../../../components/child/transport/AddSubRoute";

const SubRoutePage = () => {
 
  return (
    <>
           
             <AddSubRoute/>
              <GenericTableDataLayer
                url={'http://localhost:5000/api/subroutes'}
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
