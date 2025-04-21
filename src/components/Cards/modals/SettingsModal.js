import React, { useState } from "react";
import { X, ChevronRight, ChevronDown, LogOut } from "lucide-react";

const SettingsModal = ({ isOpen, onClose }) => {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [secureWithPasscode, setSecureWithPasscode] = useState(false);
  const [secureWithFaceID, setSecureWithFaceID] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="bg-black h-screen w-full z-10 flex justify-center items-center" 
    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
      <div
        className="relative p-4 z-10 shadow-lg flex flex-col no-scrollbar"
        style={{ 
          maxWidth: "446px", 
          maxHeight: "1169px",
          width: "100%", 
          height: "90vh",
          background: "#F7FAFE", 
          borderRadius: "24px",
          overflowY: "auto" 
        }}
      >
        {/* Handle bar */}
        <div className="flex items-center justify-center w-full pt-4">
          <div className="bg-gray-400 rounded" style={{ height: "4px", width: "100px" }}></div>
        </div>
        
        {/* Header */}
        <div className="flex justify-between items-center w-full px-6 py-4">
          <h2 className="text-3xl text-aeonik font-bold text-black">Settings</h2>
          <button
            className="absolute top-2 text-blueGray-500 hover:text-gray-700"
            onClick={onClose}
            style={{ right: "30px" }}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        
        <div className="flex flex-col px-6 pb-6">
          {/* General Section */}
          <div className="text-gray-500 mb-4">General</div>
          
          {/* Currency */}
          <div className="flex justify-between items-center mb-6 font-bold">
            <div className="text-lg text-black">Currency</div>
            <div className="flex items-center bg-primary-color-4 rounded-lg px-4 py-2">
              <span className="font-medium mr-2">NGN</span>
              <ChevronDown size={20} />
            </div>
          </div>
          
          {/* Push Notifications */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg text-black font-bold">Push notifications</div>
            <div 
              className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer ${pushNotifications ? 'bg-green-500 justify-end' : 'bg-primary-color-4 justify-start'}`}
              onClick={() => setPushNotifications(!pushNotifications)}
            >
              <div className="w-5 h-5 bg-black rounded-full shadow"></div>
            </div>
          </div>
          
          {/* Search Engine */}
          <div className="flex justify-between items-center mb-6 font-bold">
            <div className="text-lg text-black">Search Engine</div>
            <div className="flex items-center bg-primary-color-4 rounded-lg px-4 py-2">
              <span className="font-medium mr-2">Google</span>
              <ChevronDown size={20} />
            </div>
          </div>
          
          {/* Language */}
          <div className="flex justify-between items-center mb-6 font-bold">
            <div className="text-lg text-black">Language</div>
            <div className="flex items-center bg-primary-color-4 rounded-lg px-4 py-2">
              <span className="font-medium mr-2">English</span>
              <ChevronDown size={20} />
            </div>
          </div>
          
          {/* Payment Timeout */}
          <div className="flex justify-between items-center mb-6 font-bold">
            <div className="text-lg text-black">Payment Timeout</div>
            <div className="text-lg text-black">15 minutes</div>
          </div>
          
          {/* Security Section */}
          <div className="text-gray-500 mb-4">Security</div>
          
          {/* Backup */}
          <div className="flex justify-between items-center mb-4 py-2 font-bold">
            <div className="text-lg text-black">Backup</div>
            →
          </div>
          <div className="border-b border-gray-200 mb-4"></div>
          
          {/* Recovery phrase notice */}
          <div className="text-gray-500 mb-4">
            Your secret 12-word recovery phrase is the ONLY way to recover your funds if you lose access to your wallet.
          </div>
          
          {/* Secure with Passcode */}
          <div className="flex justify-between items-center mb-4 py-2 font-bold">
            <div className="text-lg text-black">Secure with Passcode</div>
            <div 
              className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer ${secureWithPasscode ? 'bg-green-500 justify-end' : 'bg-primary-color-4 justify-start'}`}
              onClick={() => setSecureWithPasscode(!secureWithPasscode)}
            >
              <div className="w-5 h-5 bg-black rounded-full shadow"></div>
            </div>
          </div>
          <div className="border-b border-gray-200 mb-4"></div>
          
          {/* Passcode protection info */}
          <div className="text-gray-500 mb-4">
            Keep your assets safe by enabling passcode protection.
          </div>
          
          {/* Secure with Face ID */}
          <div className="flex justify-between items-center mb-4 py-2 font-bold">
            <div className="text-lg text-black">Secure with Face ID</div>
            <div 
              className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer ${secureWithFaceID ? 'bg-green-500 justify-end' : 'bg-primary-color-4 justify-start'}`}
              onClick={() => setSecureWithFaceID(!secureWithFaceID)}
            >
              <div className="w-5 h-5 bg-black rounded-full shadow"></div>
            </div>
          </div>
          <div className="border-b border-gray-200 mb-4"></div>
          
          {/* Face ID info */}
          <div className="text-gray-500 mb-6">
            Add a passcode to activate Face ID protection.
          </div>
          
          {/* Company Section */}
          <div className="text-gray-500 mb-4">Comapany</div>
          
          {/* FAQ */}
          <div className="flex justify-between items-center mb-4 py-2">
            <div className="text-lg text-black font-bold">FAQ</div>
            →
          </div>
          <div className="border-b border-gray-200 mb-4"></div>
          
          {/* Support */}
          <div className="flex justify-between items-center mb-4 py-2">
            <div className="text-lg text-black font-bold">Support</div>
            →
          </div>
          <div className="border-b border-gray-200 mb-4"></div>
          
          {/* Contact Us */}
          <div className="flex justify-between items-center mb-4 py-2">
            <div className="text-lg text-black font-bold">Contact Us</div>
            →
          </div>
          <div className="border-b border-gray-200 mb-4"></div>
          
          {/* Rate SwiftAza */}
          <div className="flex justify-between items-center mb-4 py-2">
            <div className="text-lg text-black font-bold">Rate SwiftAza</div>
            →
          </div>
          <div className="border-b border-gray-200 mb-4"></div>
          
          {/* Privacy Policy */}
          <div className="flex justify-between items-center mb-8 py-2">
            <div className="text-lg text-black font-bold">Privacy Policy</div>
            →
          </div>
          
          {/* Sign Out */}
          <div className="flex justify-center items-center text-red-500 py-2 cursor-pointer justify-between">
            <span className="text-lg font-bold">Sign Out Wallet</span>
            <LogOut size={18} className="mr-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;