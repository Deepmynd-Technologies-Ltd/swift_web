import React, { useState, useEffect } from "react";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";

export default function Navbar() {
  const [theme, setTheme] = useState("light");

  // Toggle theme logic
  useEffect(() => {
    document.body.classList.remove(theme === "light" ? "dark" : "light");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <>
      {/* Navbar */}
      <nav className="top-0 left-0 w-full z-10 bg-transparent flex flex-row items-center p-4">
        <div className="w-full mx-auto flex justify-between items-center flex-row px-4">
          {/* Brand */}
          {window.location.pathname === "/admin/dashboard" && (
            <a
              className="text-green text-sm lg:inline-block font-bold flex items-center bg-primary-color-4 p-2 rounded-lg justify-center text-center lg:justify-start lg:text-left"
              style={{
                marginTop: "20px",
                fontWeight: 700,
                marginLeft: window.innerWidth < 768 ? "auto" : "0",
                marginRight: window.innerWidth < 768 ? "auto" : "0",
              }}
              type="button"
              aria-haspopup="true"
              aria-expanded="true"
            >
              <i className="fas fa-wal mr-2"></i>
              Wallets
              <i className="fa fa-chevron-down ml-2"></i>
            </a>
          )}

          {window.location.pathname === "/admin/history" && (
            <h2
              className="text-black text-2xl lg:inline-block font-bold flex items-center p-2"
              style={{
                marginTop: "20px",
                fontWeight: 700,
                marginLeft: window.innerWidth < 768 ? "auto" : "0",
                marginRight: window.innerWidth < 768 ? "auto" : "0",
              }}
              type="button"
              aria-haspopup="true"
              aria-expanded="true"
            >
              History
            </h2>
          )}

          {/* Navbar Items */}
          <ul className="hidden md:flex flex-col md:flex-row list-none items-center flex mt-4 md:mt-0  ">
            {/* Notifications */}
            <div className="mr-1">
              <NotificationDropdown />
            </div>
            
            {/* Theme Toggle Button */}
            <a
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center justify-center mr-3"
            >
              <i
                className={`fas ${
                  theme === "light" ? "fa-lightmode" : "fa-darkmode"
                } text-yellow-500 dark:text-gray-300`}
              ></i>
            </a>

            {/* User Dropdown */}
            {/* <div className="mr-4 mt-2">
              <UserDropdown />
            </div> */}
          </ul>
        </div>
      </nav>
    </>
  );
}
