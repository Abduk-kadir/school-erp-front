import { useState,useEffect } from "react";
import { Icon } from "@iconify/react";
import baseURL from "../../utils/baseUrl";
import axios from "axios";



const DiaryReport = ({diary}) => {

  return (
    <div className='adm-panel h-100'>
      <div className='chfi-card h-100'>
        <div className='card-header'>
          <div className='header-row'>
            <span className='header-icon'>
              <Icon icon='solar:notebook-bookmark-bold-duotone' width='16' />
            </span>
            <div>
              <h5 className='card-title'>Latest Top 10 Diary</h5>
            </div>
          </div>
        </div>
        <div className='card-body'>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table xsm-table mb-0 adm-table'>
              <thead>
                <tr>
                  <th scope='col'>Message</th>
                  <th scope='col'>Class</th>
                  <th scope='col'>Division</th>
                  <th scope='col'>Teacher</th>
                  <th scope='col'>Date</th>
                </tr>
              </thead>
              <tbody>
                {diary.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className='text-center text-secondary-light py-8'
                    >
                      No diary entries to show.
                    </td>
                  </tr>
                ) : (
                  diary.map((row, index) => (
                    <tr key={`${row.date}-${index}`}>
                      <td className='text-wrap adm-msg-cell'>{row?.message}</td>
                      <td className='fw-bold text-nowrap'>{row?.class_name}</td>
                      <td className='text-nowrap'>{row?.division_name}</td>
                      <td className='text-nowrap'>{row?.staff_name}</td>
                      <td className='text-nowrap text-secondary-light'>
                        {row?.createdAt?.split('T')[0]}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryReport;
