import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import CreateAccountNavbar from "components/Navbars/CreateAccountNavbar";
import VerifyAccountNavBar from "components/Navbars/VerifyAccountNavbar";
// views
import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";
import CreateWallet from "views/auth/Createwallet.js";
import ConfirmPin from "views/auth/Confirmpin.js";
import SecureWallet from "views/auth/Securewallet.js";
import CreatePin from "views/auth/Createpin.js";
import { PinProvider } from "../context/PinContext";

const AuthLayout = ({ children, NavbarComponent }) => {
  return (
    <main className="flex flex-col md:flex-row min-h-screen" style={{ marginBottom: "-30px"}}>
      <div className="w-full md:w-1/4 lg:w-1/5 xl:w-1/6">
        <NavbarComponent />
      </div>
      <section className="relative w-full md:w-3/4 lg:w-4/5 xl:w-5/6 min-h-screen bg-primary-color">
        {children}
      </section>
    </main>
  );
};

export default function Auth() {
  return (
    <PinProvider>
      <Switch>
        <Route path="/auth/register" exact>
          <AuthLayout NavbarComponent={() => <div className="hidden md:block"><CreateAccountNavbar /></div>}>
            <Register />
          </AuthLayout>
        </Route>

        <Route path="/auth/createpin" exact>
          <AuthLayout NavbarComponent={() => <div className="hidden md:block"><CreateAccountNavbar /></div>}>
            <CreatePin />
          </AuthLayout>
        </Route>

        <Route path="/auth/login" exact>
          <AuthLayout NavbarComponent={() => <div className="hidden md:block"><CreateAccountNavbar /></div>}>
            <Login />
          </AuthLayout>
        </Route>

        <Route path="/auth/confirmpin" exact>
          <AuthLayout NavbarComponent={() => <div className="hidden md:block"><CreateAccountNavbar /></div>}>
            <ConfirmPin />
          </AuthLayout>
        </Route>

        <Route path="/auth/securewallet" exact>
          <AuthLayout NavbarComponent={() => <div className="hidden md:block"><CreateAccountNavbar /></div>}>
            <SecureWallet />
          </AuthLayout>
        </Route>

        <Route path="/auth/createwallet" exact>
          <AuthLayout NavbarComponent={() => <div className="hidden md:block"><CreateAccountNavbar /></div>}>
            <CreateWallet />
          </AuthLayout>
        </Route>        
      </Switch>
    </PinProvider>
  );
}