import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
//import ClassTableDataLayer from "../components/ClassTableDataLayer";
import GenericTableDataLayer from "../components/GenericTable";
import AddCast from "../components/child/master/AddCast";
const CastPage = () => {
  return (
    <>

     <AddCast/>

        {/* TableDataLayer */}
        <GenericTableDataLayer
        url={'http://localhost:5000/api/castes'}
         columns={[
          {data:"id",name:"id",title : "ID"},
          {data:"value",title:"Cast"},
        ]}
        
        />

     

    </>
  );
};

export default CastPage;
