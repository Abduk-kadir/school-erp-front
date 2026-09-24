import { useEffect, useState,useMemo } from "react";
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

const KPI_CARDS = [
  {
    key: "students",
    label: "Total Students",
    icon: "solar:users-group-rounded-bold-duotone",
    accent: "adm-kpi-accent-blue",
    format: "count",
  },
  {
    key: "sms",
    label: "Total SMS",
    icon: "solar:chat-round-dots-bold-duotone",
    accent: "adm-kpi-accent-sky",
    format: "count",
  },
  {
    key: "expense",
    label: "Total Expenses",
    icon: "solar:bill-list-bold-duotone",
    accent: "adm-kpi-accent-amber",
    format: "fee",
  },
  {
    key: "registrationFee",
    label: "Total Registration Fee",
    icon: "fa6-solid:indian-rupee-sign",
    accent: "adm-kpi-accent-teal",
    format: "fee",
  },
  {
    key: "admissionFee",
    label: "Total Admission Fee",
    icon: "fa6-solid:indian-rupee-sign",
    accent: "adm-kpi-accent-blue",
    format: "fee",
  },
  {
    key: "academicFee",
    label: "Total Academic Fee",
    icon: "fa6-solid:indian-rupee-sign",
    accent: "adm-kpi-accent-sky",
    format: "fee",
  },
  {
    key: "busFee",
    label: "Total Bus Fee",
    icon: "fa6-solid:indian-rupee-sign",
    accent: "adm-kpi-accent-amber",
    format: "fee",
  },
  {
    key: "canteenFee",
    label: "Total Canteen Fee",
    icon: "fa6-solid:indian-rupee-sign",
    accent: "adm-kpi-accent-teal",
    format: "fee",
  },
];

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

  const values = useMemo(()=>{
    return{
      students: totalStudents,
      sms: 0,
      expense: 0,
      registrationFee:0,
      admissionFee: 0,
      academicFee: 0,
      busFee: 0,
      canteenFee: 0,
    };
  },[totalStudents])

  return (
    <div className='adm-kpi-grid'>
      {KPI_CARDS.map((card) => {
        const raw = values[card.key];
        const display =
          card.format === "fee" ? formatFee(raw) : formatCount(raw);

        return (
          <div key={card.key} className={`adm-kpi-card ${card.accent}`}>
            <div className='adm-kpi-inner'>
              <div>
                <p className='adm-kpi-label'>{card.label}</p>
                <h6 className='adm-kpi-value'>{display}</h6>
              </div>
              <span className='adm-kpi-icon' aria-hidden='true'>
                <Icon icon={card.icon} width='22' height='22' />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UnitCountOne;
