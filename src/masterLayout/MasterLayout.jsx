/* eslint-disable react/prop-types */
import { useState ,useEffect} from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";


// ── Recursive Sidebar Menu Item Component ────────────────────────────────
function SidebarMenuItem({ item, level = 0 }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;
  const location = useLocation();

  // Auto open when child/grandchild route is active
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
      
      { title: "Employee Master", path:"/dashboard/employee-master" },
      { title: "Academic Year Master", path: "/dashboard/academic-year-master" },
      { title: "Class Master", path: "/dashboard/class-master" },
      { title: "Division Master", path: "/dashboard/division-master" },
      { title: "Cast Master", path: "/dashboard/cast-master"},
      { title: "Document Master", 
        children:[
          {title:"Add Doucment",path: "/dashboard/document-master/add-document"},
          {title:"Assign Doucment",path: "/dashboard/document-master/assign-document"}
        ]
      },
      { title: "Phisally Disable", path: "/dashboard/phisally-disable"},
      {title:'Admision Form master',
        children: [
          { title: "Stages", path: "admission-form-master/stages" },
          {
            title: "Field Type",  
            path: "admission-form-master/filed-type"
                              
           
          },
          { title: "Field", path: "admission-form-master/Field" },
          { title: "drop-radio-values", path: "admission-form-master/field-values" }
        ]
      }
       

    ]
  },

   {
    title: "Subject Master",
    icon: "icon-park-outline:id-card",
    children: [
      { title: "Subject", path: "/dashboard/subject" },
      { title: "Program", path: "/dashboard/program" },
      
      { title: "Assign Subject", path:"/dashboard/assign-subject" },
      
       

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
            <img src="assets/images/logo.png" alt="logo" className="light-logo" />
            <img
              src="assets/images/logo-light.png"
              alt="logo"
              className="dark-logo"
            />
            <img
              src="assets/images/logo-icon.png"
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
                <div className='dropdown d-none d-sm-inline-block'>
                  <button
                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <img
                      src='assets/images/lang-flag.png'
                      alt='Wowdash'
                      className='w-24 h-24 object-fit-cover rounded-circle'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                          Choose Your Language
                        </h6>
                      </div>
                    </div>
                    <div className='max-h-400-px overflow-y-auto scroll-sm pe-8'>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='english'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='assets/images/flags/flag1.png'
                              alt='WowDash React Vite'
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              English
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='english'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='japan'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='assets/images/flags/flag2.png'
                              alt='WowDash React Vite'
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              Japan
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='japan'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='france'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='assets/images/flags/flag3.png'
                              alt='WowDash React Vite'
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              France
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='france'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='germany'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='assets/images/flags/flag4.png'
                              alt='WowDash React Vite'
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              Germany
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='germany'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='korea'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='assets/images/flags/flag5.png'
                              alt='WowDash React Vite'
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              South Korea
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='korea'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='bangladesh'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='assets/images/flags/flag6.png'
                              alt='WowDash React Vite'
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              Bangladesh
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='bangladesh'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='india'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='assets/images/flags/flag7.png'
                              alt='WowDash React Vite'
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              India
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='india'
                        />
                      </div>
                      <div className='form-check style-check d-flex align-items-center justify-content-between'>
                        <label
                          className='form-check-label line-height-1 fw-medium text-secondary-light'
                          htmlFor='canada'
                        >
                          <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                            <img
                              src='assets/images/flags/flag8.png'
                              alt='WowDash React Vite'
                              className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                            />
                            <span className='text-md fw-semibold mb-0'>
                              Canada
                            </span>
                          </span>
                        </label>
                        <input
                          className='form-check-input'
                          type='radio'
                          name='crypto'
                          id='canada'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Language dropdown end */}
                <div className='dropdown'>
                  <button
                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <Icon
                      icon='mage:email'
                      className='text-primary-light text-xl'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
                    <div className='m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                          Message
                        </h6>
                      </div>
                      <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
                        05
                      </span>
                    </div>
                    <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='assets/images/notification/profile-3.png'
                              alt='WowDash React Vite'
                            />
                            <span className='w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                            8
                          </span>
                        </div>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='assets/images/notification/profile-4.png'
                              alt='WowDash React Vite'
                            />
                            <span className='w-8-px h-8-px  bg-neutral-300 rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                            2
                          </span>
                        </div>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='assets/images/notification/profile-5.png'
                              alt='WowDash React Vite'
                            />
                            <span className='w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-neutral-400 rounded-circle'>
                            0
                          </span>
                        </div>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='assets/images/notification/profile-6.png'
                              alt='WowDash React Vite'
                            />
                            <span className='w-8-px h-8-px bg-neutral-300 rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-neutral-400 rounded-circle'>
                            0
                          </span>
                        </div>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-40-px h-40-px rounded-circle flex-shrink-0 position-relative'>
                            <img
                              src='assets/images/notification/profile-7.png'
                              alt='WowDash React Vite'
                            />
                            <span className='w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0' />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Kathryn Murphy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-100-px'>
                              hey! there i’m...
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                          <span className='text-sm text-secondary-light flex-shrink-0'>
                            12:30 PM
                          </span>
                          <span className='mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle'>
                            8
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className='text-center py-12 px-16'>
                      <Link
                        to='#'
                        className='text-primary-600 fw-semibold text-md'
                      >
                        See All Message
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Message dropdown end */}
                <div className='dropdown'>
                  <button
                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <Icon
                      icon='iconoir:bell'
                      className='text-primary-light text-xl'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
                    <div className='m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                          Notifications
                        </h6>
                      </div>
                      <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
                        05
                      </span>
                    </div>
                    <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            <Icon
                              icon='bitcoin-icons:verify-outline'
                              className='icon text-xxl'
                            />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Congratulations
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Your profile has been Verified. Your profile has
                              been Verified
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            <img
                              src='assets/images/notification/profile-1.png'
                              alt='WowDash React Vite'
                            />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Ronald Richards
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              You can stitch between artboards
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            AM
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Arlene McCoy
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between bg-neutral-50'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            <img
                              src='assets/images/notification/profile-2.png'
                              alt='WowDash React Vite'
                            />
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Annette Black
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </Link>
                      <Link
                        to='#'
                        className='px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between'
                      >
                        <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                          <span className='w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                            DR
                          </span>
                          <div>
                            <h6 className='text-md fw-semibold mb-4'>
                              Darlene Robertson
                            </h6>
                            <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                              Invite you to prototyping
                            </p>
                          </div>
                        </div>
                        <span className='text-sm text-secondary-light flex-shrink-0'>
                          23 Mins ago
                        </span>
                      </Link>
                    </div>
                    <div className='text-center py-12 px-16'>
                      <Link
                        to='#'
                        className='text-primary-600 fw-semibold text-md'
                      >
                        See All Notification
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Notification dropdown end */}
                <div className='dropdown'>
                  <button
                    className='d-flex justify-content-center align-items-center rounded-circle'
                    type='button'
                    data-bs-toggle='dropdown'
                  >
                    <img
                      src='assets/images/user.png'
                      alt='image_user'
                      className='w-40-px h-40-px object-fit-cover rounded-circle'
                    />
                  </button>
                  <div className='dropdown-menu to-top dropdown-menu-sm'>
                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                      <div>
                        <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                          Shaidul Islam
                        </h6>
                        <span className='text-secondary-light fw-medium text-sm'>
                          Admin
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
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/email'
                        >
                          <Icon
                            icon='tabler:message-check'
                            className='icon text-xl'
                          />{" "}
                          Inbox
                        </Link>
                      </li>
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/company'
                        >
                          <Icon
                            icon='icon-park-outline:setting-two'
                            className='icon text-xl'
                          />
                          Setting
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
        <div className='dashboard-main-body'>{<Outlet/>}</div>

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