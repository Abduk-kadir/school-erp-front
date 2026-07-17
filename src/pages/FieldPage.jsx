import GenericTableDataLayer from "../components/GenericTable";
import AddFiled from "../components/child/addField";
import baseURL from "../utils/baseUrl";
const FiledPage = () => {

  
  return (
    <>
       <AddFiled/>
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

export default FiledPage;
