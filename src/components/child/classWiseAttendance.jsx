import { useState } from "react";

const buildSampleRows = () => [
  { class: "Nursery A", classTotal: 32, presentCount: 30, absentCount: 2 },
  { class: "LKG B", classTotal: 28, presentCount: 27, absentCount: 1 },
  { class: "UKG A", classTotal: 35, presentCount: 33, absentCount: 2 },
  { class: "Class 1 A", classTotal: 40, presentCount: 38, absentCount: 2 },
  { class: "Class 2 B", classTotal: 42, presentCount: 40, absentCount: 2 },
  { class: "Class 5 A", classTotal: 45, presentCount: 41, absentCount: 4 },
  { class: "Class 10 Science", classTotal: 48, presentCount: 46, absentCount: 2 },
];

const ClassWiseAttendance = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [rows, setRows] = useState(buildSampleRows);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder until API exists: replace with GET using `date`
    setRows(buildSampleRows());
  };

  return (
    <div className='cwa-root card h-100 shadow-none border mt-5'>
      <style>
        {`
          .cwa-root .table thead tr th,
          .cwa-root .table tbody tr td {
            padding: 2px 12px !important;
            line-height: 1.25 !important;
          }
        `}
      </style>
      <div className='card-header border-bottom bg-base py-12 px-20 d-flex flex-wrap align-items-center justify-content-between gap-3'>
        <h6 className='text-lg fw-semibold mb-0'>Class Wise Attendance</h6>
        <form
          onSubmit={handleSubmit}
          className='d-flex flex-wrap align-items-center gap-2'
        >
          <input
            type='date'
            className='form-control form-control-sm w-auto'
            style={{ minWidth: "11rem" }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label='Attendance date'
          />
          <button type='submit' className='btn btn-primary-600 btn-sm px-20'>
            Submit
          </button>
        </form>
      </div>
      <div className='card-body p-16'>
        <div className='table-responsive scroll-sm'>
          <table className='table bordered-table xsm-table mb-0'>
            <thead>
              <tr>
                <th scope='col'>Class</th>
                <th scope='col' className='text-end'>
                  Class total
                </th>
                <th scope='col' className='text-end'>
                  Present count
                </th>
                <th scope='col' className='text-end'>
                  Absent count
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className='text-center text-secondary-light py-8'>
                    No attendance rows for this date.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={`${row.class}-${index}`}>
                    <td className='fw-medium'>{row.class}</td>
                    <td className='text-end'>{row.classTotal}</td>
                    <td className='text-end'>
                      <span className='text-success-main fw-medium'>
                        {row.presentCount}
                      </span>
                    </td>
                    <td className='text-end'>
                      <span className='text-danger-main fw-medium'>
                        {row.absentCount}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassWiseAttendance;
