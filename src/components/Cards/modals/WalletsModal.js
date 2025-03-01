import React from "react";
import { X as CloseIcon } from 'lucide-react';
import { useSelector } from "react-redux";

const Modal = ({ isOpen, onClose, children }) => {
  const selectedWallet = useSelector((state) => state.wallet.selectedWallet);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 left-0 h-screen inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-lg overflow-auto min-h-[120vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between text-center items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-center w-full">{selectedWallet ? selectedWallet.abbr : 'Wallet Chart'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
