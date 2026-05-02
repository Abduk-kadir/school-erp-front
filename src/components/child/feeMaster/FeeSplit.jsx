import React, { useState } from "react";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/academfee.css";

const displayVal = (v) => (v == null || v === "" ? "—" : String(v));
const getRowId = (item) => item?.id ?? item?.feeHead?.id;
const parseNum = (v) => {
    const n = Number.parseFloat(String(v ?? "").replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
};
/** Due row: coerce operands to numbers before subtracting (API may return strings). */
const monthSplitDisplayTotal = (item, month) =>
    (item?.[`split_${month}_total`]
        ? parseNum(item[`split_${month}_total`])
        : parseNum(item[`${month}_total`])) - parseNum(item[`${month}_split1`]);
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

const FeeSplit = () => {
    const [reg_no, setReg_no] = useState("");
    const [merit_reg_no, setMerit_reg_no] = useState("");
    const [student, setStudent] = useState(null);
    const [error, setError] = useState('')
    const [checkedFeeheads, setCheckedFeeheads] = useState([])
    const [checkedMonths, setCheckedMonths] = useState([])
    const [remark, setRemark] = useState("");
    //fees payment section states are here


    //fees payment section states are here ends

    const [allFeeheadspricing, setAllFeeheadspricing] = useState([]);

    const header = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]

    const selectAllMonthsAndFeeheads = (rows) => {
        const list = Array.isArray(rows) ? rows : [];
        setCheckedMonths([...header]);
        const allIds = Array.from(
            new Set(
                list
                    .map((r) => getRowId(r))
                    .filter((v) => v != null)
                    .map((v) => String(v))
            )
        );
        setCheckedFeeheads(allIds);
    };

    const handleSearchStudent = async () => {
        try {
            if (merit_reg_no) {

                let response = await axios.get(`${baseURL}/api/personal-information/reg_no/${merit_reg_no}`)
                let response2 = await axios.get(`${baseURL}/api/fee-groups/student/${merit_reg_no}/assigned-fees`)
                let allFeeheadspricing = response2?.data?.data
                allFeeheadspricing = allFeeheadspricing.map((elem) => {
                    return {
                        ...elem,
                        apr_paid: +elem?.apr_total - elem?.apr_total_paid,
                        may_paid: +elem?.may_total - elem?.may_total_paid,
                        jun_paid: +elem?.jun_total - elem?.jun_total_paid,
                        jul_paid: +elem?.jul_total - elem?.jul_total_paid,
                        aug_paid: +elem?.aug_total - elem?.aug_total_paid,
                        sep_paid: +elem?.sep_total - elem?.sep_total_paid,
                        oct_paid: +elem?.oct_total - elem?.oct_total_paid,
                        nov_paid: +elem?.nov_total - elem?.nov_total_paid,
                        dec_paid: +elem?.dec_total - elem?.dec_total_paid,
                        jan_paid: +elem?.jan_total - elem?.jan_total_paid,
                        feb_paid: +elem?.feb_total - elem?.feb_total_paid,
                        mar_paid: +elem?.mar_total - elem?.mar_total_paid
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
                selectAllMonthsAndFeeheads(allFeeheadspricing)

            }
            else if (reg_no) {
                let response = await axios.get(`${baseURL}/api/parmanent-personal-information/reg/${reg_no}`)
                let response2 = await axios.get(`${baseURL}/api/student-fee-installment-splits/${reg_no}`)

                let allFeeheadspricing = response2?.data?.data


                allFeeheadspricing = allFeeheadspricing.map((elem) => {
                    return {
                        ...elem,
                        split_apr_total: +elem?.split_apr_total - elem?.apr_split1,
                        split_may_total: +elem?.split_may_total - elem?.may_split1,
                        split_jun_total: +elem?.split_jun_total - elem?.jun_split1,
                        split_jul_total: +elem?.split_jul_total - elem?.jul_split1,
                        split_aug_total: +elem?.split_aug_total - elem?.aug_split1,
                        split_sep_total: +elem?.split_sep_total - elem?.sep_split1,
                        split_oct_total: +elem?.split_oct_total - elem?.oct_split1,
                        split_nov_total: +elem?.split_nov_total - elem?.nov_split1,
                        split_dec_total: +elem?.split_dec_total - elem?.dec_split1,
                        split_jan_total: +elem?.split_jan_total - elem?.jan_split1,
                        split_feb_total: +elem?.split_feb_total - elem?.feb_split1,
                        split_mar_total: +elem?.split_mar_total - elem?.mar_split1,
                        
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
                selectAllMonthsAndFeeheads(allFeeheadspricing)




            }
        }
        catch (error) {
            console.log('error is:', error?.response?.data?.message)
            setError(error?.response?.data?.message)
        }

    }



    const handleSplit = async () => {
        let common_reg_no = merit_reg_no || reg_no
        try {
            let filteredstudentfees = allFeeheadspricing.filter((elem) => checkedFeeheads.includes(String(elem.id)))
           

           filteredstudentfees=filteredstudentfees.map((elem)=>{
            return {
               student_installment_id:elem.id,
               remark:remark,
               apr_total:elem.split_apr_total,
               apr_split1:elem.apr_split1,
               apr_split2:elem.apr_split2,
               may_total:elem.split_may_total,
               may_split1:elem.may_split1,
               may_split2:elem.may_split2,
               jun_total:elem.split_jun_total,
               jun_split1:elem.jun_split1,
               jun_split2:elem.jun_split2,
               jul_total:elem.split_jul_total,
               jul_split1:elem.jul_split1,
               jul_split2:elem.jul_split2,
               aug_total:elem.split_aug_total,
               aug_split1:elem.aug_split1,
               aug_split2:elem.aug_split2,
               sep_total:elem.split_sep_total,
               sep_split1:elem.sep_split1,
               sep_split2:elem.sep_split2,
               oct_total:elem.split_oct_total,
               oct_split1:elem.oct_split1,
               oct_split2:elem.oct_split2,
               nov_total:elem.split_nov_total,
               nov_split1:elem.nov_split1,
               nov_split2:elem.nov_split2,
               dec_total:elem.split_dec_total,
               dec_split1:elem.dec_split1,
               dec_split2:elem.dec_split2,
               jan_total:elem.split_jan_total,
               jan_split1:elem.jan_split1,
               jan_split2:elem.jan_split2,
               feb_total:elem.split_feb_total,
               feb_split1:elem.feb_split1,
               feb_split2:elem.feb_split2,
               mar_total:elem.split_mar_total,
               mar_split1:elem.mar_split1,
               mar_split2:elem.mar_split2,

            }
           })
        if(!remark){
            alert('please enter remark')
            return
        }

        let response=await axios.post(`${baseURL}/api/student-fee-installment-splits`,[...filteredstudentfees])
        alert('fee split is saved successfully')





        }
        catch (error) {
            console.log('error is:', error)
            alert('error is:', error?.response?.data?.message)
        }


    }


    console.log('checkedfeeheads', checkedFeeheads)
    console.log('checkedmonths', checkedMonths)



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
                const s = name.match(
                    /^(apr|may|jun|jul|aug|sep|oct|nov|dec|jan|feb|mar)_split1$/
                );
                if (s) {
                    const p = s[1];
                    const base = next?.[`split_${p}_total`]
                        ? parseNum(next[`split_${p}_total`])
                        : parseNum(next[`${p}_total`]);
                    next[`${p}_total`] = base;
                    next[`split_${p}_total`] = base;
                    next[`${p}_split2`] = base - parseNum(next[`${p}_split1`]);
                }
                return next;
            })
        );
    };

    const handleRemarkChange = (e) => setRemark(e.target.value);


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
                        <h6>Split Student Fee</h6>



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
                                                Split1-<br />
                                                Split2-<br />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_apr_total" value={(item?.split_apr_total ? parseNum(item.split_apr_total) : parseNum(item.apr_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="apr_split1" value={item?.apr_split1?item?.apr_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="apr_split2" value={item?.apr_split1 ? monthSplitDisplayTotal(item, "apr") : 0} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_may_total" value={(item?.split_may_total ? parseNum(item.split_may_total) : parseNum(item.may_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="may_split1" value={item?.may_split1?item?.may_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="may_split2" value={item?.may_split1 ? monthSplitDisplayTotal(item, "may") : 0} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_jun_total" value={(item?.split_jun_total ? parseNum(item.split_jun_total) : parseNum(item.jun_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jun_split1" value={item?.jun_split1?item?.jun_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jun_split2" value={item?.jun_split1 ? monthSplitDisplayTotal(item, "jun") : 0} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_jul_total" value={(item?.split_jul_total ? parseNum(item.split_jul_total) : parseNum(item.jul_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jul_split1" value={item?.jul_split1?item?.jul_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jul_split2" value={item?.jul_split1 ? monthSplitDisplayTotal(item, "jul") : 0} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_aug_total" value={(item?.split_aug_total ? parseNum(item.split_aug_total) : parseNum(item.aug_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="aug_split1" value={item?.aug_split1?item?.aug_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="aug_split2" value={item?.aug_split1 ? monthSplitDisplayTotal(item, "aug") : 0} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_sep_total" value={(item?.split_sep_total ? parseNum(item.split_sep_total) : parseNum(item.sep_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="sep_split1" value={item?.sep_split1?item?.sep_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="sep_split2" value={item?.sep_split1 ? monthSplitDisplayTotal(item, "sep") : 0} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_oct_total" value={(item?.split_oct_total ? parseNum(item.split_oct_total) : parseNum(item.oct_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="oct_split1" value={item?.oct_split1?item?.oct_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="oct_split2" value={item?.oct_split1 ? monthSplitDisplayTotal(item, "oct") : 0} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_nov_total" value={(item?.split_nov_total ? parseNum(item.split_nov_total) : parseNum(item.nov_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="nov_split1" value={item?.nov_split1?item?.nov_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="nov_split2" value={item?.nov_split1 ? monthSplitDisplayTotal(item, "nov") : 0} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_dec_total" value={(item?.split_dec_total ? parseNum(item.split_dec_total) : parseNum(item.dec_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="dec_split1" value={item?.dec_split1?item?.dec_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="dec_split2" value={item?.dec_split1 ? monthSplitDisplayTotal(item, "dec") : 0} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_jan_total" value={(item?.split_jan_total ? parseNum(item.split_jan_total) : parseNum(item.jan_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jan_split1" value={item?.jan_split1?item?.jan_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="jan_split2" value={item?.jan_split1 ? monthSplitDisplayTotal(item, "jan") : 0} disabled />

                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_feb_total" value={(item?.split_feb_total ? parseNum(item.split_feb_total) : parseNum(item.feb_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="feb_split1" value={item?.feb_split1?item?.feb_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="feb_split2" value={item?.feb_split1 ? monthSplitDisplayTotal(item, "feb") : 0} disabled />
                                            </td>
                                            <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                                                <input className="form-control form-control-sm mb-1 w-100" name="split_mar_total" value={(item?.split_mar_total ? parseNum(item.split_mar_total) : parseNum(item.mar_total))} disabled />
                                                <input className="form-control form-control-sm mb-1 w-100" name="mar_split1" value={item?.mar_split1?item?.mar_split1:0} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                                                <input className="form-control form-control-sm mb-1 w-100" name="mar_split2" value={item?.mar_split1 ? monthSplitDisplayTotal(item, "mar") : 0} disabled />
                                            </td>



                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                            
                        </div>




                    </div>
                </section>
            )}

            
{
               student  && (
                <section className="card mt-3">
                    <div className="card-header">
                        <h6>Detail Split Information</h6>
                    </div>
                    <div className="card-body">
                        <div className="d-flex align-items-start gap-2">
                            <textarea
                                className="form-control form-control-sm"
                                placeholder="Enter remark"
                                value={remark}
                                onChange={handleRemarkChange}
                                rows={4}
                                style={{ resize: "vertical", width: "50%" }}
                            />
                            <button className='btn btn-primary btn-sm flex-shrink-0' onClick={handleSplit}>Split Fee</button>
                        </div>
                    </div>
                </section>
            )}




        </div>
    )

}
export default FeeSplit;