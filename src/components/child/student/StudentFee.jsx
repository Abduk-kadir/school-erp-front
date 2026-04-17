import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
import { elementClosest } from '@fullcalendar/core/internal'
import { Icon } from '@iconify/react/dist/iconify.js'
import '../../../assets/css/academfee.css'




const StudentFee = () => {
    let [studentFee, setStudentFee] = useState([])
    let [feeTransactionView, setFeeTransactionView] = useState(true)
    let [academicFeeData, setAcademicFeeData] = useState({})
    let [finalacademicFeeData, setFinalAcademicFeeData] = useState([])
    let [type,setType]=useState('monthly')

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await axios.get(`${baseURL}/api/fee-record-monthly/reg_no/${10}`)
                setStudentFee(response.data.data?.fee_records)

                let acfeeData = response.data.data?.fee_records.reduce((acc, curr) => {
                    let js = {}
                    let apr_total = Number(curr.apr_total) + Number(acc.apr_total);
                    let apr_paid = Number(curr.apr_paid) + Number(acc.apr_paid);
                    let apr_due = Number(curr.apr_due) + Number(acc.apr_due);
                    let may_total = Number(curr.may_total) + Number(acc.may_total);
                    let may_paid = Number(curr.may_paid) + Number(acc.may_paid);
                    let may_due = Number(curr.may_due) + Number(acc.may_due);
                    let jun_total = Number(curr.jun_total) + Number(acc.jun_total);
                    let jun_paid = Number(curr.jun_paid) + Number(acc.jun_paid);
                    let jun_due = Number(curr.jun_due) + Number(acc.jun_due);
                    let jul_total = Number(curr.jul_total) + Number(acc.jul_total);
                    let jul_paid = Number(curr.jul_paid) + Number(acc.jul_paid);
                    let jul_due = Number(curr.jul_due) + Number(acc.jul_due);
                    let aug_total = Number(curr.aug_total) + Number(acc.aug_total);
                    let aug_paid = Number(curr.aug_paid) + Number(acc.aug_paid);
                    let aug_due = Number(curr.aug_due) + Number(acc.aug_due);
                    let sep_total = Number(curr.sep_total) + Number(acc.sep_total);
                    let sep_paid = Number(curr.sep_paid) + Number(acc.sep_paid);
                    let sep_due = Number(curr.sep_due) + Number(acc.sep_due);
                    let oct_total = Number(curr.oct_total) + Number(acc.oct_total);
                    let oct_paid = Number(curr.oct_paid) + Number(acc.oct_paid);
                    let oct_due = Number(curr.oct_due) + Number(acc.oct_due);
                    let nov_total = Number(curr.nov_total) + Number(acc.nov_total);
                    let nov_paid = Number(curr.nov_paid) + Number(acc.nov_paid);
                    let nov_due = Number(curr.nov_due) + Number(acc.nov_due);
                    let dec_total = Number(curr.dec_total) + Number(acc.dec_total);
                    let dec_paid = Number(curr.dec_paid) + Number(acc.dec_paid);
                    let dec_due = Number(curr.dec_due) + Number(acc.dec_due);
                    let jan_total = Number(curr.jan_total) + Number(acc.jan_total);
                    let jan_paid = Number(curr.jan_paid) + Number(acc.jan_paid);
                    let jan_due = Number(curr.jan_due) + Number(acc.jan_due);
                    let feb_total = Number(curr.feb_total) + Number(acc.feb_total);
                    let feb_paid = Number(curr.feb_paid) + Number(acc.feb_paid);
                    let feb_due = Number(curr.feb_due) + Number(acc.feb_due);
                    let mar_total = Number(curr.mar_total) + Number(acc.mar_total);
                    let mar_paid = Number(curr.mar_paid) + Number(acc.mar_paid);
                    let mar_due = Number(curr.mar_due) + Number(acc.mar_due);

                    js = {
                        apr_total, apr_paid, apr_due, may_total, may_paid, may_due,
                        jun_total, jun_paid, jun_due, jul_total, jul_paid, jul_due,
                        aug_total, aug_paid, aug_due, sep_total, sep_paid, sep_due,
                        oct_total, oct_paid, oct_due, nov_total, nov_paid, nov_due,
                        dec_total, dec_paid, dec_due, jan_total, jan_paid, jan_due,
                        feb_total, feb_paid, feb_due, mar_total, mar_paid, mar_due
                    }
                    return js
                })
                setAcademicFeeData(acfeeData)
                const academicresult = {};

                Object.entries(acfeeData).forEach(([key, value]) => {
                    const [month, type] = key.split("_");
                
                    if (!academicresult[month]) {
                        academicresult[month] = { month };
                    }
                
                    if (type === "total") academicresult[month].total = value;
                    if (type === "paid") academicresult[month].totalpaid = value;
                    if (type === "due") academicresult[month].totaldue = value;
                });
                
                const facData = Object.values(academicresult);
                setFinalAcademicFeeData(facData);



            }
            catch (error) {

            }
        }
        fetchData()
    }, [])
    let handlePay=(month)=>{
        console.log('handle pay is calling',type)
        console.log('month data is:',month)
        console.log('academic fee data is',studentFee)
        let savingDataMonthly=studentFee.map(elem=>{
           if(month=='apr'){return {...elem,apr_paid:elem.apr_total,apr_due:0}}
           if(month=='may'){return {...elem,may_paid:elem.may_total,may_due:0}}
           if(month=='jun'){return {...elem,jun_paid:elem.jun_total,jun_due:0}}
           if(month=='jul'){return {...elem,jul_paid:elem.jul_total,jul_due:0}}
           if(month=='aug'){return {...elem,aug_paid:elem.aug_total,aug_due:0}}
           if(month=='sep'){return {...elem,sep_paid:elem.sep_total,sep_due:0}}
           if(month=='oct'){return {...elem,oct_paid:elem.oct_total,oct_due:0}}
           if(month=='nov'){return {...elem,nov_paid:elem.nov_total,nov_due:0}}
           if(month=='dec'){return {...elem,dec_paid:elem.dec_total,dec_due:0}}
           if(month=='jan'){return {...elem,jan_paid:elem.jan_total,jan_due:0}}
           if(month=='feb'){return {...elem,feb_paid:elem.feb_total,feb_due:0}}
           if(month=='mar'){return {...elem,mar_paid:elem.mar_total,mar_due:0}}
        })
        let savingdataQuaterly=studentFee.map((elem)=>{
            if(month=='apr'){return {...elem,apr_paid:elem.apr_total,apr_due:0,may_paid:elem.may_total,may_due:0,jun_paid:elem.jun_total,jun_due:0}}
            if(month=='jul'){return {...elem,jul_paid:elem.jul_total,jul_due:0,aug_paid:elem.aug_total,aug_due:0,sep_paid:elem.sep_total,sep_due:0}}
            if(month=='oct'){return {...elem,oct_paid:elem.oct_total,oct_due:0,nov_paid:elem.nov_total,nov_due:0,dec_paid:elem.dec_total,dec_due:0}}
            if(month=='jan'){return {...elem,jan_paid:elem.jan_total,jan_due:0,feb_paid:elem.feb_total,feb_due:0,mar_paid:elem.mar_total,mar_due:0}}
        })
        
        let savingDataHalfyearly=studentFee.map((elem)=>{
            if(month=='apr'){return {...elem,apr_paid:elem.apr_total,apr_due:0,may_paid:elem.may_total,may_due:0,jun_paid:elem.jun_total,jun_due:0,jul_paid:elem.jul_total,jul_due:0,aug_paid:elem.aug_total,aug_due:0,sep_paid:elem.sep_total,sep_due:0}}
            if(month=='oct'){return {...elem,oct_paid:elem.oct_total,oct_due:0,nov_paid:elem.nov_total,nov_due:0,dec_paid:elem.dec_total,dec_due:0,jan_paid:elem.jan_total,jan_due:0,feb_paid:elem.feb_total,feb_due:0,mar_paid:elem.mar_total,mar_due:0}}
           
        })
       
      console.log('half yearly data is:',savingDataHalfyearly)  
     
    }

   

    console.log('student fee is:', studentFee)
    console.log('academic fee data is:', academicFeeData)
    console.log('final academic fee data is:', finalacademicFeeData)

    let handleAcademicFeeView = () => {

        return ((
    
           <>
           <div className='af-fee-table'>
           <div className='row af-fee-row af-fee-row--head border-top'>
            <div className='col-3 af-fee-th-cell'>
              <Icon icon="solar:calendar-bold-duotone" className="af-fee-th-icon" aria-hidden />
              Month
            </div>
            <div className='col-3 af-fee-th-cell'>
              <Icon icon="solar:bill-list-bold-duotone" className="af-fee-th-icon" aria-hidden />
              Total
            </div>
            <div className='col-2 af-fee-th-cell'>
              <Icon icon="solar:check-circle-bold-duotone" className="af-fee-th-icon" aria-hidden />
              Paid
            </div>
            <div className='col-2 af-fee-th-cell'>
              <Icon icon="solar:wallet-money-bold-duotone" className="af-fee-th-icon" aria-hidden />
              Due
            </div>
            <div className='col-2 af-fee-th-cell'>
              <Icon icon="solar:bolt-circle-bold-duotone" className="af-fee-th-icon" aria-hidden />
              Action
            </div>
           </div>
           {
             finalacademicFeeData.map((item,index) => (
                <>
                    <div
                        className={`row af-fee-row af-fee-row--data${
                            type === "monthly"
                                ? " border-top"
                                : type === "halfyearly" &&
                                    (index === 0 || index === 6)
                                  ? " border-top"
                                  : type === "quaterly" &&
                                      [0, 3, 6, 9, 12].includes(index)
                                    ? " border-top"
                                    : ""
                        }`}
                    >

                        <div className='col-3 border'>
                            {item.month}
                        </div>
                        <div className='col-3 border af-fee-mono'>
                            {item.total}
                        </div>
                        <div className='col-2 border af-fee-mono'>
                            {item.totalpaid}
                        </div>
                        <div className='col-2 border af-fee-mono'>
                            {item.totaldue}
                        </div>
                        <div className='col-2'>
                           {type=='monthly'&&<button type="button" className='btn btn-primary af-fee-pay-btn'><Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={()=>handlePay(item?.month)} />Pay</button>}
                           {type=='quaterly'&& (index==0||index==3||index==6||index==9||index==12)?<button type="button" className='btn btn-primary af-fee-pay-btn' onClick={()=>handlePay(item?.month)}>Pay</button>:null}
                           {type=='halfyearly'&& (index==0||index==6)?<button type="button" className='btn btn-primary af-fee-pay-btn'><Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden  onClick={()=>handlePay(item?.month)}/>Pay</button>:null}

                        </div>
                    </div>


                </>
            ))
           }
           </div>
           </>
        
        ))
    }

    let AcademicheaderView = () => {
        return (
            <div className='card af-fee-card'>
                <div className='card-header d-flex justify-content-between'>
                    <h6 className='card-title af-fee-card-title'>
                      <Icon icon="solar:graduation-cap-bold-duotone" className="af-fee-card-title-icon" aria-hidden />
                      Academic Fee
                    </h6>
                    <div className='af-period-btns'>
                        <button type="button" className='btn af-period-btn me-2' onClick={() => setType('monthly')}>
                          <Icon icon="solar:calendar-date-bold-duotone" className="af-period-btn-icon" aria-hidden />
                          Monthly
                        </button>
                        <button type="button" className='btn af-period-btn me-2' onClick={() => setType('quaterly')}>
                          <Icon icon="solar:calendar-mark-bold-duotone" className="af-period-btn-icon" aria-hidden />
                          Quaterly
                        </button>
                        <button type="button" className='btn af-period-btn me-2' onClick={() => setType('halfyearly')}>
                          <Icon icon="solar:calendar-minimalistic-bold-duotone" className="af-period-btn-icon" aria-hidden />
                          Half yearly
                        </button>
                        <button type="button" className='btn af-period-btn me-2' onClick={() => setType('annually')}>
                          <Icon icon="solar:calendar-bold-duotone" className="af-period-btn-icon" aria-hidden />
                          Annually
                        </button>
                    </div>
                </div>
                <div className='card-body'>
                    {handleAcademicFeeView()}
                </div>
            </div>
        )
    }

    return (
        <div className='container-fluid py-4 af-page'>
            <div className='row mb-4'>
                <div className='col-12'>
                    <div className='card af-toggle-card'>
                        <div className='card-header af-toggle-header'>
                            <button
                                type="button"
                                className={`btn af-toggle-btn me-2${feeTransactionView ? " af-toggle-btn--active" : ""}`}
                                onClick={() => setFeeTransactionView(true)}
                            >
                                <Icon icon="solar:wallet-money-bold-duotone" className="af-toggle-btn-icon" aria-hidden />
                                Dues Fees
                            </button>
                            <button
                                type="button"
                                className={`btn af-toggle-btn ms-2${!feeTransactionView ? " af-toggle-btn--active" : ""}`}
                                onClick={() => setFeeTransactionView(false)}
                            >
                                <Icon icon="solar:documents-bold-duotone" className="af-toggle-btn-icon" aria-hidden />
                                Transaction
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {feeTransactionView ? <AcademicheaderView /> : null}

        </div>
    )
}

export default StudentFee