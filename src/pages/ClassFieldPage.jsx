import GenericTableDataLayer from "../components/GenericTable";
import AddClassField from "../components/child/AddClassFiled";
import baseURL from "../utils/baseUrl";
const ClassFiledPage= () => {
  return (
    <>
       <AddClassField/>
        <GenericTableDataLayer
                url={`${baseURL}/api/stage/allfiled/${1}`}
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
