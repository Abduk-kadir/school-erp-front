import React, { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "../../../utils/baseUrl";
import "../../../assets/css/academicOfflineFeeReport.css";

const displayVal = (v) => (v == null || v === "" ? "—" : String(v));

const parseNum = (v) => {
  const n = Number.parseFloat(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const getRowId = (item) => item?.id ?? item?.feeHead?.id;

const rowMatchesId = (row, rowId) =>
  rowId != null &&
  (row.id === rowId ||
    row.feeHead?.id === rowId ||
    String(row.id) === String(rowId));

const CollectAcademicFee = () => {
  const [reg_no, setReg_no] = useState("");
  const [merit_reg_no,setMerit_reg_no]=useState("");
  const [student, setStudent] = useState(null);
  const [allFeeheadspricing, setAllFeeheadspricing] = useState([]);
  const header = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"]
  const [fine, setFine] = useState(0);
  const [consessionType, setConsessionType] = useState('')
  const [typeoffeepayment, setTypeoffeepayment] = useState(0);

  const [academicFee, setAcademicFee] = useState(0);
  const [payableFee, setPayableFee] = useState(0);
  const [remark, setRemark] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [extraAmount, setExtraAmount] = useState('');
  const [feespaidType, setFeespaidType] = useState([{ type: "consession", value: 1 }, { type: "fee payment", value: 0 }])

  let totalpaidfee = allFeeheadspricing.reduce((acc, item) => {
    return acc + item.apr_new_paid + item.may_new_paid + item.jun_new_paid + item.jul_new_paid + item.aug_new_paid + item.sep_new_paid + item.oct_new_paid + item.nov_new_paid + item.dec_new_paid + item.jan_new_paid + item.feb_new_paid + item.mar_new_paid
  }, 0)
  console.log('totalpaidfee', totalpaidfee)


  const handleSearchStudent = async () => {
    const [feeRecordMonthlyPromise, feeGroupDetailPricesPromise] =
      await Promise.allSettled([
        axios.get(`${baseURL}/api/fee-record-monthly/reg_no/${reg_no}`),
        axios.get(
          `${baseURL}/api/fee-groups/student/${reg_no}/assigned-fees`
        ),
      ]);

    if (feeRecordMonthlyPromise.status === "fulfilled") {


      setStudent(feeRecordMonthlyPromise.value?.data?.data?.fee_records[0]?.student)
      let priceList = feeRecordMonthlyPromise.value?.data?.data?.fee_records
      let newpriceList = priceList.map((item) => {
        return (
          {
            ...item,

            apr_new_paid: 0,
            may_new_paid: 0,
            jun_new_paid: 0,
            jul_new_paid: 0,
            aug_new_paid: 0,
            sep_new_paid: 0,
            oct_new_paid: 0,
            nov_new_paid: 0,
            dec_new_paid: 0,
            jan_new_paid: 0,
            feb_new_paid: 0,
            mar_new_paid: 0

          }
        )
      })
      setAllFeeheadspricing(newpriceList);
      let { data } = await axios.get(`${baseURL}/api/fees/registration/${reg_no}`)
      setAcademicFee(data?.data?.total)
      setPayableFee(data?.data?.balance)
    } else {
      if (feeGroupDetailPricesPromise.status === "fulfilled") {
        const { data } = feeGroupDetailPricesPromise.value;
        setStudent(data?.data?.student ?? null);

        const priceList = data?.data?.feeGroupDetailPrices;
        const finalData = (Array.isArray(priceList) ? priceList : []).map(
          (elem) => {
            const row = {
              ...elem,
              apr_paid: 0,
              apr_new_paid: 0,
              apr_due: 0,
              may_paid: 0,
              may_new_paid: 0,
              may_due: 0,
              jun_paid: 0,
              jun_new_paid: 0,
              jun_due: 0,
              jul_paid: 0,
              jul_new_paid: 0,
              jul_due: 0,
              aug_paid: 0,
              aug_new_paid: 0,
              aug_due: 0,
              sep_paid: 0,
              sep_new_paid: 0,
              sep_due: 0,
              oct_paid: 0,
              oct_new_paid: 0,
              oct_due: 0,
              nov_paid: 0,
              nov_new_paid: 0,
              nov_due: 0,
              dec_paid: 0,
              dec_new_paid: 0,
              dec_due: 0,
              jan_paid: 0,
              jan_new_paid: 0,
              jan_due: 0,
              feb_paid: 0,
              feb_new_paid: 0,
              feb_due: 0,
              mar_paid: 0,
              mar_new_paid: 0,
              mar_due: 0,
              apr_new_paid: 0,
              may_new_paid: 0,
              jun_new_paid: 0,
              jul_new_paid: 0,
              aug_new_paid: 0,
              sep_new_paid: 0,
              oct_new_paid: 0,
              nov_new_paid: 0,
              dec_new_paid: 0,
              jan_new_paid: 0,
              feb_new_paid: 0,
              mar_new_paid: 0
            };

            return row;
          }
        );
        setAllFeeheadspricing(finalData);

        let  academicdata=priceList.reduce((acc,item)=>{
           return acc+Number(item.apr_total)+Number(item.may_total)+Number(item.jun_total)+Number(item.jul_total)+
           Number(item.aug_total)+Number(item.sep_total)+Number(item.oct_total)+Number(item.nov_total)+Number(item.dec_total)+
           Number(item.jan_total)+Number(item.feb_total)+Number(item.mar_total)

        },0)
        setAcademicFee(academicdata)
        setPayableFee(academicdata)
      }
    }
  };

  const handleTotalChange = (e, rowId) => {
    const name = e.target.name;
    const num = e.target.value === "" ? 0 : parseNum(e.target.value);
    setAllFeeheadspricing((prev) =>
      prev.map((row) => {
        if (!rowMatchesId(row, rowId)) return row;
        const next = { ...row, [name]: num };
        const m = name.match(
          /^(apr|may|jun|jul|aug|sep|oct|nov|dec|jan|feb|mar)_total$/
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
          next[`${p}_new_paid`] = num;
        }
        return next;
      })
    );
  };

  const handleDueChange = (e, rowId) => {
    const name = e.target.name;
    const num = e.target.value === "" ? 0 : parseNum(e.target.value);
    setAllFeeheadspricing((prev) =>
      prev.map((row) => {
        if (!rowMatchesId(row, rowId)) return row;
        return { ...row, [name]: num };
      })
    );
  };

  console.log("student", student);
  console.log("allFeeheadspricing", allFeeheadspricing);

  const fullName = student
    ? [student.first_name, student.last_name].filter(Boolean).join(" ").trim()
    : "";

  const studentPhotoSrc =
    student &&
    (student.photo_url ||
      student.photo ||
      student.profile_image ||
      student.image);

  const detailItems = student
    ? [
      { label: "Reg. no.", value: student.reg_no },
      { label: "Student name", value: fullName || "—" },
      { label: "Class", value: student.class },
      { label: "Division", value: student.division },
      { label: "Fee group", value: student.feegroupid },
    ]
    : [];

  const handlePayNow = async () => {
    console.log('pay now is calling')
    try {
      const paymentDateOnly =
        transactionDate && String(transactionDate).length >= 10
          ? String(transactionDate).slice(0, 10)
          : transactionDate;
      let collectfeevalue = {
        reg_no, total: academicFee,payment: typeoffeepayment==0?totalpaidfee:0, total_paid: academicFee - payableFee + totalpaidfee,
        balance: payableFee - totalpaidfee, remark: remark, payment_mode: paymentMode, date: paymentDateOnly, consessionamount:typeoffeepayment==1?totalpaidfee:0, consession: typeoffeepayment
      }
      console.log('collect fee value is:',collectfeevalue)
      let { data } = await axios.post(`${baseURL}/api/fees`, collectfeevalue)
      let id = data?.data?.id
      console.log('id is:', id)

      console.log('all fee head pricing is:', allFeeheadspricing)
      let records = allFeeheadspricing.map((item) => {
        return {
          reg_no:reg_no,
          feeheadid: item.feeheadid,
          fee_table_id: id,
          date: paymentDateOnly,
          apr_total: item.apr_total,
          apr_paid: item.apr_paid,
          apr_due: item.apr_due,

          may_total: item.may_total,
          may_paid: item.may_paid,
          may_due: item.may_due,

          jun_total: item.jun_total,
          jun_paid: item.jun_paid,
          jun_due: item.jun_due,

          jul_total: item.jul_total,
          jul_paid: item.jul_paid,
          jul_due: item.jul_due,

          aug_total: item.aug_total,
          aug_paid: item.aug_paid,
          aug_due: item.aug_due,

          sep_total: item.sep_total,
          sep_paid: item.sep_paid,
          sep_due: item.sep_due,

          oct_total: item.oct_total,
          oct_paid: item.oct_paid,
          oct_due: item.oct_due,

          nov_total: item.nov_total,
          nov_paid: item.nov_paid,
          nov_due: item.nov_due,

          dec_total: item.dec_total,
          dec_paid: item.dec_paid,
          dec_due: item.dec_due,

          jan_total: item.jan_total,
          jan_paid: item.jan_paid,
          jan_due: item.jan_due,

          feb_toal: item.feb_total,
          feb_paid: item.feb_paid,
          feb_due: item.feb_due,

          mar_total: item.mar_total,
          mar_paid: item.mar_paid,
          mar_due: item.mar_due,


        }
      })

      let { data2 } = await axios.post(`${baseURL}/api/fee-record-monthly/`, { records })
      
    } catch (error) {
      alert('fee is not saved')
    }

  }

  return (
    <div className="container-fluid fee-report-scope py-3">
      <div className="card fee-report-card border-0 mb-0">
        <div
          className="card-header border-0 py-3"
          style={{
            backgroundColor: "#d6eaff",
            borderBottom: "1px solid rgba(13, 110, 253, 0.18)",
          }}
        >
          <h6 className="mb-0 fw-semibold text-dark">Search Student</h6>
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
                onChange={(e)=>setMerit_reg_no(e.target.value)}
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
      </div>

      {student && (
        <section
          className="card fee-report-card border-0 mt-3"
          aria-label="Student details"
        >
          <div className="card-header border-0 bg-success bg-opacity-10 py-3">
            <h6 className="mb-0 fw-semibold text-dark">Student details</h6>
          </div>
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-auto">
                {studentPhotoSrc ? (
                  <img
                    src={studentPhotoSrc}
                    alt=""
                    className="rounded-3 border object-fit-cover bg-light"
                    style={{ width: "7rem", height: "7rem" }}
                  />
                ) : (
                  <div
                    className="rounded-3 border bg-light d-flex align-items-center justify-content-center text-muted fw-medium flex-shrink-0"
                    style={{ width: "7rem", height: "7rem", fontSize: "0.75rem" }}
                  >
                    Photo
                  </div>
                )}
              </div>
              <div className="col min-w-0">
                <div className="row g-2 row-cols-1 row-cols-sm-2 row-cols-lg-3">
                  {detailItems.map(({ label, value }) => (
                    <div key={label} className="col">
                      <div
                        className="d-flex align-items-baseline gap-2 text-break"
                        style={{ fontSize: "0.85rem", lineHeight: 1.4 }}
                      >
                        <span className="text-secondary fw-semibold flex-shrink-0">
                          {label}:
                        </span>
                        <span className="text-dark" style={{ minWidth: 0 }}>
                          {displayVal(value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      {allFeeheadspricing.length > 0 && (
        <div className="card mt-3">
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
                      Fee Head
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
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>

                  {allFeeheadspricing.map((item) => (
                    <tr key={getRowId(item)}>
                      <td className="fw-bold align-top text-break" style={{ minWidth: "6.5rem", maxWidth: "8rem", whiteSpace: "normal" }}>
                        {item?.feeHead?.fee_head_name}
                      </td>
                      <td className="semi-bold align-top text-break" style={{ minWidth: "4.5rem", maxWidth: "5.5rem", whiteSpace: "normal" }}>
                        Total-<br /><br />
                        Paid-<br />
                        Due-<br />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="apr_total" value={item?.apr_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="apr_paid" value={item?.apr_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="apr_due" value={item?.apr_due} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="may_total" value={item?.may_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="may_paid" value={item?.may_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="may_due" value={item?.may_due} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="jun_total" value={item?.jun_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="jun_paid" value={item?.jun_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="jun_due" value={item?.jun_total - item?.jun_paid} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="jul_total" value={item?.jul_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="jul_paid" value={item?.jul_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="jul_due" value={item?.jul_due} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="aug_total" value={item?.aug_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="aug_paid" value={item?.aug_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="aug_due" value={item?.aug_due} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="sep_total" value={item?.sep_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="sep_paid" value={item?.sep_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="sep_due" value={item?.sep_due} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="oct_total" value={item?.oct_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="oct_paid" value={item?.oct_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="oct_due" value={item?.oct_due} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="nov_total" value={item?.nov_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="nov_paid" value={item?.nov_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="nov_due" value={item?.nov_due} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="dec_total" value={item?.dec_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="dec_paid" value={item?.dec_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="dec_due" value={item?.dec_due} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="jan_total" value={item?.jan_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="jan_paid" value={item?.jan_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="jan_due" value={item?.jan_due} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="feb_total" value={item?.feb_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="feb_paid" value={item?.feb_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="feb_due" value={item?.feb_total - item?.feb_paid} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>
                      <td className="p-1 align-top" style={{ minWidth: "5rem", maxWidth: "5.5rem", verticalAlign: "top" }}>
                        <input className="form-control form-control-sm mb-1 w-100" name="mar_total" value={item?.mar_total} onChange={(e) => handleTotalChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="mar_paid" value={item?.mar_paid} onChange={(e) => handlePaidChange(e, getRowId(item))} />
                        <input className="form-control form-control-sm mb-1 w-100" name="mar_due" value={item?.mar_due} onChange={(e) => handleDueChange(e, getRowId(item))} />
                      </td>



                    </tr>
                  ))}
                </tbody>

              </table>
            </div>




          </div>
        </div>
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
              <input className='form-control' placeholder='enter fine' value={fine} onChange={(e) => setFine(e.target.value === "" ? 0 : parseNum(e.target.value))} />
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
              <input className='form-control' placeholder='0' value={typeoffeepayment==1?totalpaidfee:0} onChange={(e) => setConcession(e.target.value === "" ? 0 : parseNum(e.target.value))} />
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
              <input className='form-control' placeholder='0' value={typeoffeepayment==0?totalpaidfee:0} />
            </div>
            <div className='col-md-3'>
              <label className='form-label'>Balance</label>
              <input className='form-control' placeholder='0' value={payableFee - totalpaidfee} onChange={(e) => setBalance(e.target.value === "" ? 0 : parseNum(e.target.value))} />
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
              <button type='button' className='btn btn-primary'>pay and print</button>
              <button type='button' className='btn btn-primary' onClick={handlePayNow}>pay now</button>
            </div>
          </div>
        </div>
      </section>}
    </div>
  );
};

export default CollectAcademicFee;
