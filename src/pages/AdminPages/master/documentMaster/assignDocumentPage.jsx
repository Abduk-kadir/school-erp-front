
import GenericTableDataLayer from "../../../../components/GenericTable";
import { useState } from "react";
import AssignDocument from "../../../../components/child/master/documentMaster/assignDocument";

const AssignDocumentPage = () => {
 
  
  return (
    <>
            <AssignDocument/>
             
              <GenericTableDataLayer
               
             
                url={'http://localhost:5000/api/requirement-documents'}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"class_name",title:"Class"},
                   {data:"document_type",title:"Document"},
                    {data:"category",title:"Category"},
                     {data:"condition_attribute",title:"condition_attribute"},
                      {data:"condition_value",title:" Condition value"},
                       {data:"is_mandatory",title:"Mandatory"},
                    
                 
                ]}
                
                />

     

    </>
  );
};

export default AssignDocumentPage;
