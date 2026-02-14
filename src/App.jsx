import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MasterLayout from "./masterLayout/MasterLayout"
import RouteScrollToTop from "./helper/RouteScrollToTop";

import ClassPage from "./pages/ClassPage";
import AcademicYearPage from "./pages/AcademicYearPage";
import DivisionPage from "./pages/DivisionPage";
import CastPage from "./pages/CastMasterPage";
import EmployeePage from './pages/EmployeePage'
import RolePage from "./pages/RolePage";
import PhisallyDisablePage from "./pages/PyisallyDisablePage";
import LoginPage from "./pages/LoginPage";

import StagePage from "./pages/stagePage";
import FiledTypePage from "./pages/FieldTypePae";
import FiledPage from "./pages/FieldPage";
import AllFiledPage from "./pages/AllFieldPage";
import OptionValuePage from "./pages/OptionValuePage";
import PersonalInformationForm from "./components/child/PersonalInformationForm";
import SubjectPage from "./pages/AdminPages/SubjectMaster/subjectPage";
import AssignSubjectPage from "./pages/AdminPages/SubjectMaster/AssignSubjectPage";
import AddDocumentPage from "./pages/AdminPages/master/documentMaster/addDocumentPage";
import AssignDocumentPage from "./pages/AdminPages/master/documentMaster/assignDocumentPage";
import ProgramPage from "./pages/AdminPages/SubjectMaster/ProgramPage";
import AssignSubjectPage2 from "./pages/AdminPages/SubjectMaster/AssingSubjectPage2";
import DeclarationStatement from "./components/child/master/Declaration/DeclarationStatement";
import InstitutePage from "./pages/AdminPages/setting/InstitutePage";
import Registration from "./components/child/Registration";
import SubjectStage from "./components/child/SubjectStage";
import AddmissionConformPage from "./pages/AdminPages/admissionMaster/AddmissionConformPage";
import SeatAllotmentPage from "./pages/AdminPages/admissionMaster/SeatAllotmentPage";
import StudentPage from "./pages/AdminPages/academic/StudentPage";
import DocumentStage from "./components/child/DocumentStage";
import DeclarationStage from "./components/child/DeclarationStage";
import ParentParticularStage from "./components/child/ParentParticularStage";
import EducationalDetailStage from "./components/child/EducationalDetailStage";
import TransportDetailStage from "./components/child/TransportDetailStage";
import OtherInformationStage from "./components/child/OtherInformationStage";
import RoutePage from "./pages/AdminPages/transport/RoutePage";
import SubRoutePage from "./pages/AdminPages/transport/SubRoutePage";


function App() {
  let user = true;
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        <Route >
            <Route path="/" element={!user ? <Navigate to="/dashboard" replace/> : <LoginPage/>} />
            <Route path="/registration" element={<Registration/>} />
            <Route path="/personal-information" element={<PersonalInformationForm/>} />
            <Route path="/educational-detail-stage" element={<EducationalDetailStage/>}/>
           
            <Route path="/subject-stage" element={<SubjectStage/>}/>
            <Route path="/parent-particular-stage" element={<ParentParticularStage/>}/>
            <Route path="/transport-detail-stage" element={<TransportDetailStage/>}/>
            <Route path="/other-information-stage" element={<OtherInformationStage/>}/>
            <Route path="/declaration-stage" element={<DeclarationStage/>}/>
            <Route path="/document-stage" element={<DocumentStage/>}/>
            <Route path="dashboard" element={<MasterLayout />} >
             {/*admin route*/}
            <Route index element={<Dashboard />} />
            <Route path='employee-master' element={<EmployeePage/>}/>
            <Route path='class-master' element={<ClassPage/>} />
            <Route path='academic-year-master' element={<AcademicYearPage/>}/>
            <Route path='division-master' element={<DivisionPage/>}/>
            <Route path='cast-master' element={<CastPage/>}/>
            <Route path='role-master' element={<RolePage/>}/>
            <Route path='add-declaration' element={<DeclarationStatement/>}/>
            <Route path='phisally-disable' element={<PhisallyDisablePage/>}/>
            <Route path="admission-form-master/stages" element={<StagePage/>}/>
            <Route path="admission-form-master/filed-type" element={<FiledTypePage/>}/>
            <Route path="admission-form-master/stages" element={<StagePage/>}/>
            <Route path="admission-form-master/Field" element={<AllFiledPage/>}/>
            <Route path="admission-form-master/field-values" element={<OptionValuePage/>}/>
            <Route path="subject" element={<SubjectPage/>}/>
            <Route path="assign-subject" element={<AssignSubjectPage/>}/>
            <Route path="program" element={<ProgramPage/>}/>
            <Route path="document-master/add-document" element={<AddDocumentPage/>}/>
            <Route path="document-master/assign-document" element={<AssignDocumentPage/>}/>
            <Route path="setting" >
               <Route path='institute'  element={<InstitutePage/>}/>
            </Route> 
            <Route path="admission" >
               <Route path='form-conform'  element={<AddmissionConformPage/>}/>
                 <Route path='seat-allotment'  element={<SeatAllotmentPage/>}/>
            </Route>
             <Route path="academic" >
               <Route path='student'  element={<StudentPage/>}/>
               
            </Route> 
             <Route path="transport" >
               <Route path='add-route'  element={<RoutePage/>}/>
                <Route path='assign-sub-route'  element={<SubRoutePage/>}/>
            </Route>
          {/*admin route end*/}

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
