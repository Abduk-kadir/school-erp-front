import { useState } from "react";

const SEND_THROUGH_LABEL = "Notification";

const buildSampleRows = () => [
  {
    message: "School will remain closed on account of a public holiday.",
    class: "All classes",
    batch: "2025-26",
    date: "2026-05-01",
  },
  {
    message: "Fee payment deadline for Term 2 has been extended to 15 May.",
    class: "Class 10 Science",
    batch: "2025-26",
    date: "2026-04-30",
  },
  {
    message: "Bus route 3 will depart 10 minutes early on Friday.",
    class: "Class 9 A",
    batch: "2025-26",
    date: "2026-04-30",
  },
  {
    message: "New uniform guidelines are available on the school portal.",
    class: "Class 8 B",
    batch: "2025-26",
    date: "2026-04-29",
  },
  {
    message: "Mid-term report cards will be distributed next week.",
    class: "Class 7 A",
    batch: "2025-26",
    date: "2026-04-29",
  },
  {
    message: "Emergency evacuation drill scheduled for Wednesday morning.",
    class: "Class 6 A",
    batch: "2025-26",
    date: "2026-04-28",
  },
  {
    message: "Canteen menu updates for the summer term are now published.",
    class: "Class 5 B",
    batch: "2025-26",
    date: "2026-04-28",
  },
  {
    message: "Lost and found items will be cleared at the end of the month.",
    class: "Class 4 A",
    batch: "2025-26",
    date: "2026-04-27",
  },
  {
    message: "Reminder: ID cards must be worn visibly on campus.",
    class: "Class 3 A",
    batch: "2025-26",
    date: "2026-04-27",
  },
  {
    message: "Annual day rehearsal schedule posted on the notice board.",
    class: "UKG A",
    batch: "2025-26",
    date: "2026-04-26",
  },
];

const GeneralNotificationReport = () => {
  const [rows] = useState(buildSampleRows);

  return (
    <div className='gnr-root card h-100 shadow-none border mt-5'>
      <style>
        {`
          .gnr-root .table thead tr th,
          .gnr-root .table tbody tr td {
            padding: 2px 12px !important;
            line-height: 1.25 !important;
          }
        `}
      </style>
      <div className='card-header border-bottom bg-base py-12 px-20'>
        <h6 className='text-lg fw-semibold mb-0'>
          Latest Top 10 General Notifications
        </h6>
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
                <th scope='col'>Send through</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className='text-center text-secondary-light py-8'>
                    No general notifications to show.
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
                    <td className='text-nowrap fw-medium'>
                      {SEND_THROUGH_LABEL}
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

export default GeneralNotificationReport;
