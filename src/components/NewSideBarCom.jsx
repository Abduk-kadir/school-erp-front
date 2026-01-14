/* eslint-disable react/prop-types */
import { useState,useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";

// ── Recursive Sidebar Menu Item Component ────────────────────────────────
function SidebarMenuItem({ item, level = 0 }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;
  const location = useLocation();

  // Auto open parents when child route is active
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
          <Icon icon="ep:arrow-down-bold" className="arrow-icon" />
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
          children: [
            { title: "Traffic", path: "/analytics/traffic" },
            { title: "Conversion", path: "/analytics/conversion" },
          ],
        },
        {
          title: "My Page",
          children: [
            { title: "Profile", path: "/dashboard/my-page/profile" },
            { title: "Activity", path: "/dashboard/my-page/activity" },
            { title: "Settings", path: "/dashboard/my-page/settings" },
          ],
        },
      ],
    },

    {
      title: "ID Card Master",
      icon: "icon-park-outline:id-card",
      children: [
        { title: "Download Student Photo", path: "/id-card/download-photo" },
        { title: "Generate ID Card", path: "/id-card/generate" },
        {
          title: "Settings",
          children: [
            { title: "Field Setting", path: "/id-card/fields" },
            { title: "Template Setting", path: "/id-card/templates" },
            { title: "Print Setting", path: "/id-card/print" },
          ],
        },
        { title: "Batch Master", path: "/id-card/batch-master" },
      ],
    },

    {
      title: "Master",
      icon: "solar:database-outline",
      children: [
        { title: "Role Master", path: "/master/roles" },
        { title: "Employee Master", path: "/master/employees" },
        {
          title: "Academic",
          children: [
            { title: "Academic Year", path: "/master/academic-year" },
            { title: "Class Master", path: "/master/classes" },
            { title: "Division Master", path: "/master/divisions" },
          ],
        },
        { title: "Cast Master", path: "/master/cast" },
        { title: "Holiday Master", path: "/master/holidays" },
        { title: "Event Master", path: "/master/events" },
      ],
    },

    {
      title: "Subject",
      icon: "ph:books-duotone",
      children: [
        {
          title: "Assignment",
          children: [
            { title: "Assign to Class", path: "/subject/assign-class" },
            { title: "Assign to Student", path: "/subject/assign-student" },
          ],
        },
        { title: "Create Subject Code", path: "/subject/create-code" },
      ],
    },
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
      <main className={sidebarActive ? "dashboard-main active" : "dashboard-main"}>
        {/* Navbar header, notifications, user dropdown... */}
        {/* (your existing navbar code remains unchanged) */}

        <div className="dashboard-main-body">
          <Outlet />
        </div>

        <footer className="d-footer">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <p className="mb-0">© 2026 WowDash. All Rights Reserved.</p>
            </div>
            <div className="col-auto">
              <p className="mb-0">
                Made by <span className="text-primary-600">wowtheme7</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
};

export default MasterLayout;