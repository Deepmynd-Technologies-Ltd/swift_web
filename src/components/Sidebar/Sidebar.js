import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavigationItem = ({ to, icon, text, isActive, onClick, isMobile }) => (
  <div className={`items-center ${isMobile ? 'flex-1 flex flex-col justify-center' : ''}`}>
    <Link
      to={to}
      onClick={onClick}
      style={{
        fontSize: isMobile ? "12px" : "16px",
        padding: "12px 16px",
        width: "100%",
        minWidth: isMobile ? "auto" : "200px",
        maxHeight: isMobile ? "auto" : "50px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        flexDirection: isMobile ? "column" : "row",
        borderRadius: "1rem",
        color: isActive ? "#006A4E" : "#6B7280",
        backgroundColor: isMobile ? "transparent" : (isActive ? "#e7e7e7" : "transparent"),
        transition: "all 0.2s",
        marginBottom: "10px",
        textAlign: "center",
        fontFamily: "Aeonik",
      }}
    >
      <div
        className={`fas ${icon}`}
        style={{
          fontSize: isMobile ? "20px" : "16px",
          color: isActive ? "#006A4E" : "#6B7280",
          marginBottom: isMobile ? "4px" : "10px",
          marginRight: isMobile ? "0" : "16px",
          width: "20px",
          textAlign: "center",
        }}
      ></div>
      <span style={{ fontSize: isMobile ? "10px" : "16px" }}>{text}</span>
    </Link>
  </div>
);


// 📱 Mobile Sidebar Component
const MobileSidebar = ({ items, activeItem, setActiveItem }) => {
  const location = useLocation();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-between items-center md:hidden"
      style={{
        zIndex: 999,
        boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
        height: "72px",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex justify-around items-center w-full px-4">
        {items.map((item, index) => (
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
  );
};

// 💻 Desktop Sidebar Component
const DesktopSidebar = ({ mainItems, secondaryItems, activeItem, setActiveItem }) => {
  const location = useLocation();

  return (
    <nav
      className="hidden md:block md:fixed md:top-0 md:bottom-0 md:w-72  bg-white z-10 py-4 px-4"
      style={{ marginTop: "10px" }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="text-left text-lg font-bold mb-6 block"
        style={{ fontFamily: "Aeonik", fontSize: "24px", marginLeft: "10%" }}
      >
        Swift<span style={{ color: "#006A4E" }}>Aza</span>
      </Link>

      {/* Main Navigation */}
      <div className="flex flex-col" style={{ marginLeft: "2%", padding: "16px 10px" }}>
        {mainItems.map((item, index) => (
          <NavigationItem
            key={index}
            {...item}
            isActive={location.pathname === item.to || activeItem === item.to}
            onClick={() => setActiveItem(item.to)}
            isMobile={false}
          />
        ))}
      </div>

      <div style={{ height: "200px" }}></div>

      {/* Secondary Navigation */}
      <div className="flex flex-col" style={{ marginLeft: "2%", padding: "16px 10px" }}>
        {secondaryItems.map((item, index) => (
          <NavigationItem
            key={index}
            {...item}
            isActive={location.pathname === item.to || activeItem === item.to}
            onClick={() => setActiveItem(item.to)}
            isMobile={false}
          />
        ))}
      </div>
    </nav>
  );
};

// 🧩 Combined Sidebar Component
export default function Sidebar() {
  const [activeItem, setActiveItem] = useState(null);

  const mainNavigationItems = [
    { to: "/admin/dashboard", icon: "fa-wal", text: "Wallet" },
    { to: "/admin/history", icon: "fa-his", text: "History" },
    { to: "/admin/browser", icon: "fa-brw", text: "Browser" },
  ];

  const secondaryNavigationItems = [
    { to: "/admin/help", icon: "fa-ghelp", text: "Get Help", key: "help" },
    { to: "/admin/settings", icon: "fa-set", text: "Settings", key: "settings" },
  ];

  return (
    <>
      <DesktopSidebar
        mainItems={mainNavigationItems}
        secondaryItems={secondaryNavigationItems}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      <MobileSidebar
        items={mainNavigationItems}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
    </>
  );
}