import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const toDateKey = (value) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function MyCalendar({ getDatefromMyCalender, getYearMonthfromMyCalender, monthlyData }) {
  const [date, setDate] = useState(new Date());

  const attendanceMap = useMemo(() => {
    const map = {};
    const list = Array.isArray(monthlyData) ? monthlyData : [];

    list.forEach((item) => {
      const dateKey = item?.attendance_date?.split?.("T")?.[0] ?? item?.attendance_date;
      if (!dateKey) return;

      const inTime = item?.in_time ?? item?.intime;
      map[dateKey] = inTime && inTime !== "00:00:00" ? "P" : "A";
    });

    return map;
  }, [monthlyData]);

  const handleChange = (selectedDate) => {
    setDate(selectedDate);
    getDatefromMyCalender(selectedDate);
  };

  const handleViewChange = ({ activeStartDate, view }) => {
    console.log("activeStartDate**************:", activeStartDate);
    console.log("view*********************:", view);
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

          const key = toDateKey(date);
          const status = attendanceMap[key];
          if (!status) return null;

          return status === "P" ? (
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
