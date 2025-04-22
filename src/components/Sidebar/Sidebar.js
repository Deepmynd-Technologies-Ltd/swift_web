import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SettingsModal from "components/Cards/modals/SettingsModal";
import { X } from "lucide-react";

const NavigationItem = ({ to, icon, text, isActive, onClick, isMobile, isModal }) => {
  if (isModal) {
    return (
      <div className={`items-center ${isMobile ? 'flex-1 flex flex-col justify-center' : ''}`}>
        <div
          onClick={onClick}
          style={{
            fontSize: isMobile ? "12px" : "16px",
            padding: "12px 16px",
            width: "100%",
            minWidth: isMobile ? "auto" : "200px",
            maxHeight: isMobile ? "auto" : "40px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            borderRadius: "1rem",
            color: isActive ? "#27C499" : "#6B7280",
            backgroundColor: isMobile ? "transparent" : (isActive ? "#7A8A9829" : "transparent"),
            transition: "all 0.2s",
            marginBottom: "10px",
            textAlign: "center",
            fontFamily: "Aeonik",
            cursor: "pointer"
          }}
        >
          <div
            className={`fas ${icon}`}
            style={{
              fontSize: isMobile ? "20px" : "16px",
              backgroundColor: isActive ? "#27C499" : "#6B7280",
              marginBottom: isMobile ? "4px" : "10px",
              marginRight: isMobile ? "0" : "16px",
              width: "20px",
              textAlign: "center",
            }}
          ></div>
          <span style={{ fontSize: isMobile ? "10px" : "14px" }}>{text}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`items-center ${isMobile ? 'flex-1 flex flex-col justify-center' : ''}`}>
      <Link
        to={to}
        onClick={onClick}
        style={{
          fontSize: isMobile ? "12px" : "16px",
          padding: "12px 16px",
          width: "100%",
          minWidth: isMobile ? "auto" : "200px",
          maxHeight: isMobile ? "auto" : "40px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
          borderRadius: "1rem",
          color: isActive ? "#27C499" : "#6B7280",
          backgroundColor: isMobile ? "transparent" : (isActive ? "#7A8A9829" : "transparent"),
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
            backgroundColor: isActive ? "#27C499" : "#6B7280",
            marginBottom: isMobile ? "4px" : "10px",
            marginRight: isMobile ? "0" : "16px",
            width: "20px",
            textAlign: "center",
          }}
        ></div>
        <span style={{ fontSize: isMobile ? "10px" : "14px" }}>{text}</span>
      </Link>
    </div>
  );
};

// 📱 Mobile Sidebar Component
const MobileSidebar = ({ items, activeItem, setActiveItem, onSettingsClick }) => {
  const location = useLocation();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-200 flex justify-between items-center md:hidden"
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
            onClick={() => {
              if (item.key === "settings") {
                onSettingsClick();
              } else {
                setActiveItem(item.to);
              }
            }}
            isMobile={true}
            isModal={item.key === "settings"}
          />
        ))}
      </div>
    </div>
  );
};

// 💻 Desktop Sidebar Component
const DesktopSidebar = ({ mainItems, secondaryItems, activeItem, setActiveItem, onSettingsClick }) => {
  const location = useLocation();

  return (
    <nav
      className="hidden md:block md:fixed md:top-0 md:bottom-0 md:w-72 bg-black z-10 py-6 px-6"
      
    >
      {/* Logo */}
      <Link
        to="/"
        className="text-left text-white text-lg font-bold mb-6 block"
        style={{ fontFamily: "Aeonik", fontSize: "24px", marginLeft: "10%" }}
      >
        Swift<span style={{ color: "#27C499" }}>Aza</span>
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

      <div style={{ height: "calc(100vh - 65vh)" }}></div>

      {/* Secondary Navigation */}
      <div className="flex flex-col" style={{ marginLeft: "2%", padding: "16px 10px" }}>
        {secondaryItems.map((item, index) => (
          <NavigationItem
            key={index}
            {...item}
            isActive={location.pathname === item.to || activeItem === item.to}
            onClick={() => {
              if (item.key === "settings") {
                onSettingsClick();
              } else {
                setActiveItem(item.to);
              }
            }}
            isMobile={false}
            isModal={item.key === "settings"}
          />
        ))}
      </div>
    </nav>
  );
};

// 🧩 Combined Sidebar Component
export default function Sidebar() {
  const [activeItem, setActiveItem] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleSettingsClick = () => {
    setShowSettingsModal(true);
  };

  const mainNavigationItems = [
    { to: "/admin/dashboard", icon: "fa-wal", text: "Wallet" },
    { to: "/admin/history", icon: "fa-his", text: "History" },
    { to: "/admin/browser", icon: "fa-brw", text: "Browser" },
  ];

  const secondaryNavigationItems = [
    { to: "#", icon: "fa-ghelp", text: "Get Help", key: "help" },
    { to: "#", icon: "fa-set", text: "Settings", key: "settings" },
  ];

  return (
    <>
      <DesktopSidebar
        mainItems={mainNavigationItems}
        secondaryItems={secondaryNavigationItems}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        onSettingsClick={handleSettingsClick}
      />
      <MobileSidebar
        items={[...mainNavigationItems, secondaryNavigationItems[1]]}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        onSettingsClick={handleSettingsClick}
      />
      
      {/* Render the Settings Modal */}
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
    </>
  );
}