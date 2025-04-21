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
import GetStarted from "views/GetStarted.js";
import Login from "views/auth/Login.js";
import AuthLayout from "layouts/Auth.js";
import Index from "./components/pages/Index";

const walletDetails = JSON.parse(localStorage.getItem("walletDetails"));


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        {/* Routes with layouts */}
        <Route path="/admin" component={Admin} />
        <Route path="/auth" component={Auth} />

        <Route path="/" exact>
          {walletDetails && walletDetails.walletAddresses ? (
            <Redirect to="/auth/login" />
          ) : (
            <Redirect to="/products" />
          )}
        </Route>
        <Route path="/get-started" exact component={GetStarted} />
        <Route path="/auth/login" exact component={Login} />
        <Route path="/products" exact component={Index} />
        <Route path="/about-us" exact component={Index} />
        <Route path="/contact-us" exact component={Index} />
        <Redirect to="/products" />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>,
  </Provider>,
  document.getElementById("root")
);
