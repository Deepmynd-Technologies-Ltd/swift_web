/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function Index() {
  return (
    <>
      <IndexNavbar fixed />
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap justify-center">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0 text-center">
              <Link
                  className="md:block text-center md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-3xl font-bold p-2 px-0"
                  to="/"
                  style={{ margin: "15px" }}
                  >
                  Swift<span style={{color: "#006A4E"}}>Aza</span>
              </Link>

              <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
              Create a wallet or add an existing wallet
              </p>
              <div className="mt-48"></div>
              <div className="mt-16 justify-between flex ">
                <a
                  href="/auth/createpin"
                  className=" text-white w-full font-bold px-6 py-4 mr-9 rounded-lg outline-none focus:outline-none bg-green-500 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Create Wallet
                </a>
                <a href="#"
                  className=" text-green w-full font-bold px-6 py-4 ml-9 rounded-lg outline-none focus:outline-none bg-primary-color-3 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                  >
                    Import Wallet
                  </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}