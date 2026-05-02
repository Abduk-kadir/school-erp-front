import { useState } from "react";

const buildSampleRows = () => [
  {
    message: "Parent–teacher meeting scheduled for next Monday at 10:00 AM.",
    class: "Class 10 Science",
    batch: "2025-26",
    date: "2026-05-01",
  },
  {
    message: "Science practical exam for Unit 3 will be held in Lab 2.",
    class: "Class 9 A",
    batch: "2025-26",
    date: "2026-04-30",
  },
  {
    message: "Homework: Complete exercises 1–8 from chapter 4.",
    class: "Class 8 B",
    batch: "2025-26",
    date: "2026-04-30",
  },
  {
    message: "Annual sports day practice during zero period this week.",
    class: "Class 7 A",
    batch: "2025-26",
    date: "2026-04-29",
  },
  {
    message: "Bring geometry box for tomorrow’s mathematics assessment.",
    class: "Class 6 A",
    batch: "2025-26",
    date: "2026-04-29",
  },
  {
    message: "Library books must be returned before the term ends.",
    class: "Class 5 B",
    batch: "2025-26",
    date: "2026-04-28",
  },
  {
    message: "Field trip consent form to be signed and submitted by Friday.",
    class: "Class 4 A",
    batch: "2025-26",
    date: "2026-04-28",
  },
 
];

const DiaryReport = () => {
  const [rows] = useState(buildSampleRows);

  return (
    <div className='dr-root card h-100 shadow-none border mt-5'>
      <style>
        {`
          .dr-root .table thead tr th,
          .dr-root .table tbody tr td {
            padding: 2px 12px !important;
            line-height: 1.25 !important;
          }
        `}
      </style>
      <div className='card-header border-bottom bg-base py-12 px-20'>
        <h6 className='text-lg fw-semibold mb-0'>Latest Top 10 Diary</h6>
      </div>
      <div className='card-body p-16'>
        <div className='table-responsive scroll-sm'>
          <table className='table bordered-table xsm-table mb-0'>
            <thead>
              <tr>
                <th scope='col'>Message</th>
                <th scope='col'>Class</th>
                <th scope='col'>Batch</th>
                <th scope='col'>Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className='text-center text-secondary-light py-8'>
                    No diary entries to show.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={`${row.date}-${index}`}>
                    <td className='text-wrap' style={{ maxWidth: "22rem" }}>
                      {row.message}
                    </td>
                    <td className='fw-medium text-nowrap'>{row.class}</td>
                    <td className='text-nowrap'>{row.batch}</td>
                    <td className='text-nowrap text-secondary-light'>
                      {row.date}
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

export default DiaryReport;
