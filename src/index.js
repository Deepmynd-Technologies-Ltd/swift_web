import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from './Store';

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";

// views without layouts
import CreateAccountNavbar from "components/Navbars/CreateAccountNavbar";
import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";
import Login from "views/auth/Login.js";
import AuthLayout from "layouts/Auth.js";

const walletDetails = JSON.parse(localStorage.getItem("walletDetails"));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        {/* Routes with layouts */}
        <Route path="/admin" component={Admin} />
        <Route path="/auth" component={Auth} />

        {/* Routes without layouts */}
        <Route path="/landing" exact component={Landing} />
        <Route path="/profile" exact component={Profile} />

        {/* Fixing the "/" route */}
        <Route path="/" exact>
          {walletDetails && walletDetails.walletAddresses ? (
            <Redirect to="/auth/login" />
          ) : (
            <Index />
          )}
        </Route>

        {/* Catch-all redirect */}
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>,
  </Provider>,
  document.getElementById("root")
);
