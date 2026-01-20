import GenericTableDataLayer from "../components/GenericTable";
const FiledTypePage = () => {

  // let data=[{name:"arman",email:"ak8871639@gmail.com",mobile:"9140196641"},{name:"abdul",email:"ak8871639@gmail.com",mobile:"9140196641"}]
  // const columns = Object.keys(data[0]);
  return (
    <>

        <GenericTableDataLayer
                url={'http://localhost:5000/api/fieldType'}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"typeName",name:"nametypeName",title:"Type of InputField"},
                 
                ]}
                
                />

    </>
  );
};

export default FiledTypePage;
