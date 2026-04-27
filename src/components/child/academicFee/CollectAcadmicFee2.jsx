import React, { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/academfee.css";

const displayVal = (v) => (v == null || v === "" ? "—" : String(v));
const getRowId = (item) => item?.id ?? item?.feeHead?.id;
const parseNum = (v) => {
    const n = Number.parseFloat(String(v ?? "").replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  };
  const rowMatchesId = (row, rowId) =>
    rowId != null &&
    (row.id === rowId ||
      row.feeHead?.id === rowId ||
      String(row.id) === String(rowId));  

const formatClassOrDivision = (v) => {
    if (v == null || v === "") return "—";
    if (typeof v === "object") {
        const s = v.class_name ?? v.division_name ?? v.name;
        return s != null && s !== "" ? String(s) : "—";
    }
    return String(v);
};

const CollectAcadmicFee2 = () => {
    const [reg_no, setReg_no] = useState("");
    const [merit_reg_no, setMerit_reg_no] = useState("");
    const [student, setStudent] = useState(null);
    const [error, setError] = useState('')
    const [checkedFeeheads,setCheckedFeeheads]=useState([])
    const [checkedMonths,setCheckedMonths]=useState([])
    //fees payment section states are here
    let [academicFee, setAcademicFee] = useState(0)
    let [payableFee, setPayableFee] = useState(0)
    let [totalPaid, setTotalPaid] = useState(0)
    const [feespaidType, setFeespaidType] = useState([{ type: "consession", value: 1 }, { type: "fee payment", value: 0 }])
    const [typeoffeepayment, setTypeoffeepayment] = useState(0);
    const [consessionType, setConsessionType] = useState('')
    const [remark, setRemark] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [transactionDate, setTransactionDate] = useState('');
    const [extraAmount, setExtraAmount] = useState('');

    //fees payment section states are here ends

    const [allFeeheadspricing, setAllFeeheadspricing] = useState([]);
    
    const header = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
   

    const handleSearchStudent = async () => {
        try {
            if (merit_reg_no) {

                let response = await axios.get(`${baseURL}/api/personal-information/reg_no/${merit_reg_no}`)
                let response2 = await axios.get(`${baseURL}/api/fee-groups/student/${merit_reg_no}/assigned-fees`)
                let allFeeheadspricing = response2?.data?.data
                allFeeheadspricing=allFeeheadspricing.map((elem)=>{
                    return{
                        ...elem,
                        apr_paid:+elem?.apr_total-elem?.apr_total_paid,
                        may_paid:+elem?.may_total-elem?.may_total_paid,
                        jun_paid:+elem?.jun_total-elem?.jun_total_paid,
                        jul_paid:+elem?.jul_total-elem?.jul_total_paid,
                        aug_paid:+elem?.aug_total-elem?.aug_total_paid,
                        sep_paid:+elem?.sep_total-elem?.sep_total_paid,
                        oct_paid:+elem?.oct_total-elem?.oct_total_paid,
                        nov_paid:+elem?.nov_total-elem?.nov_total_paid,
                        dec_paid:+elem?.dec_total-elem?.dec_total_paid,
                        jan_paid:+elem?.jan_total-elem?.jan_total_paid,
                        feb_paid:+elem?.feb_total-elem?.feb_total_paid,
                        mar_paid:+elem?.mar_total-elem?.mar_total_paid
                    }
                })
                let student = response?.data?.data
                setStudent({

                    class: student?.class,
                    division: student?.division,
                    roll_no: student?.roll_no,
                    gr_no: student?.gr_no,
                    email: student?.email,
                    contact_number: student?.contact_number,
                })
                setAllFeeheadspricing(allFeeheadspricing)

                let  academicdata=allFeeheadspricing.reduce((acc,item)=>{
                    return acc+Number(item.apr_total)+Number(item.may_total)+Number(item.jun_total)+Number(item.jul_total)+
                    Number(item.aug_total)+Number(item.sep_total)+Number(item.oct_total)+Number(item.nov_total)+Number(item.dec_total)+
                    Number(item.jan_total)+Number(item.feb_total)+Number(item.mar_total)
         
                 },0)
                 setAcademicFee(academicdata)
                 setPayableFee(academicdata)
            }
            else if (reg_no) {
                let response = await axios.get(`${baseURL}/api/parmanent-personal-information/reg/${reg_no}`)
                let student = response?.data?.data
                setStudent({
                    ...student,
                    class: student?.class,
                    division: student?.division,
                    roll_no: student?.roll_no,
                    email: student?.email,
                    contact_number: student?.contact_number,
                })
            }
        }
        catch (error) {
            console.log('error is:', error?.response?.data?.message)
            setError(error?.response?.data?.message)
        }

    }

    const handlePayAndPrint = async () => {
   
        
    
      }
    
      const handlePayNow = async () => {
        let filteredstudentfees=allFeeheadspricing.filter((elem)=>checkedFeeheads.includes(String(elem.id)))
        console.log('filteredstudentfees',filteredstudentfees)
       
    
      }
      
   // console.log('reg_no', reg_no)
   // console.log('merit_reg_no', merit_reg_no)
   // console.log('student', student)
   // console.log('allFeeheadspricing', allFeeheadspricing)
   // console.log('checkedmonths',checkedMonths)
   console.log('checkedfeeheads',checkedFeeheads)
   // console.log('academic fee is:',academicFee)
  //console.log('payable fee is:',payableFee)

    const handleMonthCheckboxChange = (month) => {
        setCheckedMonths((prev) =>
            prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
        );
    };

    const handleAllMonthsCheckboxChange = () => {
        setCheckedMonths((prev) => (prev.length === header.length ? [] : [...header]));
    };

    const handleFeeheadCheckboxChange = (rowId) => {
        const id = rowId == null ? null : String(rowId);
        if (id == null) return;
        setCheckedFeeheads((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleAllFeeheadsCheckboxChange = () => {
        const allIds = allFeeheadspricing
            .map((r) => getRowId(r))
            .filter((v) => v != null)
            .map((v) => String(v));
        const uniqueIds = Array.from(new Set(allIds));

        setCheckedFeeheads((prev) =>
            prev.length === uniqueIds.length ? [] : uniqueIds
        );
    };

    const studentDetailRows = student
        ? [
            { label: "Reg. no.", value: displayVal(student.reg_no) },
            { label: "Class", value: formatClassOrDivision(student.class) },
            { label: "Division", value: formatClassOrDivision(student.division) },
            { label: "Roll no.", value: displayVal(student.roll_no) },
            { label: "GR no.", value: displayVal(student.gr_no) },
            { label: "Email", value: displayVal(student.email) },
            { label: "Contact", value: displayVal(student.contact_number) },
        ]
        : [];

        
        
          const handlePaidChange = (e, rowId) => {
           
           
            const name = e.target.name;
            const num = e.target.value === "" ? 0 : parseNum(e.target.value);
            setAllFeeheadspricing((prev) =>
              prev.map((row) => {
                if (!rowMatchesId(row, rowId)) return row;
                const next = { ...row, [name]: num };
                const m = name.match(
                  /^(apr|may|jun|jul|aug|sep|oct|nov|dec|jan|feb|mar)_paid$/
                );
                if (m) {
                  const p = m[1];
                  next[`${p}_due`] =
                    parseNum(next[`${p}_total`]) - parseNum(next[`${p}_paid`]);
                 
                }
                return next;
              })
            );
          };
        
          
    return (
        <div className="container">
            <section className='card'>
                <div className='card-header'>
                    <h5 className='card-title'>Search Student</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label small text-secondary mb-1">
                                Search from merit list
                            </label>
                            <input
                                type="text"
                                value={merit_reg_no}
                                onChange={(e) => setMerit_reg_no(e.target.value)}
                                className="form-control form-control-sm"
                                placeholder="Merit list no. / rank…"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small text-secondary mb-1">
                                Search from reg no
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                value={reg_no}
                                onChange={(e) => setReg_no(e.target.value)}
                                placeholder="Registration number…"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small text-secondary mb-1">
                                Search from student
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Student name…"
                            />
                        </div>
                        <div className="col-md-3">
                            <button
                                type="button"
                                className="btn btn-primary btn-sm px-4"
                                onClick={handleSearchStudent}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {error && <div className='alert alert-danger'>{error}</div>}

            {student && <section className="card">
                <div className="card-header">
                    <h5 className="card-title">Student Details</h5>
                </div>
                <div className="card-body af-student-details">
                    <div className="row g-2 row-cols-1 row-cols-sm-2 row-cols-lg-3">
                        {studentDetailRows.map(({ label, value }) => (
                            <div key={label} className="col">
                                <div className="d-flex align-items-baseline gap-2 text-break af-student-details__row">
                                    <span className="af-student-details__label flex-shrink-0">
                                        {label}:
                                    </span>
                                    <span className="af-student-details__value">{value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </section>}

            {allFeeheadspricing.length > 0 && (
                <section className="card mt-3">
                    <div className="card-header border-0 py-3"
                        style={{
                            backgroundColor: "#d6eaff",
                            borderBottom: "1px solid rgba(13, 110, 253, 0.18)",
                        }}>
                        <h6>Collect Fee</h6>



                    </div>

                    <div className="card-body">

                        <div className="table-responsive">
                            <table
                                className="table table-bordered align-middle mb-0 text-wrap"
                                style={{ minWidth: "980px", tableLayout: "auto" }}
                            >
                                <thead>
                                    <tr>
                                        <th
                                            className="small py-2 px-2"
                                            style={{
                                                minWidth: "6.5rem",
                                                maxWidth: "8rem",
                                                whiteSpace: "normal",
                                                backgroundColor: "#d8f0e0",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                <span>Fee Head</span>
                                                <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
                                                    <label
                                                        className="af-month-th__label"
                                                        htmlFor="af-month-all"
                                                        style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", margin: 0 }}
                                                    >
                                                        <input
                                                            id="af-month-all"
                                                            className="form-check-input af-month-th__checkbox"
                                                            type="checkbox"
                                                            checked={checkedMonths.length === header.length && header.length > 0}
                                                            onChange={handleAllMonthsCheckboxChange}
                                                        />
                                                        M
                                                    </label>
                                                    <label
                                                        className="af-month-th__label"
                                                        htmlFor="af-feehead-all"
                                                        style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", margin: 0 }}
                                                    >
                                                        <input
                                                            id="af-feehead-all"
                                                            className="form-check-input af-month-th__checkbox"
                                                            type="checkbox"
                                                            checked={
                                                                checkedFeeheads.length ===
                                                                    Array.from(
                                                                        new Set(
                                                                            allFeeheadspricing
                                                                                .map((r) => getRowId(r))
                                                                                .filter((v) => v != null)
                                                                                .map((v) => String(v))
                                                                        )
                                                                    ).length &&
                                                                allFeeheadspricing.length > 0
                                                            }
                                                            onChange={handleAllFeeheadsCheckboxChange}
                                                        />
                                                        H
                                                    </label>
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            className="small py-2 px-2"
                                            style={{
                                                minWidth: "4.5rem",
                                                maxWidth: "5.5rem",
                                                whiteSpace: "normal",
                                                backgroundColor: "#d8f0e0",
                                            }}
                                        >
                                            Label
                                        </th>
                                        {header.map((item) => (
                                            <th
                                                key={item}
                                                className="small py-2 px-1 text-center"
                                                style={{
                                                    minWidth: "3rem",
                                                    maxWidth: "3.75rem",
                                                    whiteSpace: "normal",
                                                    backgroundColor: "#d8f0e0",
                                                }}
                                            >
                                                <div className="af-month-th">
                                                    <input
                                                        id={`af-month-${item}`}
                                                        className="form-check-input af-month-th__checkbox"
                                                        type="checkbox"
                                                        checked={checkedMonths.includes(item)}
                                                        onChange={() => handleMonthCheckboxChange(item)}
                                                    />
                                                    <label className="af-month-th__label" htmlFor={`af-month-${item}`}>
                                                        {item}
                                                    </label>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>

                                    {allFeeheadspricing.map((item) => (
                                        <tr key={getRowId(item)}>
                                            <td className="fw-bold align-top text-break" style={{ minWidth: "6.5rem", maxWidth: "8rem", whiteSpace: "normal" }}>
                                                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={checkedFeeheads.includes(String(getRowId(item)))}
                                                        onChange={() => handleFeeheadCheckboxChange(getRowId(item))}
                                                    />
                                                    <span>{item?.fee_head_name}</span>
                                                </div>
                                            </td>
                                            <td className="semi-bold align-top text-break" style={{ minWidth: "4.5rem", maxWidth: "5.5rem", whiteSpace: "normal" }}>
                                                Total-<br /><br />
                                                Paid-<br />
                                                Due-<br />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="apr_total" value={(+item?.apr_total || 0) - (+item?.apr_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="apr_paid" placeholder={(+item?.apr_total || 0) - (+item?.apr_total_paid || 0)} value={item?.apr_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="apr_due" value={(+item?.apr_total || 0) - (+item?.apr_total_paid || 0) - (+item?.apr_paid || 0)} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="may_total" value={(+item?.may_total || 0) - (+item?.may_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="may_paid" placeholder={(+item?.may_total || 0) - (+item?.may_total_paid || 0)} value={item?.may_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="may_due" value={(+item?.may_total || 0) - (+item?.may_total_paid || 0) - (+item?.may_paid || 0)} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="jun_total" value={(+item?.jun_total || 0) - (+item?.jun_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jun_paid" placeholder={(+item?.jun_total || 0) - (+item?.jun_total_paid || 0)} value={item?.jun_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jun_due" value={(+item?.jun_total || 0) - (+item?.jun_total_paid || 0) - (+item?.jun_paid || 0)} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="jul_total" value={(+item?.jul_total || 0) - (+item?.jul_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jul_paid" placeholder={(+item?.jul_total || 0) - (+item?.jul_total_paid || 0)} value={item?.jul_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jul_due" value={(+item?.jul_total || 0) - (+item?.jul_total_paid || 0) - (+item?.jul_paid || 0)} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="aug_total" value={(+item?.aug_total || 0) - (+item?.aug_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="aug_paid" placeholder={(+item?.aug_total || 0) - (+item?.aug_total_paid || 0)} value={item?.aug_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="aug_due" value={(+item?.aug_total || 0) - (+item?.aug_total_paid || 0) - (+item?.aug_paid || 0)} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="sep_total" value={(+item?.sep_total || 0) - (+item?.sep_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="sep_paid" placeholder={(+item?.sep_total || 0) - (+item?.sep_total_paid || 0)} value={item?.sep_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="sep_due" value={(+item?.sep_total || 0) - (+item?.sep_total_paid || 0) - (+item?.sep_paid || 0)} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="oct_total" value={(+item?.oct_total || 0) - (+item?.oct_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="oct_paid" placeholder={(+item?.oct_total || 0) - (+item?.oct_total_paid || 0)} value={item?.oct_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="oct_due" value={(+item?.oct_total || 0) - (+item?.oct_total_paid || 0) - (+item?.oct_paid || 0)} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="nov_total" value={(+item?.nov_total || 0) - (+item?.nov_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="nov_paid" placeholder={(+item?.nov_total || 0) - (+item?.nov_total_paid || 0)} value={item?.nov_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="nov_due" value={(+item?.nov_total || 0) - (+item?.nov_total_paid || 0) - (+item?.nov_paid || 0)} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="dec_total" value={(+item?.dec_total || 0) - (+item?.dec_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="dec_paid" placeholder={(+item?.dec_total || 0) - (+item?.dec_total_paid || 0)} value={item?.dec_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="dec_due" value={(+item?.dec_total || 0) - (+item?.dec_total_paid || 0) - (+item?.dec_paid || 0)} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="jan_total" value={(+item?.jan_total || 0) - (+item?.jan_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jan_paid" placeholder={(+item?.jan_total || 0) - (+item?.jan_total_paid || 0)} value={item?.jan_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jan_due" value={(+item?.jan_total || 0) - (+item?.jan_total_paid || 0) - (+item?.jan_paid || 0)} disabled />

                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="feb_total" value={(+item?.feb_total || 0) - (+item?.feb_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="feb_paid" placeholder={(+item?.feb_total || 0) - (+item?.feb_total_paid || 0)} value={item?.feb_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="feb_due" value={(+item?.feb_total || 0) - (+item?.feb_total_paid || 0) - (+item?.feb_paid || 0)} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="mar_total" value={(+item?.mar_total || 0) - (+item?.mar_total_paid || 0)} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="mar_paid" placeholder={(+item?.mar_total || 0) - (+item?.mar_total_paid || 0)} value={item?.mar_paid ?? ""} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="mar_due" value={(+item?.mar_total || 0) - (+item?.mar_total_paid || 0) - (+item?.mar_paid || 0)} disabled />
                                            </td>



                                        </tr>
                                    ))}
                                </tbody>

                            </table>


                        </div>




                    </div>
                </section>
            )}

            
      {student && <section className="card mt-3">
        <div className='card-header py-3'>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <h6 className="mb-0">Payment Information</h6>
            <div className="d-flex flex-wrap align-items-center justify-content-end gap-3 ms-auto">
              {feespaidType.map((item) => (
                <div key={item.type} className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input mt-4 me-2"
                    type="radio"
                    name="typeoffeepayment"
                    id={item.type}
                    value={item.value}
                    checked={typeoffeepayment === item.value}   // ✅ important
                    onChange={(e) => setTypeoffeepayment(Number(e.target.value))} // ✅ important
                  />
                  <label className="form-check-label" htmlFor={item.type}>
                    {item.type}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='card-body'>
          <div className='row g-3'>

            <div className='col-md-3'>
              <label className='form-label'>Fine</label>
              <input className='form-control' placeholder='fine'  />
            </div>
            <div className='col-md-3'>
              <label className='form-label'>Consession Type</label>
              <select className='form-select' value={consessionType} onChange={(e) => setConsessionType(e.target.value)}>
                <option value=''>—</option>
                <option value='1'>SVP</option>
                <option value='2'>Concession</option>
                <option value='3'>Freeship</option>
              </select>

            </div>
            <div className='col-md-3'>
              <label className='form-label'>Consession</label>
              <input className='form-control' placeholder='0'  />
            </div>

            <div className='col-md-3'>
              <label className='form-label'>Academic Fee</label>
              <input className='form-control' placeholder='0' value={academicFee} onChange={(e) => setAcademicFee(e.target.value === "" ? 0 : parseNum(e.target.value))} />
            </div>
            <div className='col-md-3'>
              <label className='form-label'>Payable Fee</label>
              <input className='form-control' placeholder='0' value={payableFee} onChange={(e) => setPayableFee(e.target.value === "" ? 0 : parseNum(e.target.value))} />
            </div>
            <div className='col-md-3'>
              <label className='form-label'>Fees plus fine</label>
              <input className='form-control' placeholder='0'  />
            </div>
            <div className='col-md-3'>
              <label className='form-label'>Balance</label>
              <input className='form-control' placeholder='0' value={payableFee} onChange={(e) => setBalance(e.target.value === "" ? 0 : parseNum(e.target.value))} />
            </div>
            <div className='col-md-3'>
              <label className='form-label'>Remark</label>
              <textarea className='form-control' placeholder='enter remark' value={remark} onChange={(e) => setRemark(e.target.value)} />
            </div>
            <div className='col-md-3'>
              <label className='form-label'>Payment Mode</label>
              <select className='form-select' value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                <option value=''>—</option>
                <option value='Cash'>Cash</option>
                <option value='Card'>Card</option>
                <option value='UPI'>UPI</option>
              </select>
            </div>
            <div className='col-md-3'>
              <label className='form-label'>Transaction Date</label>
              <input type='date' className='form-control' value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
            </div>
            <div className='col-md-3'>
              <label className='form-label'>Extra Amount</label>
              <input type='number' className='form-control' placeholder='0' value={extraAmount} onChange={(e) => setExtraAmount(e.target.value)} />
            </div>



            <div className='col-12 d-flex justify-content-end gap-2 mt-2'>
              <button type='button' className='btn btn-primary' onClick={handlePayAndPrint}>pay and print</button>
              <button type='button' className='btn btn-primary' onClick={handlePayNow}>pay now</button>
            </div>
          </div>
        </div>
      </section>}


        </div>
    )

}
export default CollectAcadmicFee2;