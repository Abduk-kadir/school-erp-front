/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import axios from "axios";
import baseURL from "../utils/baseUrl";
import {onMessageListener} from "../services/fcmService";
import {useSelector,useDispatch} from "react-redux"
import {getStaffData} from "../redux/slices/registrationNo";


// ── Recursive Sidebar Menu Item Component ────────────────────────────────
function SidebarMenuItem({ item, level = 0 }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;
  const location = useLocation();
  
  // Auto open when child/grandchild route is active
  const requestNotificationPermission = async () => {
    try {
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("✅ Notification permission granted");
      } else {
        console.log("❌ Notification permission denied");
      }
    } catch (err) {
      console.error("Permission error:", err);
    }
  };

  useEffect(()=>{
    requestNotificationPermission();
    onMessageListener()
  },[])

  useEffect(() => {
    if (hasChildren) {
      const isActiveSomewhere = item.children.some((child) => {
        if (child.path === location.pathname) return true;
        return child.children?.some((gc) => gc.path === location.pathname);
      });
      if (isActiveSomewhere) setOpen(true);
    }
  }, [location.pathname]);

  return (
    <li className={`dropdown level-${level} ${open ? "open" : ""}`}>
      {hasChildren ? (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setOpen((prev) => !prev);
          }}
          className="menu-link"
        >
          {item.icon && <Icon icon={item.icon} className="menu-icon" />}
          <span>{item.title}</span>
          {/* ↓ Arrow removed completely */}
        </a>
      ) : (
        <NavLink
          to={item.path || "#"}
          className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
          onClick={(e) => e.stopPropagation()}

        >
          {item.icon && <Icon icon={item.icon} className="menu-icon" />}
          {level > 0 && (
            <i className="ri-circle-fill circle-icon text-primary-600" />
          )}
          <span>{item.title}</span>
        </NavLink>
      )}

      {hasChildren && (
        <ul
          className={`sidebar-submenu ${open ? "open" : ""}`}
          style={{ maxHeight: open ? "2000px" : "0px" }}
        >
          {item.children.map((child, i) => (
            <SidebarMenuItem key={i} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
// ── Main Layout Component ────────────────────────────────────────────────
const MasterLayout = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [instituteLogo, setInstituteLogo] = useState(null);
  const dispatch=useDispatch();
  const staff = useSelector((state) => state.registrationNo.staff?.data);
  const staffid = staff?.id;
  console.log('staff******** in master layout',staff)

 

  useEffect(()=>{
    console.log('calling use effect in dashboard admin')
    const token=localStorage.getItem('token');
    console.log('token**********************:',token)
    if(!staffid){
      dispatch(getStaffData({token:token}))
    }
    console.log("end")
  },[])

  useEffect(() => {
    let fetchData = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/api/institute`);
        setInstituteLogo(data?.data[0]?.logo);
      } catch (error) {

      }
    };
    fetchData();
  }, []);

  const sidebarControl = () => setSidebarActive(!sidebarActive);
  const mobileMenuControl = () => setMobileMenu(!mobileMenu);

  // ── Modern nested menu structure ───────────────────────────────────────
  const menuItems = [
    {
      title: "Dashboard",
      icon: "solar:home-smile-angle-outline",
      children: [
        { title: "Overview", path: "/" },
        {
          title: "Analytics",
          icon: "solar:card-send-outline",
          children: [
            { title: "Traffic Sources", path: "/analytics/traffic" },
            {
              title: "User Behavior",
              icon: "solar:card-send-outline",                       // ← new level
              children: [
                { title: "Session Duration", path: "/analytics/behavior/sessions" },
                { title: "Page Views", path: "/analytics/behavior/pages" },
                { title: "Bounce Rate", path: "/analytics/behavior/bounce" }
              ]
            },
            { title: "Conversion Rate", path: "/analytics/conversion" }
          ]
        },
        {
          title: "My Page",
          children: [
            { title: "Profile Overview", path: "/dashboard/my-page" },
            {
              title: "Settings",                             // ← new level
              children: [
                { title: "Personal Info", path: "/dashboard/my-page/personal" },
                { title: "Security", path: "/dashboard/my-page/security" },
                { title: "Notifications", path: "/dashboard/my-page/notifications" }
              ]
            },
            { title: "Activity Log", path: "/dashboard/my-page/activity" }
          ]
        }
      ]
    },

    {
      title: "ID Card Master",
      icon: "icon-park-outline:id-card",
      children: [
        { title: "Generate ID Card", path: "/id-card/generate" },
        {
          title: "Settings",
          children: [
            { title: "Field Configuration", path: "/id-card/fields" },
            {
              title: "Template Management",                    // ← new level
              children: [
                { title: "Create New Template", path: "/id-card/templates/new" },
                { title: "Edit Templates", path: "/id-card/templates/edit" },
                { title: "Preview Templates", path: "/id-card/templates/preview" }
              ]
            },
            { title: "Print Settings", path: "/id-card/print" }
          ]
        },
        { title: "Batch Master", path: "/id-card/batch-master" }
      ]
    },
    {
      title: "Master",
      icon: "icon-park-outline:id-card",
      children: [
        { title: "Role Master", path: "/dashboard/role-master" },

        { title: "Employee Master", path: "/dashboard/employee-master" },
        { title: "Academic Year Master", path: "/dashboard/academic-year-master" },
        { title: "Class Master", path: "/dashboard/class-master" },
        {title:"Class Division Master",path:"/dashboard/class-division-master"},
        { title: "Batch Master", path: "/dashboard/batch-master" },
        { title: "Division Master", path: "/dashboard/division-master" },
        { title: "Cast Master", path: "/dashboard/cast-master" },
        {title:"Department Master",path:"/dashboard/department-master"},
        {title:"Designation Mater",path:"/dashboard/designation-master"},
        { title: "Add Declaration", path: "/dashboard/add-declaration" },
        {
          title: "Document Master",
          children: [
            { title: "Add Doucment", path: "/dashboard/document-master/add-document" },
            { title: "Assign Doucment", path: "/dashboard/document-master/assign-document" }
          ]
        },
        { title: "Phisally Disable", path: "/dashboard/phisally-disable" },
        {title:"Holiday Master",path:"/dashboard/holiday-master"},
        {title:"Event Master",path:"/dashboard/event-master"},
        {title:"About School",path:"/dashboard/add-about-school"},
        {title:"Carsoul Master",path:"/dashboard/carsoul-master"},
        {
          title: 'Admision Form master',
          children: [
            { title: "Stages", path: "admission-form-master/stages" },
            {
              title: "Field Type",
              path: "admission-form-master/filed-type"


            },
            { title: "Field", path: "admission-form-master/Field" },
            { title: "drop-radio-values", path: "admission-form-master/field-values" },
            { title: "class-filed", path: "admission-form-master/class-field" }
          ]
        },




      ]
    },

    {
      title: "Subject Master",
      icon: "icon-park-outline:id-card",
      children: [
        { title: "Subject", path: "/dashboard/subject" },
        { title: "Program", path: "/dashboard/program" },

        { title: "Assign Subject", path: "/dashboard/assign-subject" },



      ]
    },
    {
      title: "Academic",
      icon: "icon-park-outline:id-card",
      children: [
        { title: "Student", path: "/dashboard/academic/student" },
        { title: "Download Student", path: "/dashboard/academic/download-student-data" },
        {title:"Student Detail Bulk Update",path:"/dashboard/academic/student-detail-bulk-update"},
        {
          title: "Attendance",
          children: [
            { title: "In/Out",
              children: [
                { title: "Take Attendance", path: "/dashboard/academic/in-out-attendance" },
                { title: "Detail Report", path: "/dashboard/academic/in-out-attendance-detail-report" },
                { title: "Summary Report", path: "/dashboard/academic/in-out-attendance-summary-report" },
                { title: "Monthly Report", path: "/dashboard/academic/in-out-attendance-monthly-report" },
                { title: "Yearly Report", path: "/dashboard/academic/in-out-attendance-yearly-report" }
              ]
            },
            { title: "Lecture Wise Attendance",
              children: [
                { title: "Take Attendance", path: "/dashboard/academic/lecture-wise-attendance" },
                { title: "Detail Report", path: "/dashboard/academic/lecture-wise-attendance-detail-report" },
                { title: "Staff wise Report", path: "/dashboard/academic/lecture-wise-attendance-summary-report" },
                
              ]
            },
          ]
        },
        {
          title: "Notification",
          children: [
            { title: "Send Notification",path:"/dashboard/academic/send-notification"
              
            },
            { title: "Fiew Notification",path:"/dashboard/academic/view-notification"
             
            },
          ]
        },
        
        {
          title: "Diary",
          children: [
            { title: "Send Diary",path:"/dashboard/academic/send-diary"
              
            },
            { title: "Fiew Diary",path:"/dashboard/academic/view-diary"
             
            },
          ]
        },
        {
          title: "Notes",
          children: [
            { title: "Send Notes",path:"/dashboard/academic/send-notes"
              
            },
            { title: "View Notes",path:"/dashboard/academic/view-notes"
             
            },
          ]
        },
        {
          title: "Assignment",
          children: [
            { title: "Send Assignment",path:"/dashboard/academic/send-assignment"
              
            },
            { title: "View Assignment",path:"/dashboard/academic/view-assignment"
             
            },
          ]
        },
        {
          title: "Time Table",
          children: [
            { title: "Send Time Table",path:"/dashboard/academic/send-time-table"
              
            },
            { title: "View Time Table",path:"/dashboard/academic/view-time-table"
             
            },
          ]
        },
        

      ]
    },

    {
      title: "Staff",
      icon: "icon-park-outline:id-card",
      children: [
        { title: "Staff Master", path: "/dashboard/staff-master" },
       



      ]
    },

    {
      title: "Accounts",
      icon: "icon-park-outline:id-card",
      children: [
        {
          title: "Fee Master",
          children: [
            { title: "Payment Setting", path: "/dashboard/accounts/fee-master/payment-setting" },
           
            { title: "bank", path: "/dashboard/accounts/fee-master/add-bank" },
            { title: "Bank Detail", path: "/dashboard/accounts/fee-master/add-bank-detail" },
            { title: "Fees Type", path: "/dashboard/accounts/fee-master/add-fees-type" },
            { title: "Fee Head", path: "/dashboard/accounts/fee-master/add-fee-head" },
            { title: "Fee Group", path: "/dashboard/accounts/fee-master/add-fee-group" },
            { title: "Fee Group Pricing", path: "/dashboard/accounts/fee-master/fee-group-pricing" },
            {title:"Fine", path: "/dashboard/accounts/fee-master/fine"},
            {title:"Assigned Fine",path:"/dashboard/accounts/fee-master/assigned-fine"},
            
          ]
        },
        {
          title: "Admission Fee",
          icon: "icon-park-outline:id-card",
          children: [
            {title:"Split Admission Fee",path:"/dashboard/admission/split-admission-fee"},
            { title: "Collect Admission Fee", path: "/dashboard/admission/collect-admission-fee" },
            { title: "Report-Online Admission Payment", path: "/dashboard/admission/online-admission-payment" },
            { title: "Report-Offline Admission Payment", path: "/dashboard/admission/offline-admission-payment" },
            { title: "Report-All Transaction Admission Payment", path: "/dashboard/admission/all-transaction-admission-payment" },
            { title: "Report-Student Wise Admission Payment", path: "/dashboard/admission/student-wise-admission-payment" },
            
            

          ]
        },

        {
          title: "Academic Fee",
          icon: "icon-park-outline:id-card",
          children: [
            {title:"Split Academic Fee",path:"/dashboard/academic-fee/split-academic-fee"},
            { title: "Collect Academic Fee", path: "/dashboard/academic-fee/collect-academic-fee" },
            { title: "Report-Online Academic Payment", path: "/dashboard/academic-fee/online-academic-payment" },
            { title: "Report-Offline Academic Payment", path: "/dashboard/academic-fee/offline-academic-payment" },
            { title: "Report-All Transaction Academic Payment", path: "/dashboard/academic-fee/all-transaction-academic-payment" },
            { title: "Report-Student Wise Academic Payment", path: "/dashboard/academic-fee/student" },
            { title: "Student Transaction Detail Academic Payment", path: "/dashboard/academic-fee/student" },
            { title: "Student Monthly Paid/Unpaid Academic Payment", path: "/dashboard/academic-fee/paid-and-unpaid-report" },
            { title: "Fees Summary Academic Report", path: "/dashboard/academic-fee/fees-summary-academic-report" },
            { title: "Student Head & Month Wise Paid/Unpaid Academic Payment", path: "/dashboard/academic-fee/student" },
            {title:"Academic Fine",path:"/dashboard/academic-fee/academic-fine"},
            { title: "Download Student Bulk Reciept Academic Payment", path: "/dashboard/academic-fee/download-student-bulk-reciept" },

          ]
        },
         {
          title: "Bus Fee",
          icon: "icon-park-outline:id-card",
          children: [
            { title: "Collect Bus Fee", path: "/dashboard/bus-fee/collect-bus-fee" },
            { title: "Report-Online Bus Payment", path: "/dashboard/bus-fee/online-bus-payment" },
            { title: "Report-Offline Bus Payment", path: "/dashboard/bus-fee/offline-bus-payment" },
            { title: "Report-All Transaction Bus Payment", path: "/dashboard/bus-fee/all-transaction-bus-payment" },
            { title: "Report-Student Wise Bus Payment", path: "/dashboard/bus-fee/student-wise-bus-payment" },

          ]
        },
         {
          title: "Canteen Fee",
          icon: "icon-park-outline:id-card",
          children: [
            {title:"Split Canteen Fee",path:"/dashboard/canteen-fee/split-canteen-fee"},
            { title: "Collect Canteen Fee", path: "/dashboard/canteen-fee/collect-canteen-fee" },
            { title: "Report-Online Canteen Payment", path: "/dashboard/canteen-fee/online-canteen-payment" },
            { title: "Report-Offline Canteen Payment", path: "/dashboard/canteen-fee/offline-canteen-payment" },
            { title: "Report-All Transaction Canteen Payment", path: "/dashboard/canteen-fee/all-transaction-canteen-payment" },
            { title: "Report-Student Wise Canteen Payment", path: "/dashboard/canteen-fee/student-wise-canteen-payment" },

          ]
        },

         {
          title: "Other Fee",
          icon: "icon-park-outline:id-card",
          children: [
            { title: "Collect Other Fee", path: "/dashboard/academic/student" },
            { title: "Report-Other Fee", path: "/dashboard/academic/student" },
           
          ]
        },




      ]
    },
    {
      title: "Admission",
      icon: "icon-park-outline:id-card",
      children: [
        { title: "Seat Allotment", path: "/dashboard/admission/seat-allotment" },
        { title: "Addmission Fee", path: "/dashboard/admission/fee" },
        { title: "Addmission Conform", path: "/dashboard/admission/form-conform" },
        { title: "Addmission Form Coupon", path: "/dashboard/admission/coupon" },
       
      ]
    },
    {
      title: "Admission Report",
      icon: "icon-park-outline:id-card",
      children: [
        { title: "Form status report", path: "admission-report/form-status-report" },
        { title: "Form accept report", path: "admission-report/form-accept-report" },
      ]
    },

    {
      title: "Class wise Schools",
      icon: "icon-park-outline:id-card",
      path: "/dashboard/class-wise-school",
    },

    {
      title: "Transport",
      icon: "icon-park-outline:id-card",
      children: [
        { title: "Add Route", path: "/dashboard/transport/add-route" },
        { title: "Assign Sub Route", path: "/dashboard/transport/assign-sub-route" },


      ]
    },
    {
      title: "Error Logs",
      icon: "icon-park-outline:id-card",
      children: [
        { title: "Error Logs", path: "/dashboard/error-logs" },
      ]
    },

    {
      title: "Setting",
      icon: "icon-park-outline:id-card",
      children: [
        { title: "Institute", path: "/dashboard/setting/institute" },
      ]
    },

    // ... you can do the same for other sections (Master, Subject, etc.)
  ];

  return (
    <section className={mobileMenu ? "overlay active" : "overlay"}>
      {/* Sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active"
            : mobileMenu
              ? "sidebar sidebar-open"
              : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type="button"
          className="sidebar-close-btn"
        >
          <Icon icon="radix-icons:cross-2" />
        </button>

        <div>
          <Link to="/" className="sidebar-logo">
            <img src={instituteLogo} alt="logo" className="light-logo" />
            <img
              src={instituteLogo}
              alt="logo"
              className="dark-logo"
            />
            <img
              src={instituteLogo}
              alt="logo icon"
              className="logo-icon"
            />
          </Link>
        </div>

        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={index} item={item} />
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className='navbar-header'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-4'>
                <button
                  type='button'
                  className='sidebar-toggle'
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon='iconoir:arrow-right'
                      className='icon text-2xl non-active'
                    />
                  ) : (
                    <Icon
                      icon='heroicons:bars-3-solid'
                      className='icon text-2xl non-active '
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type='button'
                  className='sidebar-mobile-toggle'
                >
                  <Icon icon='heroicons:bars-3-solid' className='icon' />
                </button>
                <form className='navbar-search'>
                  <input type='text' name='search' placeholder='Search' />
                  <Icon icon='ion:search-outline' className='icon' />
                </form>
              </div>
            </div>
            <div className='col-auto'>
              <div className='d-flex flex-wrap align-items-center gap-3'>
                {/* ThemeToggleButton */}
                <ThemeToggleButton />
                
               
                
                <div className='dropdown'>
                  <button
                    className='d-flex justify-content-center align-items-center rounded-circle'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <img
                      src={
                        staff?.staff_photo
                          ? `${baseURL}${staff.staff_photo}`
                          : "assets/images/user.png"
                      }
                      alt='image_user'
                      className='w-40-px h-40-px object-fit-cover rounded-circle'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                          {staff?.firstname}
                        </h6>
                        <span className='text-secondary-light fw-medium text-sm'>
                          {staff?.designationInfo?.designation_name}
                        </span>
                      </div>
                      <button type='button' className='hover-text-danger'>
                        <Icon
                          icon='radix-icons:cross-1'
                          className='icon text-xl'
                        />
                      </button>
                    </div>
                    <ul className='to-top-list'>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/view-profile'
                        >
                          <Icon
                            icon='solar:user-linear'
                            className='icon text-xl'
                          />{" "}
                          My Profile
                        </Link>
                      </li>
                      
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3'
                          to='#'
                        >
                          <Icon icon='lucide:power' className='icon text-xl' />{" "}
                          Log Out
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Profile dropdown end */}
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className='dashboard-main-body'>{<Outlet />}</div>

        {/* Footer section */}
        <footer className='d-footer'>
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <p className='mb-0'>© 2025 WowDash. All Rights Reserved.</p>
            </div>
            <div className='col-auto'>
              <p className='mb-0'>
                Made by <span className='text-primary-600'>wowtheme7</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;