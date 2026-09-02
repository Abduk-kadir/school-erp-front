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
import "../assets/css/sidebar.css";

/** Recursively filter menu tree by title (matches nested submenu titles too). */
function filterMenuItems(items, query) {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.reduce((acc, item) => {
    const titleMatch = item.title.toLowerCase().includes(q);
    const filteredChildren = item.children?.length
      ? filterMenuItems(item.children, query)
      : [];

    if (titleMatch) {
      acc.push(item);
    } else if (filteredChildren.length > 0) {
      acc.push({ ...item, children: filteredChildren });
    }
    return acc;
  }, []);
}

// ── Recursive Sidebar Menu Item Component ────────────────────────────────
function SidebarMenuItem({ item, level = 0, forceOpen = false }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;
  const location = useLocation();
  const isOpen = forceOpen || open;
  
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
    <li className={`dropdown level-${level} ${isOpen ? "open" : ""}`}>
      {hasChildren ? (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (!forceOpen) setOpen((prev) => !prev);
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
          className={`sidebar-submenu ${isOpen ? "open" : ""}`}
          style={{ maxHeight: isOpen ? "2000px" : "0px" }}
        >
          {item.children.map((child, i) => (
            <SidebarMenuItem
              key={i}
              item={child}
              level={level + 1}
              forceOpen={forceOpen}
            />
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
  const [instituteName, setInstituteName] = useState("");
  const [menuSearch, setMenuSearch] = useState("");
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
        const institute = data?.data?.[0];
        if (institute?.logo) {
          setInstituteLogo(
            institute.logo.startsWith("http")
              ? institute.logo
              : `${baseURL}${institute.logo}`
          );
        }
        setInstituteName(institute?.name || "");
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
      path:"/dashboard",
      icon: "solar:home-smile-angle-outline",
     
    },

    {
      title: "ID Card Master",
      icon: "solar:card-outline",
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
      icon: "solar:widget-5-outline",
      children: [
        { title: "Role", path: "/dashboard/role-master" },

        { title: "Employee ", path: "/dashboard/employee-master" },
        { title: "Academic Year", path: "/dashboard/academic-year-master" },
        { title: "Class", path: "/dashboard/class-master" },
        {title:"Class&Division",path:"/dashboard/class-division-master"},
        {
          title: "Class wise Schools",
          
          path: "/dashboard/class-wise-school",
        },
        { title: "Batch", path: "/dashboard/batch-master" },
        { title: "Division", path: "/dashboard/division-master" },
        {title:"Semester",path:"/dashboard/semester-master"},
        {title:"Student Type",path:"/dashboard/student-type-master"},
        { title: "Cast ", path: "/dashboard/cast-master" },
        {title:"Gender",path:"/dashboard/gender-master"},
        {title:"Title",path:"/dashboard/title-master"},
        {title:"Department ",path:"/dashboard/department-master"},
        {title:"Designation ",path:"/dashboard/designation-master"},
        { title: "Add Declaration", path: "/dashboard/add-declaration" },
        {
          title: "Document Master",
          children: [
            { title: "Add Doucment", path: "/dashboard/document-master/add-document" },
            { title: "Assign Doucment", path: "/dashboard/document-master/assign-document" }
          ]
        },
        { title: "Phisally Disable", path: "/dashboard/phisally-disable" },
        {title:"Holiday",path:"/dashboard/holiday-master"},
        {title:"Event ",path:"/dashboard/event-master"},
       
        {title:"About School",path:"/dashboard/add-about-school"},
        {title:"Carsoul ",path:"/dashboard/carsoul-master"},
        {title:"Other Carsouls",path:"/dashboard/other-carsoul-master"},
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
      icon: "solar:book-2-outline",
      children: [
        { title: "Subject", path: "/dashboard/subject" },
        { title: "Program", path: "/dashboard/program" },

        { title: "Assign Subject", path: "/dashboard/assign-subject" },
        { title: "Assign Subject To Student", path: "/dashboard/assign-subject-student" }



      ]
    },
    {
      title: "Staff",
      icon: "solar:users-group-rounded-outline",
      children: [
        { title: "Staff Master", path: "/dashboard/staff-master" },
       



      ]
    },
    {
      title: "Admission",
      icon: "solar:document-add-outline",
      children: [
        {
          title: "Addmission Master",
          children: [
            { title: "Seat Allotment", path: "/dashboard/admission/seat-allotment" },
            { title: "Admission Fee", path: "/dashboard/admission/fee" },
            { title: "Admission Conform", path: "/dashboard/admission/form-conform" },
            { title: "Admission Form Coupon", path: "/dashboard/admission/coupon" },
           
          ]
        },
        {
          title: "Admission Report",
          
          children: [
            { title: "Form status report", path: "admission-report/form-status-report" },
            { title: "Form accept report", path: "admission-report/form-accept-report" },
          ]
        },
        
       
      ]
    },
    {
      title: "Accounts",
      icon: "solar:wallet-money-outline",
      children: [
        {
          title: "Fee Master",
          icon: "solar:card-transfer-outline",
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
          icon: "solar:bill-list-outline",
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
          icon: "solar:calculator-outline",
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
          icon: "solar:bus-outline",
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
          icon: "solar:cup-outline",
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
          icon: "solar:dollar-outline",
          children: [
            { title: "Collect Other Fee", path: "/dashboard/academic/student" },
            { title: "Report-Other Fee", path: "/dashboard/academic/student" },
           
          ]
        },




      ]
    },
    {
      title: "Academic",
      icon: "solar:square-academic-cap-outline",
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
      title: "Examination",
      icon: "solar:clipboard-list-outline",
      children: [
        { title: "Exam Type", path: "/dashboard/examination/exam-type" },
        { title: "Exam Schedule", path: "/dashboard/examination/exam-schedule" },
        { title: "Exam Result", path: "/dashboard/examination/exam-result" },
        { title: "Exam Report", path: "/dashboard/examination/exam-report" },
        { title: "Exam Paper", path: "/dashboard/examination/exam-paper" },
        { title: "Exam Paper Set", path: "/dashboard/examination/exam-paper-set" },
        { title: "Exam Paper Set Question", path: "/dashboard/examination/exam-paper-set-question" },
        { title: "Exam Paper Set Question Answer", path: "/dashboard/examination/exam-paper-set-question-answer" },
        { title: "Exam Paper Set Question Answer Option", path: "/dashboard/examination/exam-paper-set-question-answer-option" },


      ]
    },
    {
      title: "Documents Printing",
      icon: "solar:printer-outline",
      children: [
        { title: "Print Documents", path: "/dashboard/documents-printing/print-documents" },
        { title: "Print Documents Report", path: "/dashboard/documents-printing/print-documents-report" },
        { title: "Print Documents Report", path: "/dashboard/documents-printing/print-documents-report" },
      ]
      
    },
    {
      title: "Transport",
      icon: "solar:map-point-outline",
      children: [
        { title: "Add Route", path: "/dashboard/transport/add-route" },
        { title: "Assign Sub Route", path: "/dashboard/transport/assign-sub-route" },


      ]
    },
    {
      title: "Error Logs",
      icon: "solar:danger-triangle-outline",
      children: [
        { title: "Error Logs", path: "/dashboard/error-logs" },
      ]
    },

    {
      title: "Setting",
      icon: "solar:settings-outline",
      children: [
        { title: "Institute", path: "/dashboard/setting/institute" },
      ]
    },

    // ... you can do the same for other sections (Master, Subject, etc.)
  ];

  const filteredMenuItems = filterMenuItems(menuItems, menuSearch);
  const isSearching = menuSearch.trim().length > 0;

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
          <div className={`sidebar-menu-search${isSearching ? " is-active" : ""}`}>
            <span className="sidebar-menu-search-icon" aria-hidden="true">
              <Icon icon="solar:magnifer-linear" />
            </span>
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search menus & submenus..."
              aria-label="Search menu"
            />
            {isSearching && (
              <button
                type="button"
                className="sidebar-menu-search-clear"
                onClick={() => setMenuSearch("")}
                aria-label="Clear search"
              >
                <Icon icon="radix-icons:cross-2" />
              </button>
            )}
          </div>
          <ul className="sidebar-menu" id="sidebar-menu">
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item, index) => (
                <SidebarMenuItem
                  key={index}
                  item={item}
                  forceOpen={isSearching}
                />
              ))
            ) : (
              <li className="sidebar-menu-empty">No menu found</li>
            )}
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
                <div className="navbar-institute-name">
                  {instituteName || "Institute"}
                </div>
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
        <footer className="d-footer">
  <div className="row align-items-center justify-content-between">
    <div className="col-auto">
      <p className="mb-0">© Digital Data System. All Rights Reserved.</p>
    </div>

    <div className="col-auto">
      <p className="mb-0">
        Made by{" "}
        <a
          href="https://digitaldatasystem.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600"
        >
          Digital Data System
        </a>
      </p>
    </div>
  </div>
</footer>
      </main>
    </section>
  );
};

export default MasterLayout;