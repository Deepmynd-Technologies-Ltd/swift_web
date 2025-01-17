import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NavigationItem = ({ to, icon, text, isActive, onClick }) => (
  <li className="items-center">
    <Link
      className={`text-xs py-2 font-bold block rounded-md ${
        isActive
          ? "text-[#006A4E] hover:text-[#006A4E] bg-[#E5F4F0] active:bg-[#E5F4F0]"
          : "text-blueGray-500 hover:text-blueGray-700 hover:bg-gray-100"
      } transition-all duration-200 px-3`}
      to={to}
      onClick={onClick}
    >
      <i className={`fas ${icon} mr-1 text-xs ${isActive ? "active active:bg-[#E5F4F0]" : ""}`}></i>
      {text}
    </Link>
  </li>
);

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = useState("hidden");
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();

  const navigationItems = [
    { to: "/admin/dashbord", icon: "fa-wal", text: "Wallet", isAlwaysActive: true },
    { to: "/admin/history", icon: "fa-his", text: "History"},
    { to: "/admin/browser", icon: "fa-brw", text: "Browser" },
    // { to: "/admin/dashboard", icon: "fa-hm", text: "Home" },
    // { to: "/admin/business", icon: "fa-busns", text: "Business" },
    // { to: "/admin/swap_funds", icon: "fa-swp", text: "Swap Funds" },
    // { to: "/admin/cards", icon: "fa-crd", text: "Cards" },
    // { to: "/admin/p2p", icon: "fa-p2p", text: "P2P" },
    // { to: "/admin/investments", icon: "fa-inv", text: "Investments" },
    // { to: "/prof", icon: "fa-prf", text: "Profile" }
  ];

  return (
    <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-hidden md:flex-row md:flex-nowrap shadow-xl bg-primary-color-2 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-2 px-4" style={{ height: "100%" }}>
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto" style={{ marginLeft: "2%" }}>
        <button
          className="cursor-pointer text-black opacity-50 md:hidden px-2 py-1 text-lg leading-none bg-transparent rounded border border-solid border-transparent"
          onClick={() => setCollapseShow("bg-primary-color-2 m-2 py-3 px-6")}
        >
          <i className="fas fa-bars"></i>
        </button>
        
        <Link
          className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-base font-bold p-2 px-0"
          to="/"
          style={{ margin: "10%" }}
        >
          Swift<span style={{color: "#006A4E"}}>Aza</span>
        </Link>

        <div className={`md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-2 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-auto h-auto flex-1 rounded transition-all ${collapseShow}`}>
          <div className="md:min-w-full md:hidden block pb-2 mb-2 border-b border-solid border-blueGray-200">
            <div className="flex justify-end">
              <button
                type="button"
                className="cursor-pointer text-black opacity-50 md:hidden px-2 py-1 text-lg leading-none bg-transparent rounded border border-solid border-transparent"
                onClick={() => setCollapseShow("hidden")}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <ul className="md:flex-col md:min-w-full flex flex-col list-none" style={{ marginLeft: "8%", gap: "6px" }}>
            {navigationItems.map((item, index) => (
              <NavigationItem
                key={index}
                {...item}
                isActive={location.pathname === item.to || activeItem === item.to}
                onClick={() => setActiveItem(item.to)}
              />
            ))}
          </ul>

          <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-2" style={{ margin: "10%", marginTop: "25%", marginLeft: "12%", gap: "6px" }}>
            <li className="inline-flex">
              <a href="#" className="text-blueGray-700 hover:text-blueGray-500 text-xs block mb-2 no-underline font-semibold">
                <i className={`fas fa-ghelp mr-1 text-xs ${activeItem === 'help' ? 'active' : ''}`} onClick={() => setActiveItem('help')}></i>
                Get Help
              </a>
            </li>
            <li className="items-center">
              <Link
                className="text-xs py-2 font-bold block text-blueGray-700 hover:text-blueGray-500"
                to="/logout"
                onClick={() => setActiveItem('logout')}
              >
                <i className={`fas fa-lgout mr-1 text-xs ${activeItem === 'logout' ? 'active' : ''}`}></i>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}