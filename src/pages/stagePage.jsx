import GenericTableDataLayer from "../components/GenericTable";
import baseURL from "../utils/baseUrl";
const StagePage = () => {

  // let data=[{name:"arman",email:"ak8871639@gmail.com",mobile:"9140196641"},{name:"abdul",email:"ak8871639@gmail.com",mobile:"9140196641"}]
  // const columns = Object.keys(data[0]);
  return (
    <>

        <GenericTableDataLayer
                url={`${baseURL}/api/stage`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"name",name:"name",title:"Stage"},
                 
                ]}
                
                />

    </>
  );
};

export default StagePage;
