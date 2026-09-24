import UnitCountOne from "./child/UnitCountOne";
import ClassWiseAttendance from "./child/classWiseAttendance";
import FeeReportChart from "./child/feereportChart";
import DiaryReport from "./child/DiaryReport";
import GeneralNotificationReport from "./child/GeneralNotificationReport";
import { useDispatch } from "react-redux";
import { getStaffData } from "../redux/slices/registrationNo";
import { useEffect,useState } from "react";
import "../assets/css/mastercom.css";
import "../assets/css/adminDashboard.css";
import baseURL from "../utils/baseUrl";
import axios from "axios";

const DashBoardLayerOne = () => {
  const dispatch = useDispatch();
  const [diary,setDiary]=useState([])
  const [notifications,setNotifications]=useState([])
  useEffect(() => {
    console.log("calling use effect in dashboard admin");
    const token = localStorage.getItem("token");
    console.log("token**********************:", token);
    if (token) {
      dispatch(getStaffData({ token: token }));
    }
    console.log("end");
  }, []);
  useEffect(()=>{
    let fetchData=async()=>{
      try{
        Promise.all([
          axios.get(`${baseURL}/api/diaries`),
          axios.get(`${baseURL}/api/student-notifications`)
        ]).then(([diaryResponse,notificationResponse])=>{
          setDiary(diaryResponse.data.data)
          setNotifications(notificationResponse.data.data)
        })

      }
      catch(errot){
        console.log('erro in fetcing data for diary and notification')
      }
    }
    fetchData()
  },[])

  return (
    <div className="chfi-wrapper adm-dash">
      <UnitCountOne />
      <ClassWiseAttendance />

      <div className="row">
        <FeeReportChart 
        title="Last 7 Days Registration Fee Report" 
        categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        data={[]}
        seriesName="Registration Fee"
        />
        <FeeReportChart title="Last 7 Days Admission Fee Report"
         categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        data={[]}
        seriesName="Admission Fee"
        />
        <FeeReportChart title="Last 7 Days Academic Fee Report"
         categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        data={[]}
        seriesName="Academic Fee"
        />
        <FeeReportChart title="Last 7 Days Canteen Fee Report"
         categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
        data={[]}
        seriesName="Canteen Fee"
        />
        <FeeReportChart title="Last 7 Days Bus Fee Report" />
      </div>

      <GeneralNotificationReport notifications={notifications}/>
      <DiaryReport diary={diary}/>
    </div>
  );
};

export default DashBoardLayerOne;
