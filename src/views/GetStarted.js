/* eslint-disable */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImportWallet12 from "../views/auth/ImportWallet12";
import ImportWallet24 from "../views/auth/ImportWallet24";

export default function GetStarted() {
  const [showImportSelectionModal, setShowImportSelectionModal] = useState(false);
  const [showImport12Modal, setShowImport12Modal] = useState(false);
  const [showImport24Modal, setShowImport24Modal] = useState(false);

  const [seedWords, setSeedWords] = useState(Array(12).fill(""));

  const handleChange = (value, index) => {
    const updated = [...seedWords];
    updated[index] = value;
    setSeedWords(updated);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" && index < seedWords.length - 1) {
      e.preventDefault();
      const nextInput = document.getElementById(`seed-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    console.log("Seed words submitted:", seedWords);
    // Proceed to import wallet logic
  };

  return (
    <>
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap justify-center">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0 text-center">
              <Link
                className="md:block text-center md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-3xl font-bold p-2 px-0"
                to="/"
                style={{ margin: "15px" }}
              >
                Swift<span style={{ color: "#006A4E" }}>Aza</span>
              </Link>

              <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                Create a wallet or add an existing wallet
              </p>

              <div className="mt-48" />
              <div className="mt-16 justify-between flex">
                <a
                  href="/auth/createpin"
                  className="text-white w-full font-bold px-6 py-4 mr-9 rounded-lg outline-none focus:outline-none bg-green-500 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Create Wallet
                </a>
                <button
                  onClick={() => setShowImportSelectionModal(true)}
                  className="text-green w-full font-bold px-6 py-4 ml-9 rounded-lg outline-none focus:outline-none bg-primary-color-3 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Import Wallet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Choose Import Option */}
        {showImportSelectionModal && (
          <div className="fixed top-0 inset-0 z-50 flex items-center justify-center bg-primary-color-4 h-screen w-full">
            <div className="bg-primary-color-3 rounded-lg p-6 w-[400px] h-150-px max-w-md mb-16">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowImportSelectionModal(false)}
                  className="px-4 py-2 text-lg font-medium text-black font-bold focus:outline-none"
                >
                  X
                </button>
              </div>
              <h3 className="text-2xl text-center font-bold text-gray-900 mb-4">
                Import Wallet
              </h3>
              <p className="text-sm text-center text-gray-500 mb-6">
                Choose from the options below
              </p>

              <div className="flex flex-row gap-3 justify-between mx-auto mx-4 mb-8">
                <button
                  onClick={() => {
                    setShowImportSelectionModal(false);
                    setShowImport12Modal(true);
                  }}
                  className="text-green text-center font-bold px-6 py-3 mt-4 rounded-md outline-none focus:outline-none bg-black text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Import Wallet (12)<br />
                  <span className="text-xs font-normal">
                    Import Wallet with 12 secret recovery words
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowImportSelectionModal(false);
                    setShowImport24Modal(true);
                  }}
                  className="text-white text-center font-bold px-6 py-3 mt-4 rounded-md outline-none focus:outline-none bg-green-500 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Import Wallet (24)<br />
                  <span className="text-xs font-normal">
                    Import Wallet with 24 secret recovery words
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actual 12-word Input Modal */}
        {showImport12Modal && (
          <ImportWallet12
            seedWords={seedWords}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handleContinue={handleContinue}
            onClose={() => setShowImport12Modal(false)}
          />
        )}

        {/* Actual 24-word Input Modal */}
        {showImport24Modal && (
          <ImportWallet24
            seedWords={seedWords}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handleContinue={handleContinue}
            onClose={() => setShowImport24Modal(false)}
          />
        )}
      </section>
    </>
  );
}
