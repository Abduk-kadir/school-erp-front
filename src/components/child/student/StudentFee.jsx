import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import baseURL from '../../../utils/baseUrl'
import { elementClosest } from '@fullcalendar/core/internal'
import { Icon } from '@iconify/react/dist/iconify.js'
import '../../../assets/css/academfee.css'

const StudentFee = () => {
    let [studentFee, setStudentFee] = useState([])//student academic installment data
    let [admissionFee, setAdmissionFee] = useState([])//student admission installment data
    let [canteenFee, setCanteenFee] = useState([])//student canteen installment data
    //transcation related state are here
    let [feeTransactionView, setFeeTransactionView] = useState(true)
    let [feetransactionData, setFeetransactionData] = useState([])
    //end transaction related state here

    let [typofAcademicFee, setTypofAcademicFee] = useState('');
    let [typofAdmissionFee, setTypofAdmissionFee] = useState('');
    let [typofCanteenFee, setTypofCanteenFee] = useState('')

    let [isSplitAcademicFee, setIsSplitAcademicFee] = useState(false)
    let [isSplitAdmissionFee, setIsSplitAdmissionFee] = useState(false)
    let [isSplitCanteenFee, setIsSplitCanteenFee] = useState(false)

    // this is use for user view
    let [academicFeeData, setAcademicFeeData] = useState({})// json value contailing  total fee month wise

    let [acdemicTableViewData, setacdemicTableViewData] = useState([])

    let [admissionFeeData, setAdmissionFeeData] = useState({})
    let [admissionTableViewData, setAdmissionTableViewData] = useState([])

    let [canteenFeeData, setCanteenFeeData] = useState({})
    let [canteenTableViewData, setCanteenTableViewData] = useState([])

    //end here

    // this is for  total fee calculation
    let [academicFee, setAcademicFee] = useState(0)
    let [payableFee, setPayableFee] = useState(0)
    let [totalPaid, setTotalPaid] = useState(0)

    let [admissionTotalFee, setAdmissionTotalFee] = useState(0)
    let [payableAdmissionFee, setPayableAdmissionFee] = useState(0)
    let [totalPaidAdmissionFee, setTotalPaidAdmissionFee] = useState(0)

    let [canteenTotalFee, setCanteenTotalFee] = useState(0)
    let [payableCanteenFee, setPayableCanteenFee] = useState(0)
    let [totalPaidCanteenFee, setTotalPaidCanteenFee] = useState(0)
    //end total calculation

    // this type is used for only table view showing
    let [actype, acsetType] = useState('')
    let [adtype, setAdtype] = useState('')
    let [cantype, setCantype] = useState('')
    //end
    let totalmontwisefun = (records) => {

        let data = records.reduce((acc, curr) => {
            let js = {}
            const splitNum = (field) =>
                Number(curr?.splitAmounts?.[field] ?? curr?.[field] ?? 0) || 0;
            let apr_total = Number(curr.apr_total) + Number(acc.apr_total);
            let apr_total_paid = Number(curr.apr_total_paid) + Number(acc.apr_total_paid);
            let apr_total_due = apr_total - apr_total_paid;
            let apr_split1 = splitNum("apr_split1") + Number(acc.apr_split1 ?? 0);
            let apr_split2 = splitNum("apr_split2") + Number(acc.apr_split2 ?? 0);
            let may_total = Number(curr.may_total) + Number(acc.may_total);
            let may_total_paid = Number(curr.may_total_paid) + Number(acc.may_total_paid);
            let may_total_due = may_total - may_total_paid;
            let may_split1 = splitNum("may_split1") + Number(acc.may_split1 ?? 0);
            let may_split2 = splitNum("may_split2") + Number(acc.may_split2 ?? 0);


            let jun_total = Number(curr.jun_total) + Number(acc.jun_total);
            let jun_total_paid = Number(curr.jun_total_paid) + Number(acc.jun_total_paid);
            let jun_total_due = jun_total - jun_total_paid;
            let jun_split1 = splitNum("jun_split1") + Number(acc.jun_split1 ?? 0);
            let jun_split2 = splitNum("jun_split2") + Number(acc.jun_split2 ?? 0);


            let jul_total = Number(curr.jul_total) + Number(acc.jul_total);
            let jul_total_paid = Number(curr.jul_total_paid) + Number(acc.jul_total_paid);
            let jul_total_due = jul_total - jul_total_paid;
            let jul_split1 = splitNum("jul_split1") + Number(acc.jul_split1 ?? 0);
            let jul_split2 = splitNum("jul_split2") + Number(acc.jul_split2 ?? 0);

            let aug_total = Number(curr.aug_total) + Number(acc.aug_total);
            let aug_total_paid = Number(curr.aug_total_paid) + Number(acc.aug_total_paid);
            let aug_total_due = aug_total - aug_total_paid;
            let aug_split1 = splitNum("aug_split1") + Number(acc.aug_split1 ?? 0);
            let aug_split2 = splitNum("aug_split2") + Number(acc.aug_split2 ?? 0);

            let sep_total = Number(curr.sep_total) + Number(acc.sep_total);
            let sep_total_paid = Number(curr.sep_total_paid) + Number(acc.sep_total_paid);
            let sep_total_due = sep_total - sep_total_paid;
            let sep_split1 = splitNum("sep_split1") + Number(acc.sep_split1 ?? 0);
            let sep_split2 = splitNum("sep_split2") + Number(acc.sep_split2 ?? 0);


            let oct_total = Number(curr.oct_total) + Number(acc.oct_total);
            let oct_total_paid = Number(curr.oct_total_paid) + Number(acc.oct_total_paid);
            let oct_total_due = oct_total - oct_total_paid;

            let oct_split1 = splitNum("oct_split1") + Number(acc.oct_split1 ?? 0);
            let oct_split2 = splitNum("oct_split2") + Number(acc.oct_split2 ?? 0);



            let nov_total = Number(curr.nov_total) + Number(acc.nov_total);
            let nov_total_paid = Number(curr.nov_total_paid) + Number(acc.nov_total_paid);
            let nov_total_due = nov_total - nov_total_paid;

            let nov_split1 = splitNum("nov_split1") + Number(acc.nov_split1 ?? 0);
            let nov_split2 = splitNum("nov_split2") + Number(acc.nov_split2 ?? 0);

            let dec_total = Number(curr.dec_total) + Number(acc.dec_total);
            let dec_total_paid = Number(curr.dec_total_paid) + Number(acc.dec_total_paid);
            let dec_total_due = dec_total - dec_total_paid;
            let dec_split1 = splitNum("dec_split1") + Number(acc.dec_split1 ?? 0);
            let dec_split2 = splitNum("dec_split2") + Number(acc.dec_split2 ?? 0);

            let jan_total = Number(curr.jan_total) + Number(acc.jan_total);
            let jan_total_paid = Number(curr.jan_total_paid) + Number(acc.jan_total_paid);
            let jan_total_due = jan_total - jan_total_paid;
            let jan_split1 = splitNum("jan_split1") + Number(acc.jan_split1 ?? 0);
            let jan_split2 = splitNum("jan_split2") + Number(acc.jan_split2 ?? 0);

            let feb_total = Number(curr.feb_total) + Number(acc.feb_total);
            let feb_total_paid = Number(curr.feb_total_paid) + Number(acc.feb_total_paid);
            let feb_total_due = feb_total - feb_total_paid;
            let feb_split1 = splitNum("feb_split1") + Number(acc.feb_split1 ?? 0);
            let feb_split2 = splitNum("feb_split2") + Number(acc.feb_split2 ?? 0);



            let mar_total = Number(curr.mar_total) + Number(acc.mar_total);
            let mar_total_paid = Number(curr.mar_total_paid) + Number(acc.mar_total_paid);
            let mar_total_due = mar_total - mar_total_paid;
            let mar_split1 = splitNum("mar_split1") + Number(acc.mar_split1 ?? 0);
            let mar_split2 = splitNum("mar_split2") + Number(acc.mar_split2 ?? 0);


            js = {
                apr_total, apr_total_paid, apr_total_due, apr_split1, apr_split2, may_total, may_total_paid, may_total_due,
                may_split1, may_split2,
                jun_total, jun_total_paid, jun_total_due, jun_split1, jun_split2, jul_total, jul_total_paid, jul_total_due,
                jul_split1, jul_split2,
                aug_total, aug_total_paid, aug_total_due,
                aug_split1, aug_split2,
                sep_total, sep_total_paid, sep_total_due,
                sep_split1, sep_split2,
                oct_total, oct_total_paid, oct_total_due,
                oct_split1, oct_split2,
                nov_total, nov_total_paid, nov_total_due,
                nov_split1, nov_split2,
                dec_total, dec_total_paid, dec_total_due,
                dec_split1, dec_split2,
                jan_total, jan_total_paid, jan_total_due,
                jan_split1, jan_split2,
                feb_total, feb_total_paid, feb_total_due,
                feb_split1, feb_split2,
                mar_total, mar_total_paid, mar_total_due,
                mar_split1, mar_split2
            }
            return js
        }, {
            apr_total: 0, apr_total_paid: 0, apr_total_due: 0, apr_split1: 0, apr_split2: 0,
            may_total: 0, may_total_paid: 0, may_total_due: 0, may_split1: 0, may_split2: 0,
            jun_total: 0, jun_total_paid: 0, jun_total_due: 0, jun_split1: 0, jun_split2: 0,
            jul_total: 0, jul_total_paid: 0, jul_total_due: 0, jul_split1: 0, jul_split2: 0,
            aug_total: 0, aug_total_paid: 0, aug_total_due: 0, aug_split1: 0, aug_split2: 0,
            sep_total: 0, sep_total_paid: 0, sep_total_due: 0, sep_split1: 0, sep_split2: 0,
            oct_total: 0, oct_total_paid: 0, oct_total_due: 0, oct_split1: 0, oct_split2: 0,
            nov_total: 0, nov_total_paid: 0, nov_total_due: 0, nov_split1: 0, nov_split2: 0,
            dec_total: 0, dec_total_paid: 0, dec_total_due: 0, dec_split1: 0, dec_split2: 0,
            jan_total: 0, jan_total_paid: 0, jan_total_due: 0, jan_split1: 0, jan_split2: 0,
            feb_total: 0, feb_total_paid: 0, feb_total_due: 0, feb_split1: 0, feb_split2: 0,
            mar_total: 0, mar_total_paid: 0, mar_total_due: 0, mar_split1: 0, mar_split2: 0
        })
        return data

    }
    let tableviewfun = (feeData) => {
        const result = {};
        Object.entries(feeData).forEach(([key, value]) => {
            const [month, ...typeParts] = key.split("_");
            const type = typeParts.join("_");

            if (!result[month]) {
                result[month] = { month };
            }
            if (type === "total") result[month].total = value;
            if (type === "total_paid") result[month].totalpaid = value;
            if (type === "total_due") result[month].totaldue = value;
            if (type === "split1") result[month].split1 = value;
            if (type === "split2") result[month].split2 = value;
        });
        const data = Object.values(result);
        return data

    }
    let totalvalueFun = (feedata, type, month) => {
        let total = 0;
        let total_paid = 0;
        let total_split1 = 0;
        let total_split2 = 0;
        if (type == 'monthly' && month == 'apr') {
            total = feedata.apr_total;
            total_paid = feedata.apr_total_paid;
            total_split1 = feedata?.apr_split1;
            total_split2 = feedata?.apr_split2
        }
        if (type == 'monthly' && month == 'may') {
            total = feedata.may_total;
            total_paid = feedata.may_total_paid;
            total_split1 = feedata?.may_split1;
            total_split2 = feedata?.may_split2
        }
        if (type == 'monthly' && month == 'jun') {
            total = feedata.jun_total;
            total_paid = feedata.jun_total_paid;
            total_split1 = feedata?.jun_split1;
            total_split2 = feedata?.jun_split2
        }
        if (type == 'monthly' && month == 'jul') {
            total = feedata.jul_total;
            total_paid = feedata.jul_total_paid;

        }
        if (type == 'monthly' && month == 'aug') {
            total = feedata.aug_total;
            total_paid = feedata.aug_total_paid;
            total_split1 = feedata?.aug_split1;
            total_split2 = feedata?.aug_split2
        }
        if (type == 'monthly' && month == 'sep') {
            total = feedata.sep_total;
            total_paid = feedata.sep_total_paid;
            total_split1 = feedata?.sep_split1;
            total_split2 = feedata?.sep_split2
        }
        if (type == 'monthly' && month == 'oct') {
            total = feedata.oct_total;
            total_paid = feedata.oct_total_paid;
            total_split1 = feedata?.oct_split1;
            total_split2 = feedata?.oct_split2;
        }
        if (type == 'monthly' && month == 'nov') {
            total = feedata.nov_total;
            total_paid = feedata.nov_total_paid;
            total_split1 = feedata?.nov_split1;
            total_split2 = feedata?.nov_split2
        }
        if (type == 'monthly' && month == 'dec') {
            total = feedata.dec_total;
            total_paid = feedata.dec_total_paid;
            total_split1 = feedata?.dec_split1;
            total_split2 = feedata?.dec_split2

        }
        if (type == 'monthly' && month == 'jan') {
            total = feedata.jan_total;
            total_paid = feedata.jan_total_paid;
            total_split1 = feedata?.jan_split1;
            total_split2 = feedata?.jan_split2
        }
        if (type == 'monthly' && month == 'feb') {
            total = feedata.feb_total;
            total_paid = feedata.feb_total_paid;
            total_split1 = feedata?.feb_split1;
            total_split2 = feedata?.feb_split2
        }
        if (type == 'monthly' && month == 'mar') {
            total = feedata.mar_total;
            total_paid = feedata.mar_total_paid;
            total_split1 = feedata?.mar_split1;
            total_split2 = feedata?.mar_split2
        }
        if (type == 'quarterly' && month == 'apr') {
            total = feedata.apr_total + feedata.may_total + feedata.jun_total;
            total_paid = feedata.apr_total_paid + feedata.may_total_paid + feedata.jun_total_paid;
            total_split1 = feedata?.apr_split1 + feedata?.may_split1 + feedata?.jun_split1;
            total_split2 = feedata?.apr_split2 + feedata?.may_split2 + feedata?.jun_split2;
        }
        if (type == 'quarterly' && month == 'jul') {
            total = feedata.jul_total + feedata.aug_total + feedata.sep_total;
            total_paid = feedata.jul_total_paid + feedata.aug_total_paid + feedata.sep_total_paid;
            total_split1 = feedata?.jul_split1 + feedata?.aug_split1 + feedata?.sep_split1;
            total_split2 = feedata?.jul_split2 + feedata?.aug_split2 + feedata?.sep_split2;
        }
        if (type == 'quarterly' && month == 'oct') {
            total = feedata.oct_total + feedata.nov_total + feedata.dec_total;
            total_paid = feedata.oct_total_paid + feedata.nov_total_paid + feedata.dec_total_paid;
            total_split1 = feedata?.oct_split1 + feedata?.nov_split1 + feedata?.dec_split1;
            total_split2 = feedata?.oct_split2 + feedata?.nov_split2 + feedata?.dec_split2;
        }
        if (type == 'quarterly' && month == 'jan') {
            total = feedata.jan_total + feedata.feb_total + feedata.mar_total;
            total_paid = feedata.jan_total_paid + feedata.feb_total_paid + feedata.mar_total_paid;
            total_split1 = feedata?.jan_split1 + feedata?.feb_split1 + feedata?.mar_split1;
            total_split2 = feedata?.jan_split2 + feedata?.feb_split2 + feedata?.mar_split2;
        }
        if (type == 'half_yearly' && month == 'apr') {
            total = feedata.apr_total + feedata.may_total + feedata.jun_total + feedata.jul_total + feedata.aug_total + feedata.sep_total;
            total_paid = feedata.apr_total_paid + feedata.may_total_paid + feedata.jun_total_paid + feedata.jul_total_paid + feedata.aug_total_paid + feedata.sep_total_paid;
            total_split1 = feedata?.apr_split1 + feedata?.may_split1 + feedata?.jun_split1 + feedata?.jul_split1 + feedata?.aug_split1 + feedata?.sep_split1;
            total_split2 = feedata?.apr_split2 + feedata?.may_split2 + feedata?.jun_split2 + feedata?.jul_split2 + feedata?.aug_split2 + feedata?.sep_split2;
        }
        if (type == 'half_yearly' && month == 'oct') {
            total = feedata.oct_total + feedata.nov_total + feedata.dec_total + feedata.jan_total + feedata.feb_total + feedata.mar_total;
            total_paid = feedata.oct_total_paid + feedata.nov_total_paid + feedata.dec_total_paid + feedata.jan_total_paid + feedata.feb_total_paid + feedata.mar_total_paid;
            total_split1 = feedata?.oct_split1 + feedata?.nov_split1 + feedata?.dec_split1 + feedata?.jan_split1 + feedata?.feb_split1 + feedata?.mar_split1;
            total_split2 = feedata?.oct_split2 + feedata?.nov_split2 + feedata?.dec_split2 + feedata?.jan_split2 + feedata?.feb_split2 + feedata?.mar_split2;
        }
        if (type == 'annually' && month == 'apr') {
            total = feedata.apr_total + feedata.may_total + feedata.jun_total + feedata.jul_total + feedata.aug_total + feedata.sep_total + feedata.oct_total + feedata.nov_total + feedata.dec_total + feedata.jan_total + feedata.feb_total + feedata.mar_total;
            total_paid = feedata.apr_total_paid + feedata.may_total_paid + feedata.jun_total_paid + feedata.jul_total_paid + feedata.aug_total_paid + feedata.sep_total_paid + feedata.oct_total_paid + feedata.nov_total_paid + feedata.dec_total_paid + feedata.jan_total_paid + feedata.feb_total_paid + feedata.mar_total_paid;
            total_split1 = feedata?.apr_split1 + feedata?.may_split1 + feedata?.jun_split1 + feedata?.jul_split1 + feedata?.aug_split1 + feedata?.sep_split1 + feedata?.oct_split1 + feedata?.nov_split1 + feedata?.dec_split1 + feedata?.jan_split1 + feedata?.feb_split1 + feedata?.mar_split1;
            total_split2 = feedata?.apr_split2 + feedata?.may_split2 + feedata?.jun_split2 + feedata?.jul_split2 + feedata?.aug_split2 + feedata?.sep_split2 + feedata?.oct_split2 + feedata?.nov_split2 + feedata?.dec_split2 + feedata?.jan_split2 + feedata?.feb_split2 + feedata?.mar_split2;
        }
        return { total, total_split1, total_split2, total_paid }

    }




    useEffect(() => {
        const fetchData = async () => {
            try {

                let { data } = await axios.get(`${baseURL}/api/fees/registration/${11}`)
                let response = await axios.get(`${baseURL}/api/fee-groups/student/${14}/assigned-fees-split`)

                let allrecords = response?.data?.data.map((elem) => {
                    return {
                        ...elem,
                        jan_paid: 0,
                        feb_paid: 0,
                        mar_paid: 0,
                        apr_paid: 0,
                        may_paid: 0,
                        jun_paid: 0,
                        jul_paid: 0,
                        aug_paid: 0,
                        sep_paid: 0,
                        oct_paid: 0,
                        nov_paid: 0,
                        dec_paid: 0,
                    }
                })
                let academicRecords = allrecords.filter((elem) => elem.fee_for == 3)
                let admissionRecords = allrecords.filter((elem) => elem.fee_for == 2)
                let canteenRecords = allrecords.filter((elem) => elem.fee_for == 4)
                setTypofAcademicFee(academicRecords[0] ? academicRecords[0]?.scheduletype : '')
                setTypofAdmissionFee(admissionRecords[0] ? admissionRecords[0]?.scheduletype : '')
                setTypofCanteenFee(canteenRecords[0] ? canteenRecords[0]?.scheduletype : '')
                acsetType(academicRecords[0] ? academicRecords[0]?.scheduletype : '')
                setAdtype(admissionRecords[0] ? admissionRecords[0]?.scheduletype : '')
                setCantype(canteenRecords[0] ? canteenRecords[0]?.scheduletype : '')

                setIsSplitAcademicFee(academicRecords[0] ? Number(academicRecords[0]?.apr_split1) > 0 || Number(academicRecords[0]?.may_split1) > 0 || Number(academicRecords[0]?.jun_split1) > 0 || Number(academicRecords[0]?.jul_split1) > 0 || Number(academicRecords[0]?.aug_split1) > 0 || Number(academicRecords[0]?.sep_split1) > 0 || Number(academicRecords[0]?.oct_split1) > 0 || Number(academicRecords[0]?.nov_split1) > 0 || Number(academicRecords[0]?.dec_split1) > 0 || Number(academicRecords[0]?.jan_split1) > 0 || Number(academicRecords[0]?.feb_split1) > 0 || Number(academicRecords[0]?.mar_split1) > 0 : false)
                setIsSplitAdmissionFee(admissionRecords[0] ? Number(admissionRecords[0]?.apr_split1) > 0 || Number(admissionRecords[0]?.may_split1) > 0 || Number(admissionRecords[0]?.jun_split1) > 0 || Number(admissionRecords[0]?.jul_split1) > 0 || Number(admissionRecords[0]?.aug_split1) > 0 || Number(admissionRecords[0]?.sep_split1) > 0 || Number(admissionRecords[0]?.oct_split1) > 0 || Number(admissionRecords[0]?.nov_split1) > 0 || Number(admissionRecords[0]?.dec_split1) > 0 || Number(admissionRecords[0]?.jan_split1) > 0 || Number(admissionRecords[0]?.feb_split1) > 0 || Number(admissionRecords[0]?.mar_split1) > 0 : false)
                setIsSplitCanteenFee(canteenRecords[0] ? Number(canteenRecords[0]?.apr_split1) > 0 || Number(canteenRecords[0]?.may_split1) > 0 || Number(canteenRecords[0]?.jun_split1) > 0 || Number(canteenRecords[0]?.jul_split1) > 0 || Number(canteenRecords[0]?.aug_split1) > 0 || Number(canteenRecords[0]?.sep_split1) > 0 || Number(canteenRecords[0]?.oct_split1) > 0 || Number(canteenRecords[0]?.nov_split1) > 0 || Number(canteenRecords[0]?.dec_split1) > 0 || Number(canteenRecords[0]?.jan_split1) > 0 || Number(canteenRecords[0]?.feb_split1) > 0 || Number(canteenRecords[0]?.mar_split1) > 0 : false)

                setStudentFee(academicRecords)
                setAdmissionFee(admissionRecords)
                setCanteenFee(canteenRecords)


                let acfeeData = totalmontwisefun(academicRecords)
                let admissionFeeData = totalmontwisefun(admissionRecords)
                let canteenFeeData = totalmontwisefun(canteenRecords)

                setAcademicFeeData(acfeeData)
                setAdmissionFeeData(admissionFeeData)

                setCanteenFeeData(canteenFeeData)

                let totalAcademicFee = acfeeData.apr_total + acfeeData.may_total + acfeeData.jun_total + acfeeData.jul_total + acfeeData.aug_total + acfeeData.sep_total + acfeeData.oct_total + acfeeData.nov_total + acfeeData.dec_total + acfeeData.jan_total + acfeeData.feb_total + acfeeData.mar_total
                let totalPaid = acfeeData.apr_total_paid + acfeeData.may_total_paid + acfeeData.jun_total_paid + acfeeData.jul_total_paid + acfeeData.aug_total_paid + acfeeData.sep_total_paid + acfeeData.oct_total_paid + acfeeData.nov_total_paid + acfeeData.dec_total_paid + acfeeData.jan_total_paid + acfeeData.feb_total_paid + acfeeData.mar_total_paid
                setAcademicFee(totalAcademicFee)
                setTotalPaid(totalPaid)
                setPayableFee(totalAcademicFee - totalPaid)

                let totalAdmissionFee = admissionFeeData.apr_total + admissionFeeData.may_total + admissionFeeData.jun_total + admissionFeeData.jul_total + admissionFeeData.aug_total + admissionFeeData.sep_total + admissionFeeData.oct_total + admissionFeeData.nov_total + admissionFeeData.dec_total + admissionFeeData.jan_total + admissionFeeData.feb_total + admissionFeeData.mar_total
                let totalPaidAdmissionFee = admissionFeeData.apr_total_paid + admissionFeeData.may_total_paid + admissionFeeData.jun_total_paid + admissionFeeData.jul_total_paid + admissionFeeData.aug_total_paid + admissionFeeData.sep_total_paid + admissionFeeData.oct_total_paid + admissionFeeData.nov_total_paid + admissionFeeData.dec_total_paid + admissionFeeData.jan_total_paid + admissionFeeData.feb_total_paid + admissionFeeData.mar_total_paid
                setAdmissionTotalFee(totalAdmissionFee)
                setTotalPaidAdmissionFee(totalPaidAdmissionFee)
                setPayableAdmissionFee(totalAdmissionFee - totalPaidAdmissionFee)

                let totalCanteenFee = canteenFeeData.apr_total + canteenFeeData.may_total + canteenFeeData.jun_total + canteenFeeData.jul_total + canteenFeeData.aug_total + canteenFeeData.sep_total + canteenFeeData.oct_total + canteenFeeData.nov_total + canteenFeeData.dec_total + canteenFeeData.jan_total + canteenFeeData.feb_total + canteenFeeData.mar_total
                let totalPaidCanteenFee = canteenFeeData.apr_total_paid + canteenFeeData.may_total_paid + canteenFeeData.jun_total_paid + canteenFeeData.jul_total_paid + canteenFeeData.aug_total_paid + canteenFeeData.sep_total_paid + canteenFeeData.oct_total_paid + canteenFeeData.nov_total_paid + canteenFeeData.dec_total_paid + canteenFeeData.jan_total_paid + canteenFeeData.feb_total_paid + canteenFeeData.mar_total_paid
                setCanteenTotalFee(totalCanteenFee)
                setTotalPaidCanteenFee(totalPaidCanteenFee)
                setPayableCanteenFee(totalCanteenFee - totalPaidCanteenFee)

                const facData = tableviewfun(acfeeData)
                setacdemicTableViewData(facData);

                const admissionData = tableviewfun(admissionFeeData)

                setAdmissionTableViewData(admissionData);

                const canteenData = tableviewfun(canteenFeeData)

                setCanteenTableViewData(canteenData);

            }
            catch (error) {

            }
        }
        fetchData()
    }, [])
    let handlePay = async (month, splitname, splitamount) => {


        // console.log('academic fee data is:',academicFeeData)
        try {
            let total = 0;
            let total_paid = 0;
            if (type == 'monthly' && month == 'apr') {
                total = academicFeeData.apr_total;
                total_paid = academicFeeData.apr_total_paid;
            }
            if (type == 'monthly' && month == 'may') {
                total = academicFeeData.may_total;
                total_paid = academicFeeData.may_total_paid;
            }
            if (type == 'monthly' && month == 'jun') {
                total = academicFeeData.jun_total;
                total_paid = academicFeeData.jun_total_paid;
            }
            if (type == 'monthly' && month == 'jul') {
                total = academicFeeData.jul_total;
                total_paid = academicFeeData.jul_total_paid;
            }
            if (type == 'monthly' && month == 'aug') {
                total = academicFeeData.aug_total;
                total_paid = academicFeeData.aug_total_paid;
            }
            if (type == 'monthly' && month == 'sep') {
                total = academicFeeData.sep_total;
                total_paid = academicFeeData.sep_total_paid;
            }
            if (type == 'monthly' && month == 'oct') {
                total = academicFeeData.oct_total;
                total_paid = academicFeeData.oct_total_paid;
            }
            if (type == 'monthly' && month == 'nov') {
                total = academicFeeData.nov_total;
                total_paid = academicFeeData.nov_total_paid;
            }
            if (type == 'monthly' && month == 'dec') {
                total = academicFeeData.dec_total;
                total_paid = academicFeeData.dec_total_paid;
            }
            if (type == 'monthly' && month == 'jan') {
                total = academicFeeData.jan_total;
                total_paid = academicFeeData.jan_total_paid;
            }
            if (type == 'monthly' && month == 'feb') {
                total = academicFeeData.feb_total;
                total_paid = academicFeeData.feb_total_paid;
            }
            if (type == 'monthly' && month == 'mar') {
                total = academicFeeData.mar_total;
                total_paid = academicFeeData.mar_total_paid;
            }
            if (type == 'quarterly' && month == 'apr') {
                total = academicFeeData.apr_total + academicFeeData.may_total + academicFeeData.jun_total;
                total_paid = academicFeeData.apr_total_paid + academicFeeData.may_total_paid + academicFeeData.jun_total_paid;
            }
            if (type == 'quarterly' && month == 'jul') {
                total = academicFeeData.jul_total + academicFeeData.aug_total + academicFeeData.sep_total;
                total_paid = academicFeeData.jul_total_paid + academicFeeData.aug_total_paid + academicFeeData.sep_total_paid;
            }
            if (type == 'quarterly' && month == 'oct') {
                total = academicFeeData.oct_total + academicFeeData.nov_total + academicFeeData.dec_total;
                total_paid = academicFeeData.oct_total_paid + academicFeeData.nov_total_paid + academicFeeData.dec_total_paid;
            }
            if (type == 'quarterly' && month == 'jan') {
                total = academicFeeData.jan_total + academicFeeData.feb_total + academicFeeData.mar_total;
                total_paid = academicFeeData.jan_total_paid + academicFeeData.feb_total_paid + academicFeeData.mar_total_paid;
            }
            if (type == 'half_yearly' && month == 'apr') {
                total = academicFeeData.apr_total + academicFeeData.may_total + academicFeeData.jun_total + academicFeeData.jul_total + academicFeeData.aug_total + academicFeeData.sep_total;
                total_paid = academicFeeData.apr_total_paid + academicFeeData.may_total_paid + academicFeeData.jun_total_paid + academicFeeData.jul_total_paid + academicFeeData.aug_total_paid + academicFeeData.sep_total_paid;
            }
            if (type == 'half_yearly' && month == 'oct') {
                total = academicFeeData.oct_total + academicFeeData.nov_total + academicFeeData.dec_total + academicFeeData.jan_total + academicFeeData.feb_total + academicFeeData.mar_total;
                total_paid = academicFeeData.oct_total_paid + academicFeeData.nov_total_paid + academicFeeData.dec_total_paid + academicFeeData.jan_total_paid + academicFeeData.feb_total_paid + academicFeeData.mar_total_paid;
            }
            if (type == 'annually' && month == 'apr') {
                total = academicFeeData.apr_total + academicFeeData.may_total + academicFeeData.jun_total + academicFeeData.jul_total + academicFeeData.aug_total + academicFeeData.sep_total + academicFeeData.oct_total + academicFeeData.nov_total + academicFeeData.dec_total + academicFeeData.jan_total + academicFeeData.feb_total + academicFeeData.mar_total;
                total_paid = academicFeeData.apr_total_paid + academicFeeData.may_total_paid + academicFeeData.jun_total_paid + academicFeeData.jul_total_paid + academicFeeData.aug_total_paid + academicFeeData.sep_total_paid + academicFeeData.oct_total_paid + academicFeeData.nov_total_paid + academicFeeData.dec_total_paid + academicFeeData.jan_total_paid + academicFeeData.feb_total_paid + academicFeeData.mar_total_paid;
            }

            let collectfeevalue = { reg_no: 4, total: academicFee, payment: total - total_paid, total_paid: totalPaid + (total - total_paid), balance: payableFee - (total - total_paid), consession: 0, consessionamount: 0, remark: '', payment_mode: 'online', date: new Date().toISOString().split('T')[0] }



            //  console.log('student fee is**************',studentFee)
            let dataMonthly = studentFee.map(elem => {
                if (month == 'apr') { return { ...elem, apr_total_paid: Number(elem.apr_total), apr_paid: Number(elem.apr_total) - Number(elem.apr_total_paid), apr_total_due: 0 } }
                if (month == 'may') { return { ...elem, may_total_paid: Number(elem.may_total), may_paid: Number(elem.may_total) - Number(elem.may_total_paid), may_total_due: 0 } }
                if (month == 'jun') { return { ...elem, jun_total_paid: Number(elem.jun_total), jun_paid: Number(elem.jun_total) - Number(elem.jun_total_paid), jun_total_due: 0 } }
                if (month == 'jul') { return { ...elem, jul_total_paid: Number(elem.jul_total), jul_paid: Number(elem.jul_total) - Number(elem.jul_total_paid), jul_total_due: 0 } }
                if (month == 'aug') { return { ...elem, aug_total_paid: Number(elem.aug_total), aug_paid: Number(elem.aug_total) - Number(elem.aug_total_paid), aug_total_due: 0 } }
                if (month == 'sep') { return { ...elem, sep_total_paid: Number(elem.sep_total), sep_paid: Number(elem.sep_total) - Number(elem.sep_total_paid), sep_total_due: 0 } }
                if (month == 'oct') { return { ...elem, oct_total_paid: Number(elem.oct_total), oct_paid: Number(elem.oct_total) - Number(elem.oct_total_paid), oct_total_due: 0 } }
                if (month == 'nov') { return { ...elem, nov_total_paid: Number(elem.nov_total), nov_paid: Number(elem.nov_total) - Number(elem.nov_total_paid), nov_total_due: 0 } }
                if (month == 'dec') { return { ...elem, dec_total_paid: Number(elem.dec_total), dec_paid: Number(elem.dec_total) - Number(elem.dec_total_paid), dec_total_due: 0 } }
                if (month == 'jan') { return { ...elem, jan_total_paid: Number(elem.jan_total), jan_paid: Number(elem.jan_total) - Number(elem.jan_total_paid), jan_total_due: 0 } }
                if (month == 'feb') { return { ...elem, feb_total_paid: Number(elem.feb_total), feb_paid: Number(elem.feb_total) - Number(elem.feb_total_paid), feb_total_due: 0 } }
                if (month == 'mar') { return { ...elem, mar_total_paid: Number(elem.mar_total), mar_paid: Number(elem.mar_total) - Number(elem.mar_total_paid), mar_total_due: 0 } }
            })
            let dataquarterly = studentFee.map((elem) => {
                if (month == 'apr') { return { ...elem, apr_total_paid: Number(elem.apr_total), apr_paid: Number(elem.apr_total) - Number(elem.apr_total_paid), apr_total_due: 0, may_total_paid: Number(elem.may_total), may_paid: Number(elem.may_total) - Number(elem.may_total_paid), may_total_due: 0, jun_total_paid: Number(elem.jun_total), jun_paid: Number(elem.jun_total) - Number(elem.jun_total_paid), jun_total_due: 0 } }
                if (month == 'jul') { return { ...elem, jul_total_paid: Number(elem.jul_total), jul_paid: Number(elem.jul_total) - Number(elem.jul_total_paid), jul_total_due: 0, aug_total_paid: Number(elem.aug_total), aug_paid: Number(elem.aug_total) - Number(elem.aug_total_paid), aug_total_due: 0, sep_total_paid: Number(elem.sep_total), sep_paid: Number(elem.sep_total) - Number(elem.sep_total_paid), sep_total_due: 0 } }
                if (month == 'oct') { return { ...elem, oct_total_paid: Number(elem.oct_total), oct_paid: Number(elem.oct_total) - Number(elem.oct_total_paid), oct_total_due: 0, nov_total_paid: Number(elem.nov_total), nov_paid: Number(elem.nov_total) - Number(elem.nov_total_paid), nov_total_due: 0, dec_total_paid: Number(elem.dec_total), dec_paid: Number(elem.dec_total) - Number(elem.dec_total_paid), dec_total_due: 0 } }
                if (month == 'jan') { return { ...elem, jan_total_paid: Number(elem.jan_total), jan_paid: Number(elem.jan_total) - Number(elem.jan_total_paid), jan_total_due: 0, feb_total_paid: Number(elem.feb_total), feb_paid: Number(elem.feb_total) - Number(elem.feb_total_paid), feb_total_due: 0, mar_total_paid: Number(elem.mar_total), mar_paid: Number(elem.mar_total) - Number(elem.mar_total_paid), mar_total_due: 0 } }
            })

            let datahalf_yearly = studentFee.map((elem) => {
                if (month == 'apr') { return { ...elem, apr_total_paid: Number(elem.apr_total), apr_paid: Number(elem.apr_total) - Number(elem.apr_total_paid), apr_total_due: 0, may_total_paid: Number(elem.may_total), may_paid: Number(elem.may_total) - Number(elem.may_total_paid), may_total_due: 0, jun_total_paid: Number(elem.jun_total), jun_paid: Number(elem.jun_total) - Number(elem.jun_total_paid), jun_total_due: 0, jul_total_paid: Number(elem.jul_total), jul_paid: Number(elem.jul_total) - Number(elem.jul_total_paid), jul_total_due: 0, aug_total_paid: Number(elem.aug_total), aug_paid: Number(elem.aug_total) - Number(elem.aug_total_paid), aug_total_due: 0, sep_total_paid: Number(elem.sep_total), sep_paid: Number(elem.sep_total) - Number(elem.sep_total_paid), sep_total_due: 0 } }
                if (month == 'oct') { return { ...elem, oct_total_paid: Number(elem.oct_total), oct_paid: Number(elem.oct_total) - Number(elem.oct_total_paid), oct_total_due: 0, nov_total_paid: Number(elem.nov_total), nov_paid: Number(elem.nov_total) - Number(elem.nov_total_paid), nov_total_due: 0, dec_total_paid: Number(elem.dec_total), dec_paid: Number(elem.dec_total) - Number(elem.dec_total_paid), dec_total_due: 0, jan_total_paid: Number(elem.jan_total), jan_paid: Number(elem.jan_total) - Number(elem.jan_total_paid), jan_total_due: 0, feb_total_paid: Number(elem.feb_total), feb_paid: Number(elem.feb_total) - Number(elem.feb_total_paid), feb_total_due: 0, mar_total_paid: Number(elem.mar_total), mar_paid: Number(elem.mar_total) - Number(elem.mar_total_paid), mar_total_due: 0 } }

            })

            let dataAnnually = studentFee.map((elem) => {
                return { ...elem, apr_total_paid: Number(elem.apr_total), apr_paid: Number(elem.apr_total) - Number(elem.apr_total_paid), apr_total_due: 0, may_total_paid: Number(elem.may_total), may_paid: Number(elem.may_total) - Number(elem.may_total_paid), may_total_due: 0, jun_total_paid: Number(elem.jun_total), jun_paid: Number(elem.jun_total) - Number(elem.jun_total_paid), jun_total_due: 0, jul_total_paid: Number(elem.jul_total), jul_paid: Number(elem.jul_total) - Number(elem.jul_total_paid), jul_total_due: 0, aug_total_paid: Number(elem.aug_total), aug_paid: Number(elem.aug_total) - Number(elem.aug_total_paid), aug_total_due: 0, sep_total_paid: Number(elem.sep_total), sep_paid: Number(elem.sep_total) - Number(elem.sep_total_paid), sep_total_due: 0, oct_total_paid: Number(elem.oct_total), oct_paid: Number(elem.oct_total) - Number(elem.oct_total_paid), oct_total_due: 0, nov_total_paid: Number(elem.nov_total), nov_paid: Number(elem.nov_total) - Number(elem.nov_total_paid), nov_total_due: 0, dec_total_paid: Number(elem.dec_total), dec_paid: Number(elem.dec_total) - Number(elem.dec_total_paid), dec_total_due: 0, jan_total_paid: Number(elem.jan_total), jan_paid: Number(elem.jan_total) - Number(elem.jan_total_paid), jan_total_due: 0, feb_total_paid: Number(elem.feb_total), feb_paid: Number(elem.feb_total) - Number(elem.feb_total_paid), feb_total_due: 0, mar_total_paid: Number(elem.mar_total), mar_paid: Number(elem.mar_total) - Number(elem.mar_total_paid), mar_total_due: 0 }
            })



            dataMonthly = dataMonthly.map(elem => {
                return { ...elem, date: new Date().toISOString().split('T')[0] }
            })
            console.log('data monthly is:', dataMonthly)
            dataquarterly = dataquarterly.map(elem => {
                return { ...elem, date: new Date().toISOString().split('T')[0] }
            })
            datahalf_yearly = datahalf_yearly.map(elem => {

                return { ...elem, date: new Date().toISOString().split('T')[0] }
            })
            dataAnnually = dataAnnually.map(elem => {
                return { ...elem, date: new Date().toISOString().split('T')[0] }
            })
            let records = []
            if (type == 'monthly') { records = dataMonthly }
            if (type == 'quarterly') { records = dataquarterly }
            if (type == 'half_yearly') { records = datahalf_yearly }
            if (type == 'annually') { records = dataAnnually }

            let filteredstudentfees = records.map(({ apr_paid, may_paid, jun_paid, jul_paid, aug_paid, sep_paid, oct_paid, nov_paid, dec_paid, jan_paid, feb_paid, mar_paid, ...rest }) => rest)
            // console.log('records is:',records)

            let senddata = { feecollection: collectfeevalue, filteredstudentfees: filteredstudentfees, feerecordmothlydata: records }
            // let {data}=await axios.post(`${baseURL}/api/student-fees/fee-collection`,senddata)


            alert('fee is saved successfully')
        }
        catch (error) {
            alert('not saved')
            alert(error)
        }


    }


console.log('is academidc fee split :',isSplitAcademicFee && typofAcademicFee == 'monthly' || isSplitAcademicFee && typofAcademicFee == 'quarterly' || false)


    let TransactionView = () => {
        let [downloadingKey, setDownloadingKey] = useState(null)
        let txRegNo = (item) => item?.reg_no ?? item?.registration_no ?? '—'
        let txDownloadKey = (item, index) => String(item?.id ?? item?.fee_table_id ?? item?.transaction_no ?? `row-${index}`)
        let downloadReceipt = async (item, index) => {
            let key = txDownloadKey(item, index)
            if (item?.receipt_url || item?.download_url) {
                window.open(item.receipt_url || item.download_url, '_blank', 'noopener,noreferrer')
                return
            }
            let regNo = item?.reg_no ?? item?.registration_no ?? 11
            let feeTableId = item?.id ?? item?.fee_table_id
            if (feeTableId == null || feeTableId === '') {
                alert('Receipt is not available for this row (missing fee id).')
                return
            }
            setDownloadingKey(key)
            try {
                let response = await axios.post(
                    `${baseURL}/api/fees/fee-reciept-pdf`,
                    { reg_no: Number(regNo), fee_table_id: feeTableId },
                    { responseType: 'blob' }
                )
                let blob = new Blob([response.data], {
                    type: response.headers['content-type'] || 'application/pdf',
                })
                let url = window.URL.createObjectURL(blob)
                let a = document.createElement('a')
                a.href = url
                a.download = `fee-receipt-${regNo}-${feeTableId}.pdf`
                document.body.appendChild(a)
                a.click()
                a.remove()
                window.URL.revokeObjectURL(url)
            }
            catch (err) {
                console.error('Receipt download failed:', err)
                alert('Could not download receipt. Check that the server accepts this request.')
            }
            finally {
                setDownloadingKey(null)
            }
        }
        let txStatusInfo = (item) => {
            let raw = item?.status ?? item?.payment_status
            let text = raw != null && String(raw).trim() !== '' ? String(raw).trim() : null
            if (!text) {
                let bal = Number(item?.balance)
                text = Number.isFinite(bal) && bal <= 0 ? 'Paid' : 'Pending'
            }
            let lower = text.toLowerCase()
            let variant = 'default'
            if (lower.includes('paid') && !lower.includes('unpaid')) variant = 'paid'
            else if (lower.includes('pending') || lower.includes('due') || lower.includes('partial')) variant = 'pending'
            else if (lower.includes('fail') || lower.includes('reject') || lower.includes('cancel')) variant = 'failed'
            return { text, variant }
        }
        let statusIcon = (variant) => {
            if (variant === 'paid') return 'solar:check-circle-bold-duotone'
            if (variant === 'pending') return 'solar:clock-circle-bold-duotone'
            if (variant === 'failed') return 'solar:close-circle-bold-duotone'
            return 'solar:shield-check-bold-duotone'
        }
        return (
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
                                {feetransactionData.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className='af-tx-table-empty'>No transactions to show.</td>
                                    </tr>
                                ) : feetransactionData.map((item, index) => {
                                    let { text: statusText, variant: statusVariant } = txStatusInfo(item)
                                    let dKey = txDownloadKey(item, index)
                                    return (
                                        <tr key={index} className='af-tx-tr'>
                                            <td className='af-tx-td af-tx-td--num af-tx-mono'>{index + 1}</td>
                                            <td className='af-tx-td af-tx-mono'>{txRegNo(item)}</td>
                                            <td className='af-tx-td af-tx-mono'>{item.transaction_no ?? '—'}</td>
                                            <td className='af-tx-td'>
                                                <span className={`af-tx-status-badge af-tx-status--${statusVariant}`}>
                                                    <Icon icon={statusIcon(statusVariant)} className="af-tx-status-badge-icon" aria-hidden />
                                                    {statusText}
                                                </span>
                                            </td>
                                            <td className='af-tx-td af-tx-mono'>{item.date ?? '—'}</td>
                                            <td className='af-tx-td af-tx-td--end af-tx-mono'>{item.total}</td>
                                            <td className='af-tx-td af-tx-td--end af-tx-mono af-tx-cell--paid'>{item.total_paid}</td>
                                            <td className='af-tx-td af-tx-td--end af-tx-mono af-tx-cell--due'>{item.balance}</td>
                                            <td className='af-tx-td af-tx-td--action'>
                                                <button
                                                    type='button'
                                                    className='btn af-tx-download-btn'
                                                    onClick={() => downloadReceipt(item, index)}
                                                    disabled={downloadingKey === dKey}
                                                    title='Download receipt'
                                                >
                                                    {downloadingKey === dKey ? (
                                                        <span className='spinner-border spinner-border-sm af-tx-download-spinner' role='status' aria-label='Loading' />
                                                    ) : (
                                                        <Icon icon="solar:download-minimalistic-bold-duotone" className="af-tx-download-btn-icon" aria-hidden />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }
//working on admiission desturcture
    let admissionFeeView = () => {

        return (
            <div className='card af-fee-card mb-4'>
                <div className='card-header d-flex justify-content-between'>
                    <h6 className='card-title af-fee-card-title'>
                        <Icon icon="solar:graduation-cap-bold-duotone" className="af-fee-card-title-icon" aria-hidden />
                        Admission Fee
                    </h6>
                    <div className='af-period-btns'>
                        {typofAdmissionFee === 'monthly' && (
                            <button type="button" className='btn af-period-btn me-2' onClick={() => setAdtype('monthly')}>
                                <Icon icon="solar:calendar-date-bold-duotone" className="af-period-btn-icon" aria-hidden />
                                Monthly
                            </button>)
                        }

                        {typofAdmissionFee == 'monthly' || typofAdmissionFee === 'quarterly' && (
                            <button type="button" className='btn af-period-btn me-2' onClick={() => setAdtype('quarterly')}
                                disabled={isSplitAdmissionFee && typofAdmissionFee == 'monthly' || false}>
                                <Icon icon="solar:calendar-mark-bold-duotone" className="af-period-btn-icon" aria-hidden />
                                quarterly
                            </button>)}
                        {typofAdmissionFee == 'monthly' || typofAdmissionFee === 'quarterly' || typofAdmissionFee === 'half_yearly' && (
                            <button type="button" className='btn af-period-btn me-2' onClick={() => setAdtype('half_yearly')}
                                disabled={isSplitAdmissionFee && typofAdmissionFee == 'monthly' || isSplitAdmissionFee && typofAdmissionFee == 'quarterly' || false}>
                                <Icon icon="solar:calendar-minimalistic-bold-duotone" className="af-period-btn-icon" aria-hidden />
                                Half yearly
                            </button>)}
                        <button type="button" className='btn af-period-btn me-2' onClick={() => setAdtype('annually')}
                            disabled={isSplitAdmissionFee && typofAdmissionFee == 'monthly' || isSplitAdmissionFee && typofAdmissionFee == 'quarterly' || isSplitAdmissionFee && typofAdmissionFee == 'half_yearly' || false}
                        >
                            <Icon icon="solar:calendar-bold-duotone" className="af-period-btn-icon" aria-hidden />
                            Annually
                        </button>
                    </div>
                </div>
                <div className='card-body'>
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
                            admissionTableViewData.map((item, index) => {
                                const { total, total_split1, total_split2 } = totalvalueFun(admissionFeeData, adtype, item?.month) || {}
                                return (
                                <>
                                    <div
                                        className={`row af-fee-row af-fee-row--data${adtype === "monthly"
                                            ? " border-top"
                                            : adtype === "half_yearly" &&
                                                (index === 0 || index === 6)
                                                ? " border-top"
                                                : adtype === "quarterly" &&
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
                                            {

                                                adtype == 'monthly' && (
                                                    <>

                                                        {isSplitAdmissionFee ? (
                                                            <>
                                                                <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                                    <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />

                                                                    {total_split1} Pay
                                                                </button>
                                                                {total_split2 > 0 &&
                                                                <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                                    <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />

                                                                    {total_split2} Pay
                                                                </button>}
                                                            </>
                                                        ) : (
                                                            <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                                <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />

                                                                {total} Pay
                                                            </button>
                                                        )}
                                                    </>
                                                )
                                            }
                                            {adtype == 'quarterly' && ((index == 0 || index == 3 || index == 6 || index == 9 || index == 12)) ? (
                                                (
                                                    <>
                                                    {
                                                     isSplitAdmissionFee ? (
                                                    <>
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split1} Pay
                                                    </button>
                                                  {total_split2 > 0 &&
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split2} Pay
                                                    </button>}
                                                    </>
                                                    ) : (
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn' onClick={() => handlePay(item?.month)}>

                                                    {total}
                                                    Pay</button>
                                                    )
                                                   }

                                                    </>
                                                )
                                            ) : null}
                                            {adtype == 'half_yearly' && ((index == 0 || index == 6)) ? (

                                                <>
                                                    {isSplitAdmissionFee ? (
                                                        <>
                                                        <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split1} Pay
                                                        </button>
                                                        {total_split2 > 0 &&
                                                        <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split2} Pay
                                                        </button>}
                                                        </>
                                                    ) : (
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total} Pay
                                                    </button>
                                                    )}
                                                </>

                                            ) : null}
                                            {adtype == 'annually' && (index == 0) ? (
                                                <>

                                                    {isSplitAdmissionFee ? (
                                                    <>
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total_split1} Pay
                                                    </button>
                                                    {total_split2 > 0 &&
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total_split2} Pay
                                                    </button>}
                                                    </>
                                                    ) : (
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total} Pay
                                                    </button>
                                                    )}

                                                </>

                                            ) : null}

                                        </div>
                                    </div>


                                </>
                            )})
                        }
                    </div>
                </div>
            </div>
        )
    }
    let academicFeeView = () => {

        return (
            <div className='card af-fee-card mb-4'>
                <div className='card-header d-flex justify-content-between'>
                    <h6 className='card-title af-fee-card-title'>
                        <Icon icon="solar:graduation-cap-bold-duotone" className="af-fee-card-title-icon" aria-hidden />
                        Academic Fee
                    </h6>
                    <div className='af-period-btns'>
                        {typofAcademicFee === 'monthly' && (
                            <button type="button" className='btn af-period-btn me-2'
                                onClick={() => acsetType('monthly')}

                            >
                                <Icon icon="solar:calendar-date-bold-duotone" className="af-period-btn-icon" aria-hidden />
                                Monthly
                            </button>
                        )}

                        {/* Quarterly Button - Show if current is Monthly or Quarterly */}
                        {(typofAcademicFee === 'monthly' || typofAcademicFee == 'quarterly') && (
                            <button type="button" className='btn af-period-btn me-2'
                                onClick={() => acsetType('quarterly')}
                                disabled={isSplitAcademicFee && typofAcademicFee == 'monthly' || false}

                            >
                                <Icon icon="solar:calendar-mark-bold-duotone" className="af-period-btn-icon" aria-hidden />
                                Quarterly
                            </button>
                        )}

                        {/* Half Yearly Button - Show if current is Monthly, Quarterly or Half Yearly */}
                        {(typofAcademicFee === 'monthly' ||
                            typofAcademicFee === 'quarterly' ||
                            typofAcademicFee === 'half_yearly') && (
                                <button type="button" className='btn af-period-btn me-2'
                                    onClick={() => acsetType('half_yearly')}
                                    disabled={isSplitAcademicFee && typofAcademicFee == 'monthly' || isSplitAcademicFee && typofAcademicFee == 'quarterly' || false}
                                >
                                    <Icon icon="solar:calendar-minimalistic-bold-duotone" className="af-period-btn-icon" aria-hidden
                                    />
                                    Half Yearly
                                </button>
                            )}

                        {/* Annually Button - Always visible */}
                        <button type="button" className='btn af-period-btn me-2'
                            onClick={() => acsetType('annually')}
                            disabled={isSplitAcademicFee && typofAcademicFee == 'monthly' || isSplitAcademicFee && typofAcademicFee == 'quarterly' || isSplitAcademicFee && typofAcademicFee == 'half_yearly' || false}>
                            <Icon icon="solar:calendar-bold-duotone" className="af-period-btn-icon" aria-hidden
                               
                            />
                            Annually
                        </button>
                    </div>
                </div>
                <div className='card-body'>
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
                            acdemicTableViewData.map((item, index) => {
                                const { total, total_split1, total_split2 } = totalvalueFun(academicFeeData, actype, item?.month) || {}
                                return (
                                <>
                                    <div
                                        className={`row af-fee-row af-fee-row--data${actype === "monthly"
                                            ? " border-top"
                                            : actype === "half_yearly" &&
                                                (index === 0 || index === 6)
                                                ? " border-top"
                                                : actype === "quarterly" &&
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
                                            {

                                                actype == 'monthly' && (
                                                    <>

                                                        {isSplitAcademicFee ? (
                                                            <>
                                                                <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                                    <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />

                                                                    {total_split1} Pay
                                                                </button>

                                                                {total_split2 > 0 && <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                                    <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />

                                                                    {total_split2} Pay
                                                                </button>}
                                                            </>
                                                        ) : (
                                                            <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                                <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />

                                                                {total} Pay
                                                            </button>
                                                        )}
                                                    </>
                                                )
                                            }
                                            {actype == 'quarterly' && ((index == 0 || index == 3 || index == 6 || index == 9 || index == 12)) ? (
                                                (
                                                    <>
                                                    {
                                                     isSplitAcademicFee ? (
                                                    <>
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split1} Pay
                                                    </button>
                                                {total_split2 > 0 &&
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split2} Pay
                                                    </button>}
                                                    </>
                                                    ) : (
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn' onClick={() => handlePay(item?.month)}>

                                                    {total}
                                                    Pay</button>
                                                    )
                                                   }

                                                    </>
                                                )
                                            ) : null}
                                            {actype == 'half_yearly' && ((index == 0 || index == 6)) ? (

                                                <>
                                                    {isSplitAcademicFee ? (
                                                        <>
                                                        <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split1} Pay
                                                        </button>
                                                       {
                                                        total_split2 > 0 &&
                                                        <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split2} Pay
                                                        </button>
    
                                                      }
                                                        </>
                                                    ) : (
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total} Pay
                                                    </button>
                                                    )}
                                                </>

                                            ) : null}
                                            {actype == 'annually' && (index == 0) ? (
                                                <>

                                                    {isSplitAcademicFee ? (
                                                    <>
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total_split1} Pay
                                                    </button>
                                                    {
                                                     total_split2 > 0 &&
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total_split2} Pay
                                                    </button>
    }
                                                    </>
                                                    ) : (
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total} Pay
                                                    </button>
                                                    )}

                                                </>

                                            ) : null}

                                        </div>
                                    </div>


                                </>
                            )})
                        }
                    </div>
                </div>
            </div>
        )
    }
    let canteenFeeView = () => {

        return (
            <div className='card af-fee-card mb-4'>
                <div className='card-header d-flex justify-content-between'>
                    <h6 className='card-title af-fee-card-title'>
                        <Icon icon="solar:graduation-cap-bold-duotone" className="af-fee-card-title-icon" aria-hidden />
                        Canteen Fee
                    </h6>
                    <div className='af-period-btns'>
                        {
                            typofCanteenFee === 'monthly' && (
                                <button type="button" className='btn af-period-btn me-2' onClick={() => setCantype('monthly')}>
                                    <Icon icon="solar:calendar-date-bold-duotone" className="af-period-btn-icon" aria-hidden />
                                    Monthly
                                </button>)
                        }
                        {
                            typofCanteenFee == 'monthly' || typofCanteenFee === 'quarterly' && (
                                <button type="button" className='btn af-period-btn me-2' onClick={() => setCantype('quarterly')}
                                    disabled={isSplitCanteenFee && typofCanteenFee == 'monthly' || false}
                                >
                                    <Icon icon="solar:calendar-mark-bold-duotone" className="af-period-btn-icon" aria-hidden />
                                    quarterly
                                </button>)
                        }
                        {
                            typofCanteenFee == 'monthly' || typofCanteenFee === 'quarterly' || typofCanteenFee === 'half_yearly' && (
                                <button type="button" className='btn af-period-btn me-2' onClick={() => setCantype('half_yearly')}
                                    disabled={isSplitCanteenFee && typofCanteenFee == 'monthly' || isSplitCanteenFee && typofCanteenFee == 'quarterly' || false}
                                >
                                    <Icon icon="solar:calendar-minimalistic-bold-duotone" className="af-period-btn-icon" aria-hidden />
                                    Half yearly
                                </button>)
                        }
                        <button type="button" className='btn af-period-btn me-2' onClick={() => setCantype('annually')}
                            disabled={isSplitCanteenFee && typofCanteenFee == 'monthly' || isSplitCanteenFee && typofCanteenFee == 'quarterly' || isSplitCanteenFee && typofCanteenFee == 'half_yearly' || false}
                        >
                            <Icon icon="solar:calendar-bold-duotone" className="af-period-btn-icon" aria-hidden />
                            Annually
                        </button>
                    </div>
                </div>
                <div className='card-body'>
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
                            canteenTableViewData.map((item, index) => {
                                const { total, total_split1, total_split2 } = totalvalueFun(canteenFeeData, cantype, item?.month) || {}
                                return (
                                <>
                                    <div
                                        className={`row af-fee-row af-fee-row--data${cantype === "monthly"
                                            ? " border-top"
                                            : cantype === "half_yearly" &&
                                                (index === 0 || index === 6)
                                                ? " border-top"
                                                : cantype === "quarterly" &&
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
                                            {

                                                cantype == 'monthly' && (
                                                    <>

                                                        {isSplitCanteenFee ? (
                                                            <>
                                                                <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                                    <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />

                                                                    {total_split1} Pay
                                                                </button>
                                                                {total_split2 > 0 &&
                                                                <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                                    <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />

                                                                    {total_split2} Pay
                                                                </button>
                                                                }
                                                            </>
                                                        ) : (
                                                            <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                                <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />

                                                                {total} Pay
                                                            </button>
                                                        )}
                                                    </>
                                                )
                                            }
                                            {cantype == 'quarterly' && ((index == 0 || index == 3 || index == 6 || index == 9 || index == 12)) ? (
                                                (
                                                    <>
                                                    {
                                                     isSplitCanteenFee ? (
                                                    <>
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split1} Pay
                                                    </button>
                                                    {total_split2 > 0 &&
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split2} Pay
                                                    </button>}
                                                    </>
                                                    ) : (
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn' onClick={() => handlePay(item?.month)}>

                                                    {total}
                                                    Pay</button>
                                                    )
                                                   }

                                                    </>
                                                )
                                            ) : null}
                                            {cantype == 'half_yearly' && ((index == 0 || index == 6)) ? (

                                                <>
                                                    {isSplitCanteenFee ? (
                                                        <>
                                                        <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split1} Pay
                                                        </button>
                                                        {total_split2 > 0 &&
                                                        <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                            <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                            {total_split2} Pay
                                                        </button>}
                                                        </>
                                                    ) : (
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total} Pay
                                                    </button>
                                                    )}
                                                </>

                                            ) : null}
                                            {cantype == 'annually' && (index == 0) ? (
                                                <>

                                                    {isSplitCanteenFee ? (
                                                    <>
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total_split1} Pay
                                                    </button>
                                                    {total_split2 > 0 &&
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total_split2} Pay
                                                    </button>}
                                                    </>
                                                    ) : (
                                                    <button type="button" className='btn btn-primary af-fee-pay-btn'>
                                                        <Icon icon="solar:card-send-bold-duotone" className="af-fee-pay-btn-icon" aria-hidden onClick={() => handlePay(item?.month)} />
                                                        {total} Pay
                                                    </button>
                                                    )}

                                                </>

                                            ) : null}

                                        </div>
                                    </div>


                                </>
                            )})
                        }
                    </div>
                </div>
            </div>
        )
    }

    let handleTransactionVeiw = async () => {
        let { data } = await axios.get(`${baseURL}/api/fees/allfee/registration/${11}`)
        setFeetransactionData(data?.data)
        setFeeTransactionView(false)

    }
    console.log('academicFeeData is:', academicFeeData)
    console.log('admissionFeeData is:', admissionFeeData)
    console.log('canteenFeeData is:', canteenFeeData)

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
            {feeTransactionView ? admissionFeeView() : null}
            {feeTransactionView ? academicFeeView() : null}

            {feeTransactionView ? canteenFeeView() : null}
            {!feeTransactionView ? <TransactionView /> : null}

        </div>
    )
}

export default StudentFee