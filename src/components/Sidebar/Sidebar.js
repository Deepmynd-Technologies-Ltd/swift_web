import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavigationItem = ({ to, icon, text, isActive, onClick }) => (
  <div className="items-center">
    <Link
      style={{
        fontSize: "12px",
        padding: "8px 12px",
        maxWidth: "70%",
        fontWeight: "bold",
        display: "block",
        borderRadius: "0.375rem",
        color: isActive ? "#006A4E" : "#6B7280",
        backgroundColor: isActive ? "#e7e7e7" : "transparent",
        transition: "all 0.2s",
      }}
      to={to}
      onClick={onClick}
    >
      <div
        className={`fas ${icon}`}
        style={{
          fontSize: "12px",
          color: isActive ? "#006A4E" : "#6B7280",
          backgroundColor: isActive ? "#006A4E" : "#6B7280",
          transition: "color 0.2s",
        }}
      ></div>
      <span style={{ transition: "color 0.2s" }}>{text}</span>
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
  ].map(item => ({
    ...item,
    text: <span style={{ marginLeft: "20px" }}>{item.text}</span>,
  }));

  const helpAndSettingsItems = [
    { to: "#", icon: "fa-ghelp", text: "Get Help", key: "help" },
    { to: "#", icon: "fa-set", text: "Settings", key: "settings" },
  ].map(item => ({
    ...item,
    text: <span style={{ marginLeft: "20px" }}>{item.text}</span>
  }));

  return (
    <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-hidden md:flex-row md:flex-nowrap shadow-xl bg-primary-color-2 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-2 px-4" style={{ height: "100%" }}>
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          <div className="fixed bottom-0 w-full bg-primary-color-2 shadow-lg flex justify-between block lg:hidden items-center" style={{ padding: "10px 0", zIndex: 999 }}>
            {navigationItems.map((item, index) => (
              <NavigationItem
                key={index}
                {...item}
                isActive={location.pathname === item.to || activeItem === item.to}
                onClick={() => setActiveItem(item.to)}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className={`fas ${item.icon}`} style={{ fontSize: "20px", marginBottom: "5px", textAlign: "center" }}></div>
                  <span style={{ marginLeft: "0", textAlign: "center" }}>{item.text}</span>
                </div>
              </NavigationItem>
            ))}
          </div>
        
        <Link
          className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-lg font-bold p-2 px-0"
          to="/"
          style={{ margin: "10%" }}
        >
          Swift<span style={{color: "#006A4E"}}>Aza</span>
        </Link>

        <div className={`md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-2 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-auto flex-1 rounded transition-all ${collapseShow}`} style={{ height: "300px", backgroundColor: "#f9f9f9", transition: "all 0.3s" }}>
          <div className="md:min-w-full md:hidden block pb-2 mb-2 border-b border-solid border-blueGray-200">
            <div className="flex justify-end">
              <button
                type="button"
                className="cursor-pointer text-black opacity-50 md:hidden px-2 py-1 text-lg leading-none bg-transparent rounded border border-solid border-transparent"
                onClick={() => setCollapseShow("hidden")}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          </div>

          <div className="md:flex-col md:min-w-full flex flex-col list-none" style={{ marginLeft: "8%", gap: "6px", flex: 1, justifyContent: "space-between" }}>
            {navigationItems.map((item, index) => (
              <NavigationItem
                key={index}
                {...item}
                isActive={location.pathname === item.to || activeItem === item.to}
                onClick={() => setActiveItem(item.to)}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className={`fas ${item.icon}`} style={{ fontSize: "20px", marginBottom: "5px", textAlign: "center" }}></div>
                  <span style={{ marginLeft: "0", textAlign: "center" }}>{item.text}</span>
                </div>
              </NavigationItem>
            ))}
          </div>

          <div className="md:flex-col md:min-w-full flex flex-col list-none md:mb-2" style={{ margin: "10%", marginTop: "120%", marginLeft: "6%", gap: "6px", flex: 1, justifyContent: "space-between" }}>
            {helpAndSettingsItems.map((item, index) => (
              <NavigationItem
                key={index}
                to={item.to}
                icon={item.icon}
                text={item.text}
                isActive={activeItem === item.key}
                onClick={() => setActiveItem(item.key)}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className={`fas ${item.icon}`} style={{ fontSize: "20px", marginBottom: "5px", textAlign: "center" }}></div>
                  <span style={{ marginLeft: "0", textAlign: "center" }}>{item.text}</span>
                </div>
              </NavigationItem>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
