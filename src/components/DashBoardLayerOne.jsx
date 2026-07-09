
import UnitCountOne from "./child/UnitCountOne";
import ClassWiseAttendance from "./child/classWiseAttendance";
import FeeReportChart from "./child/feereportChart";
import DiaryReport from "./child/DiaryReport";
import GeneralNotificationReport from "./child/GeneralNotificationReport";
import {useDispatch,useSelector} from "react-redux";
import { getStaffData } from "../redux/slices/registrationNo";
import { useEffect } from "react";
const DashBoardLayerOne = () => {
  const dispatch=useDispatch();

  useEffect(()=>{
    console.log('calling use effect in dashboard admin')
    const token=localStorage.getItem('token');
    console.log('token**********************:',token)
    if(token){
      dispatch(getStaffData({token:token}))
    }
    console.log("end")
  },[])
  return (
    <>
      {/* UnitCountOne */}
      <UnitCountOne />
      <ClassWiseAttendance />
      <FeeReportChart />
      <DiaryReport />
      <GeneralNotificationReport />


      <section className='row gy-4 mt-1'>
       

       
      </section>
    </>
  );
};

export default DashBoardLayerOne;
