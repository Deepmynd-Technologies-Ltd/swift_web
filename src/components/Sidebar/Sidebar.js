import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavigationItem = ({ to, icon, text, isActive, onClick, isMobile }) => (
  <div className={`items-center ${isMobile ? 'flex-1 flex flex-col justify-center' : ''}`} style={{ marginBottom: isMobile ? '0' : '10px' }}>
    <Link
      style={{
        fontSize: "12px",
        padding: "8px 12px",
        maxWidth: isMobile ? "100%" : "70%",
        fontWeight: "bold",
        display: "block",
        borderRadius: "0.375rem",
        color: isActive ? "#006A4E" : "#6B7280",
        backgroundColor: isActive ? "#e7e7e7" : "transparent",
        transition: "all 0.2s",
        marginLeft: isMobile ? "0" : "10%",
        textAlign: isMobile ? "center" : "left",
      }}
      to={to}
      onClick={onClick}
    >
      <div
        className={`fas ${icon} ${isMobile ? 'text-lg mb-1' : ''}`}
        style={{
          fontSize: isMobile ? "20px" : "12px",
          color: isActive ? "#006A4E" : "#6B7280",
          backgroundColor: isActive ? "#006A4E" : "#6B7280",
          transition: "color 0.2s",
          marginRight: isMobile ? "0" : "25px",
        }}
      ></div>
      <span 
        style={{ 
          transition: "color 0.2s",
          display: isMobile ? "block" : "inline",
          fontSize: isMobile ? "11px" : "12px",
        }}
      >
        {text}
      </span>
    </Link>
  </div>
);

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();

  const navigationItems = [
    { to: "/admin/dashboard", icon: "fa-wal", text: "Wallet", isActive: true },
    { to: "/admin/history", icon: "fa-his", text: "History" },
    { to: "/admin/browser", icon: "fa-brw", text: "Browser" },
  ].map((item) => ({
    ...item,
    text: item.text,
  }));

  const helpAndSettingsItems = [
    { to: "#", icon: "fa-ghelp", text: "Get Help", key: "help" },
    { to: "#", icon: "fa-set", text: "Settings", key: "settings" },
  ].map((item) => ({
    ...item,
    text: item.text,
  }));

  return (
    <nav
      className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-hidden md:flex-row md:flex-nowrap shadow-xl bg-primary-color-2 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-2 px-4"
      style={{ height: "100%" }}
    >
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        {/* Mobile Navigation */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center lg:hidden"
          style={{ 
            zIndex: 999,
            boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
            height: "64px",
            paddingBottom: "env(safe-area-inset-bottom)"
          }}
        >
          <div className="flex justify-around items-center w-full px-4">
            {navigationItems.map((item, index) => (
              <NavigationItem
                key={index}
                {...item}
                isActive={location.pathname === item.to || activeItem === item.to}
                onClick={() => setActiveItem(item.to)}
                isMobile={true}
              />
            ))}
          </div>
        </div>

        {/* Desktop Logo */}
        <Link
          className="hidden lg:block md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-lg font-bold p-2 px-0"
          to="/"
          style={{ margin: "10%" }}
        >
          Swift<span style={{ color: "#006A4E" }}>Aza</span>
        </Link>

        {/* Sidebar Content */}
        <div
          className={`md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-2 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-auto flex-1 rounded transition-all ${collapseShow}`}
          style={{ height: "300px", backgroundColor: "#f9f9f9", transition: "all 0.3s" }}
        >
          {/* Navigation Items for Desktop */}
          <div
            className="md:flex-col md:min-w-full flex flex-col list-none hidden md:block"
            style={{ marginLeft: "2%", flex: 1, justifyContent: "space-between", padding: "10px" }}
          >
            {navigationItems.map((item, index) => (
              <NavigationItem
                key={index}
                {...item}
                isActive={location.pathname === item.to || activeItem === item.to}
                onClick={() => setActiveItem(item.to)}
                isMobile={false}
              />
            ))}
          </div>

          {/* Help & Settings Items for Desktop */}
          <div
            className="md:flex-col md:min-w-full flex flex-col list-none md:mb-2 hidden md:block"
            style={{
              margin: "10%",
              marginTop: "100%",
              marginLeft: "2%",
              flex: 1,
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            {helpAndSettingsItems.map((item, index) => (
              <NavigationItem
                key={index}
                to={item.to}
                icon={item.icon}
                text={item.text}
                isActive={activeItem === item.key}
                onClick={() => setActiveItem(item.key)}
                isMobile={false}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}