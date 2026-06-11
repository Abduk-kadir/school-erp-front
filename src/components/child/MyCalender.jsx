import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function MyCalendar({ getDatefromMyCalender,getYearMonthfromMyCalender,monthlyData }) {
  const [date, setDate] = useState(new Date());
  let attendanceMap={};
  monthlyData.forEach((item) => {
    attendanceMap[item.attendance_date] = "P";
  });

  const handleChange = (selectedDate) => {
    setDate(selectedDate);
    getDatefromMyCalender(selectedDate);
  };
  const handleViewChange = ({ activeStartDate, view }) => {
    console.log('activeStartDate**************:',activeStartDate)
    console.log('view*********************:',view)
    const year = activeStartDate.getFullYear();
    const month = String(activeStartDate.getMonth() + 1).padStart(2, "0");
    const yearMonth = `${year}-${month}`;
    console.log("Header changed:", yearMonth);

    getYearMonthfromMyCalender(yearMonth);
  };

  return (
    <div className="attendance-calendar">
      <Calendar
        onChange={handleChange}
        tileContent={({ date, view }) => {
          if (view !== "month") return null;
          if (date.getDay() === 0) return null;

          const key = date.toISOString().split("T")[0];
          const status = attendanceMap[key];

          return status ? (
            <p className="status P">P</p>
          ) : (
            <p className="status A">A</p>
          );
        }}
        value={date}
        onActiveStartDateChange={handleViewChange}
      />
      <div className="attendance-calendar__legend">
        <span className="attendance-calendar__legend-item">
          <span className="attendance-calendar__legend-dot attendance-calendar__legend-dot--present">P</span>
          Present
        </span>
        <span className="attendance-calendar__legend-item">
          <span className="attendance-calendar__legend-dot attendance-calendar__legend-dot--absent">A</span>
          Absent
        </span>
      </div>
    </div>
  );
}

export default MyCalendar;