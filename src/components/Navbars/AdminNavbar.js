import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import SettingsModal from "components/Cards/modals/SettingsModal.js";

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const [activeItem, setActiveItem] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.remove(theme === "light" ? "dark" : "light");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));
  const handleSettingsClick = () => setShowSettingsModal(true);

  const navigationItems = [
    { to: "#", icon: "fa-set", key: "settings" },
  ];

  const NavigationItem = ({ to, icon, text, isActive, onClick, isMobile, isModal }) => {
    if (isMobile && isModal) {
      return (
        <div className={`items-center flex-1 flex flex-col justify-center`}>
          <div
            onClick={onClick}
            style={{
              fontSize: "12px",
              padding: "12px 16px",
              width: "100%",
              minWidth: "auto",
              maxHeight: "auto",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              borderRadius: "1rem",
              color: isActive ? "#27C499" : "#6B7280",
              backgroundColor: isActive ? "#7A8A9829" : "transparent",
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
                fontSize: "20px",
                backgroundColor: isActive ? "#27C499" : "white",
                marginRight: "2%",
                width: "20px",
                textAlign: "center",
              }}
            ></div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderPageTitle = () => {
    const path = window.location.pathname;
    const isMobile = window.innerWidth < 768;
    const styleBase = {
      marginTop: "20px",
      marginLeft: isMobile ? "auto" : "0",
      marginRight: isMobile ? "auto" : "0",
      fontWeight: isMobile ? 500 : 700,
    };

    if (path === "/admin/dashboard") {
      return (
        <a
          className="text-green text-sm lg:inline-block font-bold flex items-center bg-blueGray-700 p-2 rounded-lg justify-center text-center lg:justify-start lg:text-left"
          style={styleBase}
        >
          <i className="fas fa-wal mr-2 md:mb-0" style={{ backgroundColor: "#27C499", marginTop: isMobile ? "-10px" : "0" }}></i>
          Wallets
          <i className="fa fa-chevron-down ml-2"></i>
        </a>
      );
    }
  };

  return (
    <nav className="top-0 left-0 w-full z-10 bg-transparent flex flex-row items-center p-4">
      <div className="w-full mx-auto flex justify-between items-center flex-row px-4">
        {renderPageTitle()}
        <div className="absolute right-0 md:hidden" style={{ marginRight: "5%", marginTop: "6%"}}>
          {navigationItems.map((item, index) => (
            <NavigationItem
              key={index}
              {...item}
              isActive={location.pathname === item.to || activeItem === item.to}
              onClick={() => {
                item.key === "settings" ? handleSettingsClick() : setActiveItem(item.to);
              }}
              isMobile={true}
              isModal={item.key === "settings"}
            />
          ))}
        </div>

        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          className="absolute top-0 right-0 w-full h-full bg-white"
          style={{ zIndex: 1000 }}
        />

        <ul className="hidden md:flex flex-col md:flex-row list-none items-center flex mt-4 md:mt-0">
          <div className="mr-1">
            <NotificationDropdown />
          </div>

          <a
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center mr-3"
          >
            <i className={`fas ${theme === "light" ? "fa-darkmode" : "fa-lightmode"} bg-white`}></i>
          </a>

          {/* <div className="mr-4 mt-2">
            <UserDropdown />
          </div> */}
        </ul>
      </div>
    </nav>
  );
}
