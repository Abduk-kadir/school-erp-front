import GenericTableDataLayer from "../components/GenericTable";
import AddFiled from "../components/child/addField";
const AllFiledPage = () => {

  
  return (
    <>
       <AddFiled/>
        <GenericTableDataLayer
                url={`http://localhost:5000/api/allfield`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"stageName",name:"stageName",title:"Stage"},
                  {data:"name",title:"Name of Field"},
                  {data:'fieldTypeName',title:"Type of Field"},
                  {data:"label",name:"lable",title:"Label"},
                  {data:"placeholder",name:"placeholder",title:"Placeholder"},
                 
                ]}
                
                />

    </>
  );
};

export default AllFiledPage;
