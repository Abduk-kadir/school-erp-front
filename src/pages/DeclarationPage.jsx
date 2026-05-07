
import GenericTableDataLayer from "../components/GenericTable";
import DeclarationStatement from "../components/child/master/Declaration/DeclarationStatement";
const DeclarationPage = () => {
  return (
    <>

       <DeclarationStatement/>
       <GenericTableDataLayer
                url={'http://localhost:5000/api/declarations'}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"class.class_name",name:"class_name",title:"Class Name"},
                  {data:'content',title:'Content'}
                  
                  
                ]}
                
                />


    </>
  );
};

export default DeclarationPage;
