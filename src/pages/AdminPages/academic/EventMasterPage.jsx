import HolidayEventCommon from "../../../components/child/academic/HolidayEventCommon";
import GenericTableDataLayer from "../../../components/GenericTable";
const EventMasterPage = () => {
  return (
    <div>
      <HolidayEventCommon
        title="Event Master"
        icon="solar:calendar-bold-duotone"
        nameLabel="Event"
        saveUrl="/api/event-masters"
      />
      <GenericTableDataLayer url='http://localhost:5000/api/event-masters' columns={[
        {data:"id",name:"id",title:"ID"},
        {data:"event",name:"event",title:"Event Name"},
        {data:"date",name:"date",title:"Date"},
       
        {data:"class",name:"class",title:"Class"},
        {data:"division",name:"division",title:"Division"},
      ]}/>

    </div>
  );
};

export default EventMasterPage;