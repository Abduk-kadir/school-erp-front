import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import "../assets/css/studentParentDashboard.css";

const DASHBOARD_CARDS = [
  {
    slug: "dues-fees",
    label: "Dues fees",
    icon: "solar:wallet-money-bold-duotone",
    accent: "spd-accent-emerald",
    stat: "800",
    statHint: "Total due (₹)",
  },
  {
    slug: "attendance",
    label: "Attendance",
    icon: "solar:clipboard-check-bold-duotone",
    accent: "spd-accent-sky",
    stat: "92%",
    statHint: "This month",
  },
  {
    slug: "notification-diary",
    label: "Notification Diary",
    icon: "solar:bell-bing-bold-duotone",
    accent: "spd-accent-violet",
    stat: "200",
    statHint: "Unread",
  },
  {
    slug: "timetable",
    label: "TimeTable",
    icon: "solar:calendar-mark-bold-duotone",
    accent: "spd-accent-amber",
    stat: "8",
    statHint: "Periods today",
  },
  {
    slug: "assignment",
    label: "Assignment",
    icon: "solar:document-text-bold-duotone",
    accent: "spd-accent-rose",
    stat: "5",
    statHint: "Pending",
  },
  {
    slug: "notes",
    label: "Notes",
    icon: "solar:notebook-bold-duotone",
    accent: "spd-accent-cyan",
    stat: "12",
    statHint: "Subjects",
  },
  {
    slug: "event",
    label: "Event",
    icon: "solar:calendar-date-bold-duotone",
    accent: "spd-accent-orange",
    stat: "3",
    statHint: "Upcoming",
  },
  {
    slug: "holiday",
    label: "Holiday",
    icon: "solar:palms-bold-duotone",
    accent: "spd-accent-teal",
    stat: "15",
    statHint: "Days this term",
  },
  {
    slug: "about-school",
    label: "About School",
    icon: "solar:buildings-2-bold-duotone",
    accent: "spd-accent-slate",
    stat: "25+",
    statHint: "Years of excellence",
  },
  {
    slug: "profile",
    label: "Profile",
    icon: "solar:user-circle-bold-duotone",
    accent: "spd-accent-indigo",
    stat: "100%",
    statHint: "Profile complete",
  },
  {
    slug: "emergency-call",
    label: "Emergency call to Institute",
    icon: "solar:phone-calling-bold-duotone",
    accent: "spd-accent-red",
    stat: "24×7",
    statHint: "Tap to call",
  },
];

const DashBoardLayerTwo = () => {
  return (
    <section className="student-parent-dashboard">
      <header className="student-parent-dashboard__header">
        <h1 className="student-parent-dashboard__title">Student portal</h1>
        <p className="student-parent-dashboard__subtitle">
          Quick access for parents and students — numbers below are sample
          highlights; tap a card for the full section.
        </p>
      </header>

      <div className="student-parent-dashboard__grid">
        {DASHBOARD_CARDS.map(
          ({ slug, label, icon, accent, stat, statHint }) => (
            <Link
              key={slug}
              to={slug}
              className={`student-parent-card ${accent}`}
            >
              <Icon
                icon="solar:alt-arrow-right-linear"
                className="student-parent-card__chevron"
                aria-hidden
              />
              <div className="student-parent-card__top">
                <div className="student-parent-card__icon-wrap">
                  <Icon icon={icon} aria-hidden />
                </div>
                <div className="student-parent-card__stat-block">
                  <span className="student-parent-card__stat">{stat}</span>
                  <span className="student-parent-card__stat-hint">
                    {statHint}
                  </span>
                </div>
              </div>
              <p className="student-parent-card__label">{label}</p>
            </Link>
          )
        )}
      </div>
    </section>
  );
};

export default DashBoardLayerTwo;
