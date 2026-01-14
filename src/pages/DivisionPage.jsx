
import GenericTableDataLayer from "../components/GenericTable";

const DivisionPage = () => {
  return (
    <>

     

         <GenericTableDataLayer
                url={'http://localhost:5000/api/divisions'}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"division_name",name:"division_name",title:"Division Name"},
                  {data:"division_code",name:"division_code",title:"Division Code"},
                ]}
                
                />

     

    </>
  );
};

export default DivisionPage;
