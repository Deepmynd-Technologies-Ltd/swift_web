/* eslint-disable */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImportWalletModal from "../views/auth/ImportWalletModal";

export default function GetStarted() {
  const [showImportSelectionModal, setShowSelector] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [wordCount, setWordCount] = useState(12);
  const [seedWords, setSeedWords] = useState(Array(12).fill(""));

  // when user picks 12 or 24, reset state
  const openImport = (count) => {
    setWordCount(count);
    setSeedWords(Array(count).fill(""));
    setShowSelector(false);
    setShowImportModal(true);
  };

  const handleChange = (value, idx) => {
    const arr = [...seedWords];
    arr[idx] = value;
    setSeedWords(arr);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Enter" && idx < wordCount - 1) {
      e.preventDefault();
      const next = document.getElementById(`seed-${idx + 1}`);
      next?.focus();
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    console.log(`Submitted ${wordCount} words:`, seedWords);
    // ...your import logic here...
    setShowImportModal(false);
  };

  return (
    <>
      <section
        className="header relative bg-black pt-16 flex h-screen items-center"
        style={{ marginBottom: "-30px" }}
      >
        {/* … create wallet / import buttons … */}
        <div className="container mx-auto flex justify-center">
          <div className="text-center px-4">
            <Link to="/" className="text-3xl font-bold text-white mb-4 inline-block">
              Swift<span className="text-green">Aza</span>
            </Link>
            <p className="text-lg text-gray-300 mb-12">
              Create a wallet or add an existing wallet
            </p>
            <div className="mt-32" />
            <div className="flex flex-col md:flex-row gap-2 justify-center ">
              <Link
                to="/auth/createpin"
                className="bg-green-500 text-white font-bold px-6 py-4 rounded-lg shadow hover:shadow-lg transition"
                style={{ minWidth: 250, maxWidth: 300 }}
              >
                Create Wallet
              </Link>
              <button
                onClick={() => setShowSelector(true)}
                className="bg-primary-color-4 text-green font-bold px-6 py-4 rounded-lg shadow hover:shadow-lg transition"
                style={{ minWidth: 250, maxWidth: 300 }}
              >
                Import Wallet
              </button>
            </div>
          </div>
        </div>

        {showImportSelectionModal && (
          <div className="fixed top-0 inset-0 z-50 flex items-center justify-center bg-blueGray-600 h-screen w-full">
            <div className="bg-primary-color rounded-lg p-6 w-[400px] h-150-px max-w-md mb-16 mx-auto justify-center" style={{ margin: "10px" }}>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSelector(false)}
                  className="px-4 py-2 text-lg font-medium text-white font-bold focus:outline-none"
                >
                  X
                </button>
              </div>
              <h3 className="text-2xl text-center font-bold text-white mb-4">
                Import Wallet
              </h3>
              <p className="text-sm text-center text-gray-500 mb-6">
                Choose from the options below
              </p>

              <div className="flex flex-row gap-3 justify-between mx-auto mx-4 mb-8">
                <button
                  onClick={() => {
                    setShowSelector(false);
                    openImport(12);
                  }}
                  className="text-white text-center font-bold px-6 py-3 mt-4 rounded-md outline-none focus:outline-none bg-black text-sm sm:text-base shadow hover:shadow-lg ease-linear transition-all duration-150"
                  style={{ border: "1px solid #27C499" }}
                >
                  Import Wallet (12)<br />
                  <span className="text-xs font-normal">
                    Import Wallet with 12 secret recovery words
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowSelector(false);
                    openImport(24);
                  }}
                  className="text-white text-center font-bold px-6 py-3 mt-4 rounded-md outline-none focus:outline-none bg-black text-sm sm:text-base shadow hover:shadow-lg ease-linear transition-all duration-150"
                  style={{ border: "1px solid #27C499" }}
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
        {showImportModal && (
          <ImportWalletModal
            wordCount={wordCount}
            seedWords={seedWords}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handleContinue={handleContinue}
            onClose={() => setShowImportModal(false)}
          />
        )}
      </section>
    </>
  );
}
