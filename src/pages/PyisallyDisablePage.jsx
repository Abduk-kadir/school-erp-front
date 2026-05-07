import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import GenericTableDataLayer from "../components/GenericTable";

import AddPhisallyDisable from "../components/child/master/AddPhisallyDisable";

const PhisallyDisablePage = () => {
  return (
    <>

     <AddPhisallyDisable/>

       <GenericTableDataLayer
                       url={'http://localhost:5000/api/physically-disable'}
                        columns={[
                         {data:"id",name:"id",title : "ID"},
                         {data:"value",title : "Disabiltiy"},
                       ]}
                       
                       />

     

    </>
  );
};

export default PhisallyDisablePage;
