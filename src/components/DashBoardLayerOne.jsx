
import UnitCountOne from "./child/UnitCountOne";
import ClassWiseAttendance from "./child/classWiseAttendance";
import FeeReportChart from "./child/feereportChart";
import DiaryReport from "./child/DiaryReport";
import GeneralNotificationReport from "./child/GeneralNotificationReport";

const DashBoardLayerOne = () => {
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
