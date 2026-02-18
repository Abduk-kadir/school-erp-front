import GenericTableDataLayer from "../components/GenericTable";
import AddClassField from "../components/child/AddClassFiled";
const ClassFiledPage= () => {
  return (
    <>
       <AddClassField/>
        <GenericTableDataLayer
                url={`http://localhost:5000/api/stage/allfiled/${1}`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"name",name:"name",title:"Field Name"},
                  {data:"label",name:"lable",title:"Label"},
                  {data:"placeholder",name:"placeholder",title:"Placeholder"},
                ]}
                
                />

    </>
  );
};

export default ClassFiledPage;
