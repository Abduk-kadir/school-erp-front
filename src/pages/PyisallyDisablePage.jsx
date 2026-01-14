import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import GenericTableDataLayer from "../components/GenericTable";
import ClassHorizontalInputFormWithIcons from "../components/child/ClassHorizontalInputFormWithIcons";


const PhisallyDisablePage = () => {
  return (
    <>

     

       <GenericTableDataLayer
                       url={'http://localhost:5000/api/physically-disable'}
                        columns={[
                         {data:"id",name:"id",title : "ID"},
                         {data:"name",name:"name",title : "Disabiltiy"},
                       ]}
                       
                       />

     

    </>
  );
};

export default PhisallyDisablePage;
