import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

// views
import Dashboard from "views/admin/Dashboard.js";
import History from "views/admin/History.js";
import Browser from "views/admin/Browser.js";

export default function Admin() {
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-primary-color flex flex-col" style={{ marginBottom: "-30px"}}>
        {/* Background overlay */}
        {isModalOpen && (
          <>
            {/* Background overlay */}
            <div
              className="fixed inset-0 opacity-50 z-40 bg-black"
              onClick={closeModal}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            ></div>
          </>
        )}

        {/* Wrap Routes with TransitionGroup and CSSTransition */}
        <TransitionGroup>
          <CSSTransition
            key={location.key} // Make transition per location change
            timeout={700} // Duration of transition
            classNames="fade" // Apply fade animation (you can change this class name)
          >
            <Switch location={location}>
              <Route path="/admin/browser" exact>
                <Browser />
                {/* <FooterAdmin /> */}
              </Route>
              <Route path="/admin/dashboard" exact>
                <AdminNavbar />
                <Dashboard />
                {/* <FooterAdmin /> */}
              </Route>
              <Route path="/admin/history" exact>
                <AdminNavbar />
                <History />
                {/* <FooterAdmin /> */}
              </Route>
              <Redirect from="/admin" to="/admin/dashboard" />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </>
  );
}
