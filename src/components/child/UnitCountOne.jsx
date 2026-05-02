import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import baseURL from "../../utils/baseUrl";

const readMetric = (res) => {
  const raw = res?.data?.data;
  if (raw == null) return null;
  if (typeof raw === "number" || typeof raw === "string") return raw;
  if (typeof raw === "object") {
    const v =
      raw.total ?? raw.count ?? raw.amount ?? raw.value ?? raw.sum ?? null;
    return v;
  }
  return null;
};

const formatCount = (v) => {
  if (v == null || v === "") return "—";
  const n = Number(v);
  if (!Number.isNaN(n)) return n.toLocaleString("en-IN");
  return String(v);
};

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatFee = (v) => {
  if (v == null || v === "") return "—";
  const n = Number(v);
  if (!Number.isNaN(n)) return inrFormatter.format(n);
  return `₹${v}`;
};

const UnitCountOne = () => {
  const [totalStudents, setTotalStudents] = useState(null);
  const [totalFeeCollected, setTotalFeeCollected] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const outcomes = await Promise.allSettled([
        axios.get(`${baseURL}/api/admin-dashboard/total-student`),
        axios.get(`${baseURL}/api/admin-dashboard/total-fee-collected`),
      ]);
      if (cancelled) return;

      const [studentOutcome, feeOutcome] = outcomes;

      if (studentOutcome.status === "fulfilled") {
        setTotalStudents(readMetric(studentOutcome.value));
      } else {
        console.error("total-student failed", studentOutcome.reason);
        setTotalStudents(null);
      }

      if (feeOutcome.status === "fulfilled") {
        setTotalFeeCollected(readMetric(feeOutcome.value));
      } else {
        console.error("total-fee-collected failed", feeOutcome.reason);
        setTotalFeeCollected(null);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className='row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4 mt-2'>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-start-1 h-100'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <div>
                <p className='fw-medium text-primary-light mb-1'>Total Students</p>
                <h6 className='mb-0'>{formatCount(totalStudents)}</h6>
              </div>
              <div className='w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center'>
                <Icon
                  icon='gridicons:multiple-users'
                  className='text-white text-2xl mb-0'
                />
              </div>
            </div>
           
          </div>
        </div>
        {/* card end */}
      </div>
      
      <div className='col'>
        <div className='card shadow-none border bg-gradient-start-4 h-100'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <div>
                <p className='fw-medium text-primary-light mb-1'>
                  Total Fee Collected
                </p>
                <h6 className='mb-0'>{formatFee(totalFeeCollected)}</h6>
              </div>
              <div className='w-50-px h-50-px bg-success-main rounded-circle d-flex justify-content-center align-items-center'>
                <Icon
                  icon='solar:wallet-bold'
                  className='text-white text-2xl mb-0'
                />
              </div>
            </div>
           
          </div>
        </div>
        {/* card end */}
      </div>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-start-5 h-100'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <div>
                <p className='fw-medium text-primary-light mb-1'>
                  Total Expense
                </p>
                <h6 className='mb-0'>₹30,000</h6>
              </div>
              <div className='w-50-px h-50-px bg-red rounded-circle d-flex justify-content-center align-items-center'>
                <Icon
                  icon='fa6-solid:file-invoice-dollar'
                  className='text-white text-2xl mb-0'
                />
              </div>
            </div>
           
          </div>
        </div>
        {/* card end */}
      </div>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-start-2 h-100'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <div>
                <p className='fw-medium text-primary-light mb-1'>
                  Total Sms
                </p>
                <h6 className='mb-0'>15,000</h6>
              </div>
              <div className='w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center'>
                <Icon
                  icon='fa-solid:award'
                  className='text-white text-2xl mb-0'
                />
              </div>
            </div>
            
          </div>
        </div>
        {/* card end */}
      </div>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-start-3 h-100'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <div>
                <p className='fw-medium text-primary-light mb-1'>
                  Total Free Users
                </p>
                <h6 className='mb-0'>5,000</h6>
              </div>
              <div className='w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center'>
                <Icon
                  icon='fluent:people-20-filled'
                  className='text-white text-2xl mb-0'
                />
              </div>
            </div>
            
          </div>
        </div>
        {/* card end */}
      </div>
    </div>
  );
};

export default UnitCountOne;
