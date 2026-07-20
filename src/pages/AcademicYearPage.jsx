

import GenericTableDataLayer from "../components/GenericTable";
import baseURL from "../utils/baseUrl";

const AcademicYearPage = () => {
  return (
    <>

     
 <GenericTableDataLayer
                pageName="Academic Years"
                url={`${baseURL}/api/academic-years`}
                 columns={[
                  {data:"id",name:"id",title : "ID"},
                  {data:"academic_year",name:"academic_year",title:"Academic Year"},
                  {data:"start_date",name:"start_date",title:"Start Date"},
                  {data:"end_date",name:"end_date",title:"End Date"},
                ]}
                
                />

     

    </>
  );
};

export default AcademicYearPage;
