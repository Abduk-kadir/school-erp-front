import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ClassTableDataLayer from "../components/ClassTableDataLayer";
import GenericTableDataLayer from "../components/GenericTable";

const CastPage = () => {
  return (
    <>

     

        {/* TableDataLayer */}
        <GenericTableDataLayer
        url={'http://localhost:5000/api/castes'}
         columns={[
          {data:"id",name:"id",title : "ID"},
          {data:"cast_name",name:"cast_name",title:"Cast"},
        ]}
        
        />

     

    </>
  );
};

export default CastPage;
