import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

// components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views
import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import History from "views/admin/History.js";
import Browser from "views/admin/Browser.js";

export default function Admin() {
  const location = useLocation();

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-primary-color min-h-screen flex flex-col">
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
              <Route path="/admin/maps" exact>
                <Maps />
                {/* <FooterAdmin /> */}
              </Route>
              <Route path="/admin/settings" exact>
                <Settings />
                {/* <FooterAdmin /> */}
              </Route>
              <Route path="/admin/tables" exact>
                <Tables />
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
