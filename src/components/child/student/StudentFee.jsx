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
    let [feetransactionData,setFeetransactionData]=useState([])
    let [academicFeeData, setAcademicFeeData] = useState({})
    let [finalacademicFeeData, setFinalAcademicFeeData] = useState([])
    let [academicFee, setAcademicFee] = useState(0)
    let [payableFee, setPayableFee] = useState(0)
    let [totalPaid, setTotalPaid] = useState(0)
    let [type, setType] = useState('monthly')

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await axios.get(`${baseURL}/api/fee-record-monthly/reg_no/${11}`)
                let { data } = await axios.get(`${baseURL}/api/fees/registration/${11}`)
               
                
                let newrecords= response.data.data?.fee_records.map(({
                    feeHead,    
                    createdAt, 
                    updatedAt,
                    student,

                    ...rest
                }) => ({
                    ...rest,
                      
                }));


                setStudentFee(newrecords)
                setAcademicFee(data?.data?.total)
                setPayableFee(data?.data?.balance)
                setTotalPaid(data?.data?.total_paid)

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
                console.log('fees records is:',newrecords)
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
    let handlePay = async (month) => {
        try{
        let total = 0;
        if (type == 'monthly' && month == 'apr') {
            total = academicFeeData.apr_total;
        }
        if (type == 'monthly' && month == 'may') {
            total = academicFeeData.may_total;
        }
        if (type == 'monthly' && month == 'jun') {
            total = academicFeeData.jun_total;
        }
        if (type == 'monthly' && month == 'jul') {
            total = academicFeeData.jul_total;
        }
        if (type == 'monthly' && month == 'aug') {
            total = academicFeeData.aug_total;
        }
        if (type == 'monthly' && month == 'sep') {
            total = academicFeeData.sep_total;
        }
        if (type == 'monthly' && month == 'oct') {
            total = academicFeeData.oct_total;
        }
        if (type == 'monthly' && month == 'nov') {
            total = academicFeeData.nov_total;
        }
        if (type == 'monthly' && month == 'dec') {
            total = academicFeeData.dec_total;
        }
        if (type == 'monthly' && month == 'jan') {
            total = academicFeeData.jan_total;
        }
        if (type == 'monthly' && month == 'feb') {
            total = academicFeeData.feb_total;
        }
        if (type == 'monthly' && month == 'mar') {
            total = academicFeeData.mar_total;
        }
        if (type == 'quaterly' && month == 'apr') {
            total = academicFeeData.apr_total + academicFeeData.may_total + academicFeeData.jun_total;
        }
        if (type == 'quaterly' && month == 'jul') {
            total = academicFeeData.jul_total + academicFeeData.aug_total + academicFeeData.sep_total;
        }
        if (type == 'quaterly' && month == 'oct') {
            total = academicFeeData.oct_total + academicFeeData.nov_total + academicFeeData.dec_total;
        }
        if (type == 'quaterly' && month == 'jan') {
            total = academicFeeData.jan_total + academicFeeData.feb_total + academicFeeData.mar_total;
        }
        if (type == 'halfyearly' && month == 'apr') {
            total = academicFeeData.apr_total + academicFeeData.may_total + academicFeeData.jun_total + academicFeeData.jul_total + academicFeeData.aug_total + academicFeeData.sep_total;
        }
        if (type == 'halfyearly' && month == 'oct') {
            total = academicFeeData.oct_total + academicFeeData.nov_total + academicFeeData.dec_total + academicFeeData.jan_total + academicFeeData.feb_total + academicFeeData.mar_total;
        }
        if (type == 'annually' && month == 'apr') {
            total = academicFeeData.apr_total + academicFeeData.may_total + academicFeeData.jun_total + academicFeeData.jul_total + academicFeeData.aug_total + academicFeeData.sep_total + academicFeeData.oct_total + academicFeeData.nov_total + academicFeeData.dec_total + academicFeeData.jan_total + academicFeeData.feb_total + academicFeeData.mar_total;
        }

        let collectfeevalue = { reg_no: 11, total: academicFee, payment: total, total_paid: totalPaid + total, balance: payableFee - total, consession: 0, consessionamount: 0, remark: '', payment_mode: 'online', date: new Date().toISOString().split('T')[0] }

        let dataMonthly = studentFee.map(elem => {
            if (month == 'apr') { return { ...elem, apr_paid: Number(elem.apr_total), apr_due: 0 } }
            if (month == 'may') { return { ...elem, may_paid: Number(elem.may_total), may_due: 0 } }
            if (month == 'jun') { return { ...elem, jun_paid: Number(elem.jun_total), jun_due: 0 } }
            if (month == 'jul') { return { ...elem, jul_paid: Number(elem.jul_total), jul_due: 0 } }
            if (month == 'aug') { return { ...elem, aug_paid: Number(elem.aug_total), aug_due: 0 } }
            if (month == 'sep') { return { ...elem, sep_paid: Number(elem.sep_total), sep_due: 0 } }
            if (month == 'oct') { return { ...elem, oct_paid:Number(elem.oct_total), oct_due: 0 } }
            if (month == 'nov') { return { ...elem, nov_paid: Number(elem.nov_total), nov_due: 0 } }
            if (month == 'dec') { return { ...elem, dec_paid: Number(elem.dec_total), dec_due: 0 } }
            if (month == 'jan') { return { ...elem, jan_paid: Number(elem.jan_total), jan_due: 0 } }
            if (month == 'feb') { return { ...elem, feb_paid: Number(elem.feb_total), feb_due: 0 } }
            if (month == 'mar') { return { ...elem, mar_paid: Number(elem.mar_total), mar_due: 0 } }
        })
        let dataQuaterly = studentFee.map((elem) => {
            if (month == 'apr') { return { ...elem, apr_paid: elem.apr_total, apr_due: 0, may_paid: elem.may_total, may_due: 0, jun_paid: elem.jun_total, jun_due: 0 } }
            if (month == 'jul') { return { ...elem, jul_paid: elem.jul_total, jul_due: 0, aug_paid: elem.aug_total, aug_due: 0, sep_paid: elem.sep_total, sep_due: 0 } }
            if (month == 'oct') { return { ...elem, oct_paid: elem.oct_total, oct_due: 0, nov_paid: elem.nov_total, nov_due: 0, dec_paid: elem.dec_total, dec_due: 0 } }
            if (month == 'jan') { return { ...elem, jan_paid: elem.jan_total, jan_due: 0, feb_paid: elem.feb_total, feb_due: 0, mar_paid: elem.mar_total, mar_due: 0 } }
        })

        let dataHalfyearly = studentFee.map((elem) => {
            if (month == 'apr') { return { ...elem, apr_paid: elem.apr_total, apr_due: 0, may_paid: elem.may_total, may_due: 0, jun_paid: elem.jun_total, jun_due: 0, jul_paid: elem.jul_total, jul_due: 0, aug_paid: elem.aug_total, aug_due: 0, sep_paid: elem.sep_total, sep_due: 0 } }
            if (month == 'oct') { return { ...elem, oct_paid: elem.oct_total, oct_due: 0, nov_paid: elem.nov_total, nov_due: 0, dec_paid: elem.dec_total, dec_due: 0, jan_paid: elem.jan_total, jan_due: 0, feb_paid: elem.feb_total, feb_due: 0, mar_paid: elem.mar_total, mar_due: 0 } }

        })

        let dataAnnually = studentFee.map((elem) => {
            return { ...elem, apr_paid: elem.apr_total, apr_due: 0, may_paid: elem.may_total, may_due: 0, jun_paid: elem.jun_total, jun_due: 0, jul_paid: elem.jul_total, jul_due: 0, aug_paid: elem.aug_total, aug_due: 0, sep_paid: elem.sep_total, sep_due: 0, oct_paid: elem.oct_total, oct_due: 0, nov_paid: elem.nov_total, nov_due: 0, dec_paid: elem.dec_total, dec_due: 0, jan_paid: elem.jan_total, jan_due: 0, feb_paid: elem.feb_total, feb_due: 0, mar_paid: elem.mar_total, mar_due: 0 }
        })

       let { data } = await axios.post(`${baseURL}/api/fees`, collectfeevalue)
        let newid = data?.data?.id
       
       
        dataMonthly = dataMonthly.map(elem=>{
            return{...elem,fee_table_id:newid,date:new Date().toISOString().split('T')[0]}
        })
        console.log('data monthly is:',dataMonthly)
        dataQuaterly = dataQuaterly.map(elem=>{
            return{...elem,fee_table_id:newid,date:new Date().toISOString().split('T')[0]}
        })
        dataHalfyearly=dataHalfyearly.map(elem=>{
          
            return{...elem,fee_table_id:newid,date:new Date().toISOString().split('T')[0]}
        })
        dataAnnually=dataAnnually.map(elem=>{
            return{...elem,fee_table_id:newid,date:new Date().toISOString().split('T')[0]}
        })
        let records=[]
        if(type=='monthly'){records=dataMonthly}
        if(type=='quaterly'){records=dataQuaterly}
        if(type=='halfyearly'){records=dataHalfyearly}
        if(type=='annually'){records=dataAnnually}
        //console.log('records is:',records)
        //console.log('month is:',month)
        //console.log('type is:',type)
         console.log('records is:',records)
       let { data2 } = await axios.post(`${baseURL}/api/fee-record-monthly/`, { records })
      
        
        alert('fee is saved successfully')
    }
    catch(error){
        alert(error)
    }
        

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
                        finalacademicFeeData.map((item, index) => (
                            <>
                                <div
                                    className={`row af-fee-row af-fee-row--data${type === "monthly"
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
                                        {type == 'monthly' && <button type="button" className='btn btn-primary af-fee-pay-btn'><Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />Pay</button>}
                                        {type == 'quaterly' && (index == 0 || index == 3 || index == 6 || index == 9 || index == 12) ? <button type="button" className='btn btn-primary af-fee-pay-btn' onClick={() => handlePay(item?.month)}>Pay</button> : null}
                                        {type == 'halfyearly' && (index == 0 || index == 6) ? <button type="button" className='btn btn-primary af-fee-pay-btn'><Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />Pay</button> : null}
                                        {type == 'annually' && (index == 0) ? <button type="button" className='btn btn-primary af-fee-pay-btn'><Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />Pay</button> : null}

                                    </div>
                                </div>


                            </>
                        ))
                    }
                </div>
            </>

        ))
    }
    let TransactionView=()=>{
        let [downloadingKey,setDownloadingKey]=useState(null)
        let txRegNo=(item)=>item?.reg_no??item?.registration_no??'—'
        let txDownloadKey=(item,index)=>String(item?.id??item?.fee_table_id??item?.transaction_no??`row-${index}`)
        let downloadReceipt=async(item,index)=>{
            let key=txDownloadKey(item,index)
            if(item?.receipt_url||item?.download_url){
                window.open(item.receipt_url||item.download_url,'_blank','noopener,noreferrer')
                return
            }
            let regNo=item?.reg_no??item?.registration_no??11
            let feeTableId=item?.id??item?.fee_table_id
            if(feeTableId==null||feeTableId===''){
                alert('Receipt is not available for this row (missing fee id).')
                return
            }
            setDownloadingKey(key)
            try{
                let response=await axios.post(
                    `${baseURL}/api/fees/fee-reciept-pdf`,
                    { reg_no: Number(regNo), fee_table_id: feeTableId },
                    { responseType: 'blob' }
                )
                let blob=new Blob([response.data],{
                    type:response.headers['content-type']||'application/pdf',
                })
                let url=window.URL.createObjectURL(blob)
                let a=document.createElement('a')
                a.href=url
                a.download=`fee-receipt-${regNo}-${feeTableId}.pdf`
                document.body.appendChild(a)
                a.click()
                a.remove()
                window.URL.revokeObjectURL(url)
            }
            catch(err){
                console.error('Receipt download failed:',err)
                alert('Could not download receipt. Check that the server accepts this request.')
            }
            finally{
                setDownloadingKey(null)
            }
        }
        let txStatusInfo=(item)=>{
            let raw=item?.status??item?.payment_status
            let text=raw!=null&&String(raw).trim()!==''?String(raw).trim():null
            if(!text){
                let bal=Number(item?.balance)
                text=Number.isFinite(bal)&&bal<=0?'Paid':'Pending'
            }
            let lower=text.toLowerCase()
            let variant='default'
            if(lower.includes('paid')&&!lower.includes('unpaid')) variant='paid'
            else if(lower.includes('pending')||lower.includes('due')||lower.includes('partial')) variant='pending'
            else if(lower.includes('fail')||lower.includes('reject')||lower.includes('cancel')) variant='failed'
            return { text, variant }
        }
        let statusIcon=(variant)=>{
            if(variant==='paid') return 'solar:check-circle-bold-duotone'
            if(variant==='pending') return 'solar:clock-circle-bold-duotone'
            if(variant==='failed') return 'solar:close-circle-bold-duotone'
            return 'solar:shield-check-bold-duotone'
        }
        return(
            <>
            <div className='af-tx-table-panel'>
            <div className='af-tx-table-panel-head'>
                <p className='af-tx-table-panel-title'>
                    <Icon icon="solar:history-bold-duotone" className="af-tx-table-panel-title-icon" aria-hidden />
                    Academic Fee Transaction
                </p>
            </div>
            <div className='table-responsive af-tx-table-responsive'>
                <table className='table table-hover af-tx-table mb-0'>
                    <thead>
                        <tr>
                            <th scope='col' className='af-tx-th af-tx-th--num'>#</th>
                            <th scope='col' className='af-tx-th'>
                                <span className='af-tx-th-inner'>
                                    <Icon icon="solar:id-card-bold-duotone" className="af-tx-th-icon" aria-hidden />
                                    Reg no.
                                </span>
                            </th>
                            <th scope='col' className='af-tx-th'>
                                <span className='af-tx-th-inner'>
                                    <Icon icon="solar:receipt-bold-duotone" className="af-tx-th-icon" aria-hidden />
                                    Txn no.
                                </span>
                            </th>
                            <th scope='col' className='af-tx-th'>
                                <span className='af-tx-th-inner'>
                                    <Icon icon="solar:shield-check-bold-duotone" className="af-tx-th-icon" aria-hidden />
                                    Status
                                </span>
                            </th>
                            <th scope='col' className='af-tx-th'>
                                <span className='af-tx-th-inner'>
                                    <Icon icon="solar:calendar-bold-duotone" className="af-tx-th-icon" aria-hidden />
                                    Date
                                </span>
                            </th>
                            <th scope='col' className='af-tx-th af-tx-th--end'>
                                <span className='af-tx-th-inner'>
                                    <Icon icon="solar:wallet-money-bold-duotone" className="af-tx-th-icon" aria-hidden />
                                    Total
                                </span>
                            </th>
                            <th scope='col' className='af-tx-th af-tx-th--end'>
                                <span className='af-tx-th-inner'>
                                    <Icon icon="solar:check-circle-bold-duotone" className="af-tx-th-icon" aria-hidden />
                                    Paid
                                </span>
                            </th>
                            <th scope='col' className='af-tx-th af-tx-th--end'>
                                <span className='af-tx-th-inner'>
                                    <Icon icon="solar:clipboard-list-bold-duotone" className="af-tx-th-icon" aria-hidden />
                                    Balance
                                </span>
                            </th>
                            <th scope='col' className='af-tx-th af-tx-th--action'>
                                <span className='af-tx-th-inner'>
                                    <Icon icon="solar:download-minimalistic-bold-duotone" className="af-tx-th-icon" aria-hidden />
                                    Download
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {feetransactionData.length===0?(
                            <tr>
                                <td colSpan={9} className='af-tx-table-empty'>No transactions to show.</td>
                            </tr>
                        ):feetransactionData.map((item,index)=>{
                            let { text: statusText, variant: statusVariant }=txStatusInfo(item)
                            let dKey=txDownloadKey(item,index)
                            return(
                            <tr key={index} className='af-tx-tr'>
                                <td className='af-tx-td af-tx-td--num af-tx-mono'>{index+1}</td>
                                <td className='af-tx-td af-tx-mono'>{txRegNo(item)}</td>
                                <td className='af-tx-td af-tx-mono'>{item.transaction_no??'—'}</td>
                                <td className='af-tx-td'>
                                    <span className={`af-tx-status-badge af-tx-status--${statusVariant}`}>
                                        <Icon icon={statusIcon(statusVariant)} className="af-tx-status-badge-icon" aria-hidden />
                                        {statusText}
                                    </span>
                                </td>
                                <td className='af-tx-td af-tx-mono'>{item.date??'—'}</td>
                                <td className='af-tx-td af-tx-td--end af-tx-mono'>{item.total}</td>
                                <td className='af-tx-td af-tx-td--end af-tx-mono af-tx-cell--paid'>{item.total_paid}</td>
                                <td className='af-tx-td af-tx-td--end af-tx-mono af-tx-cell--due'>{item.balance}</td>
                                <td className='af-tx-td af-tx-td--action'>
                                    <button
                                        type='button'
                                        className='btn af-tx-download-btn'
                                        onClick={()=>downloadReceipt(item,index)}
                                        disabled={downloadingKey===dKey}
                                        title='Download receipt'
                                    >
                                        {downloadingKey===dKey?(
                                            <span className='spinner-border spinner-border-sm af-tx-download-spinner' role='status' aria-label='Loading' />
                                        ):(
                                            <Icon icon="solar:download-minimalistic-bold-duotone" className="af-tx-download-btn-icon" aria-hidden />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
            </div>
            </>
        )
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

    let handleTransactionVeiw=async()=>{
        let {data}=await axios.get(`${baseURL}/api/fees/allfee/registration/${11}`)
        setFeetransactionData(data?.data)
        setFeeTransactionView(false)

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
                                onClick={() => handleTransactionVeiw()}
                            >
                                <Icon icon="solar:documents-bold-duotone" className="af-toggle-btn-icon" aria-hidden />
                                Transaction
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {feeTransactionView ? <AcademicheaderView /> : null}
            {!feeTransactionView?<TransactionView/>:null}

        </div>
    )
}

export default StudentFee