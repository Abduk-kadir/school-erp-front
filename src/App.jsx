import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MasterLayout from "./masterLayout/MasterLayout"
import RouteScrollToTop from "./helper/RouteScrollToTop";
import MyPage from "./pages/MyPage";
import ClassPage from "./pages/ClassPage";
import AcademicYearPage from "./pages/AcademicYearPage";
import DivisionPage from "./pages/DivisionPage";
import CastPage from "./pages/CastMasterPage";
import EmployeePage from './pages/EmployeePage'
import RolePage from "./pages/RolePage";
import PhisallyDisablePage from "./pages/PyisallyDisablePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage'

function App() {
  let user = true;
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        <Route >
          <Route path="/" element={!user ? <Navigate to="/dashboard" replace/> : <RegisterPage/>} />

          <Route path="dashboard" element={<MasterLayout />} >

            <Route index element={<Dashboard />} />

            <Route path="my-page" element={<MyPage />} />
            <Route path='employee-master' element={<EmployeePage/>}/>
            <Route path='class-master' element={<ClassPage/>} />
            <Route path='academic-year-master' element={<AcademicYearPage/>}/>
            <Route path='division-master' element={<DivisionPage/>}/>
            <Route path='cast-master' element={<CastPage/>}/>
            <Route path='role-master' element={<RolePage/>}/>
            <Route path='phisally-disable' element={<PhisallyDisablePage/>}/>
          
           

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
