
import GenericTableDataLayer from "../../../../components/GenericTable";

import { useState } from "react";
import AddDocument from "../../../../components/child/master/documentMaster/AddDocument";
const AddDocumentPage = () => {
 
  
  return (
    <>

              <AddDocument/>
              <GenericTableDataLayer
               
             
                url={'http://localhost:5000/api/document-types'}
                 columns={[
                  {data:"id",name:"id",title :"ID"},
                  {data:"name",title:"Document Name"},
                 
                ]}
                
                />

     

    </>
  );
};

export default AddDocumentPage;
