import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import GenericTableDataLayer from "../components/GenericTable";
import ClassHorizontalInputFormWithIcons from "../components/child/ClassHorizontalInputFormWithIcons";

const ClassPage = () => {
  return (
    <>

      <ClassHorizontalInputFormWithIcons/>

       <GenericTableDataLayer
                       url={'http://localhost:5000/api/classes'}
                        columns={[
                         {data:"id",name:"id",title : "ID"},
                         {data:"class_name",name:"class_name",title:"Class Name"},
                         {data:"class_code",name:"class_code",title:"Class Code"},
                         {data:"fall_in_category",name:"fall_in_category",title:"Category"},
                         {data:"admission_form_fee",name:"admission_form_fee",title:"Fee"},
                         {data:"status",name:"status",title:"Status"},
                       ]}
                       
                       />

     

    </>
  );
};

export default ClassPage;
