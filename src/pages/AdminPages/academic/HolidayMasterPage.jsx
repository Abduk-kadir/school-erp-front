import HolidayEventCommon from "../../../components/child/academic/HolidayEventCommon";
import GenericTableDataLayer from "../../../components/GenericTable";

const HolidayMasterPage = () => {
  return (
    <div>
      <HolidayEventCommon
        title="Holiday Master"
        icon="solar:calendar-mark-bold-duotone"
        nameLabel="Holiday"
        saveUrl="/api/holiday-masters"
      />
      <GenericTableDataLayer url='http://localhost:5000/api/holiday-masters' columns={[
        {data:"id",name:"id",title:"ID"},
        {data:"holiday",name:"holiday",title:"Holiday Name"},
        {data:"date",name:"date",title:"Date"},
        
        {data:"class",name:"class",title:"Class"},
        {data:"division",name:"division",title:"Division"},
      ]}/>
    </div>
  );
};

export default HolidayMasterPage;