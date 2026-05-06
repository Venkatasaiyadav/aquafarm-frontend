// src/layouts/MainLayout.jsx

import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiHome,
  HiPlus,
  HiChartBar,
  HiCurrencyRupee,
  HiLogout,
  HiMenu,
  HiX,
} from "react-icons/hi";
import { GiShrimp } from "react-icons/gi";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: <HiHome size={20} />, label: "Home" },
    { path: "/ponds", icon: <GiShrimp size={20} />, label: "Ponds" },
    { path: "/feed/add", icon: <HiPlus size={20} />, label: "Feed" },
    { path: "/expenses", icon: <HiCurrencyRupee size={20} />, label: "Expenses" },
    { path: "/reports", icon: <HiChartBar size={20} />, label: "Reports" },
  ];

  return (
    <div className="app-shell">
      {/* ========== DESKTOP SIDEBAR ========== */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <span style={{ fontSize: '1.2rem' }}>🦐</span>
          </div>
          <div>
            <h1 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>AquaFarm Pro</h1>
            <p style={{ color: '#64748B', fontSize: '0.75rem' }}>{user?.farmName}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="sidebar-close-btn"
          >
            <HiX size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? "sidebar-nav-active" : ""}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="sidebar-user">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem', marginBottom: '0.75rem' }}>
            <div className="sidebar-avatar">
              {user?.fullName?.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName}
              </p>
              <p style={{ color: '#64748B', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.phone}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <HiLogout size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========== MAIN CONTENT ========== */}
      <div className="main-wrapper">
        {/* Top Header Bar */}
        <header className="topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            className="topbar-menu-btn"
          >
            <HiMenu size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="topbar-logo-mobile">🦐</span>
            <h2 className="topbar-farm-name">
              {user?.farmName || "AquaFarm Pro"}
            </h2>
          </div>

          <div
            className="topbar-avatar"
            onClick={() => navigate("/dashboard")}
          >
            {user?.fullName?.charAt(0) || "U"}
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* ========== MOBILE BOTTOM NAVIGATION ========== */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `bottom-nav-item ${item.path === "/feed/add" ? "bottom-nav-center" : ""} ${isActive ? "bottom-nav-active" : ""}`
              }
            >
              {item.path === "/feed/add" ? (
                <div className="bottom-nav-fab">
                  <HiPlus size={26} color="white" />
                </div>
              ) : (
                item.icon
              )}
              <span className="bottom-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
