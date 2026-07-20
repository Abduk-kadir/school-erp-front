
import GenericTableDataLayer from "../components/GenericTable";
import baseURL from "../utils/baseUrl";
const RolePage = () => {

  // let data=[{name:"arman",email:"ak8871639@gmail.com",mobile:"9140196641"},{name:"abdul",email:"ak8871639@gmail.com",mobile:"9140196641"}]
  // const columns = Object.keys(data[0]);
  return (
    <>

        <GenericTableDataLayer
                pageName="Roles"
                url={`${baseURL}/api/roles`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"role_name",name:"role_name",title:"Role"},
                 
                ]}
                
                />

    </>
  );
};

export default RolePage;
