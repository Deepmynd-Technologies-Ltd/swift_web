import React, { useState, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";

// Define reusable components
const SettingHeader = ({ title }) => (
  <div className="text-gray-500 mb-2 text-sm">{title}</div>
);

const ToggleSetting = ({ label, value, onChange, description }) => (
  <>
    <div className="flex justify-between items-center mb-2 py-1">
      <div className="text-base text-white">{label}</div>
      <div
        className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 ${value ? 'bg-green-500' : 'bg-primary-color-4'}`}
        onClick={onChange}
      >
        <div 
          className={`w-5 h-5 bg-black rounded-full shadow transition-transform duration-300 ${value ? 'transform translate-x-6' : ''}`}
        ></div>
      </div>
    </div>
    <div className="border-b border-gray-200 mb-2"></div>
    {description && <div className="text-gray-500 mb-2 text-sm">{description}</div>}
  </>
);

const DropdownSetting = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="flex justify-between items-center mb-4 text-white relative">
      <div className="text-base text-white">{label}</div>
      <div className="relative">
        <div 
          className="flex items-center bg-primary-color rounded-lg px-3 py-1 cursor-pointer" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-medium mr-1 text-sm">{value}</span>
          <ChevronDown size={16} />
        </div>
        
        {isOpen && (
          <div className="absolute justify-center items-center right-0 mt-2 w-28 bg-black border border-gray-700 rounded-lg shadow-lg z-10">
            {options.map((option, index) => (
              <div
                key={index}
                className={`px-3 py-1 cursor-pointer ${option === value ? 'bg-primary-color' : 'hover:bg-gray-700'}`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LinkSetting = ({ label, onClick }) => (
  <>
    <div className="flex justify-between items-center mb-2 py-1">
      <div className="text-base text-white">{label}</div>
      <span className="text-xl cursor-pointer" onClick={onClick}>→</span>
    </div>
    <div className="border-b border-gray-200 mb-2"></div>
  </>
);

const InfoSetting = ({ label, value }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="text-base text-white">{label}</div>
    <div className="text-base text-white">{value}</div>
  </div>
);

const SettingsModal = ({ isOpen, onClose }) => {
  // Define all settings state
  const [settings, setSettings] = useState({
    currency: "NGN",
    pushNotifications: false,
    searchEngine: "Google",
    language: "English",
    paymentTimeout: "15 minutes",
    secureWithPasscode: false,
    secureWithFaceID: false
  });

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  // Available options for dropdown settings
  const options = {
    currency: ["NGN", "USD", "EUR", "GBP", "CAD"],
    searchEngine: ["Google", "Bing", "DuckDuckGo", "Yahoo"],
    language: ["English", "French", "Spanish", "German", "Chinese"]
  };

  // Handlers for different setting types
  const handleToggle = (setting) => {
    // Special handling for push notifications
    if (setting === 'pushNotifications') {
      if (!settings.pushNotifications) {
        // Request permission when enabling
        if ("Notification" in window) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              setSettings({
                ...settings,
                pushNotifications: true
              });
              // Show a test notification
              new Notification("SwiftAza Notifications Enabled", {
                body: "You will now receive payment and security notifications",
                icon: "/favicon.ico" // Replace with your app icon
              });
            } else {
              // Permission denied, keep setting off
              alert("Notification permission denied. Please enable notifications in your browser settings.");
            }
          });
        } else {
          alert("Your browser doesn't support notifications");
        }
      } else {
        // Just disable if it was on
        setSettings({
          ...settings,
          pushNotifications: false
        });
      }
      return;
    }
    
    // Special handling for Face ID (requires passcode to be enabled first)
    if (setting === 'secureWithFaceID') {
      if (!settings.secureWithPasscode && !settings.secureWithFaceID) {
        alert("Please enable passcode protection first before activating Face ID");
        return;
      }
      
      if (!settings.secureWithFaceID) {
        // Check if Face ID is available
        if (window.FaceID || navigator.credentials) {
          // This is a simplified check - in a real app, you'd use proper biometric API
          setSettings({
            ...settings,
            secureWithFaceID: true
          });
        } else {
          alert("Face ID is not available on this device");
          return;
        }
      } else {
        setSettings({
          ...settings,
          secureWithFaceID: false
        });
      }
      return;
    }
    
    // Special handling for passcode
    if (setting === 'secureWithPasscode') {
      if (!settings.secureWithPasscode) {
        // Show passcode setup dialog when enabling
        const passcode = prompt("Please set up a 6-digit passcode:");
        if (passcode && passcode.length === 6 && !isNaN(passcode)) {
          // In a real app, you would hash this before storing
          localStorage.setItem('userPasscode', passcode);
          setSettings({
            ...settings,
            secureWithPasscode: true
          });
        } else {
          alert("Please enter a valid 6-digit passcode");
          return;
        }
      } else {
        // Verify current passcode before disabling
        const currentPasscode = prompt("Please enter your current passcode to disable:");
        const savedPasscode = localStorage.getItem('userPasscode');
        
        if (currentPasscode === savedPasscode) {
          localStorage.removeItem('userPasscode');
          // If we're disabling passcode, also disable Face ID
          setSettings({
            ...settings,
            secureWithPasscode: false,
            secureWithFaceID: false
          });
        } else {
          alert("Incorrect passcode");
          return;
        }
      }
      return;
    }
    
    // Default toggle behavior for other settings
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleDropdownChange = (setting, newValue) => {
    setSettings({
      ...settings,
      [setting]: newValue
    });
  };

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}...`);
    // Navigation logic would go here
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logging out...");
    // Perform clearing user session
    window.location.href = "/";
    onClose();
  }

  // Company links configuration
  const companyLinks = [
    { label: "FAQ", path: "/faq" },
    { label: "Support", path: "/support" },
    { label: "Contact Us", path: "/contact" },
    { label: "Rate SwiftAza", path: "/rate" },
    { label: "Privacy Policy", path: "/privacy" }
  ];

  if (!isOpen) return null;

  return (
    <div className="bg-blueGray-600 text-aeonik h-screen w-full z-10 flex justify-center items-center"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
      <div
        className="relative bg-black p-2 z-10 shadow-lg flex flex-col no-scrollbar"
        style={{
          maxWidth: "320px",
          maxHeight: "90vh",
          width: "100%",
          borderRadius: "16px",
          overflowY: "auto",
          height: "80vh",
        }}
      >
        {/* Handle bar */}
        <div className="flex items-center justify-center w-full pt-2">
          <div className="bg-gray-400 rounded" style={{ height: "2px", width: "60px" }}></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center w-full px-4 py-2">
          <h2 className="text-2xl text-aeonik text-white text-center sm:text-left">Settings</h2>
          <button
            className="absolute top-2 text-blueGray-500 hover:text-gray-700"
            onClick={onClose}
            style={{ right: "20px" }}
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="flex flex-col px-4 pb-4">
          {/* General Section */}
          <SettingHeader title="General" />

          <DropdownSetting
            label="Currency"
            value={settings.currency}
            options={options.currency}
            onChange={(value) => handleDropdownChange('currency', value)}
          />

          <ToggleSetting
            label="Push notifications"
            value={settings.pushNotifications}
            onChange={() => handleToggle('pushNotifications')}
          />

          <DropdownSetting
            label="Search Engine"
            value={settings.searchEngine}
            options={options.searchEngine}
            onChange={(value) => handleDropdownChange('searchEngine', value)}
          />

          <DropdownSetting
            label="Language"
            value={settings.language}
            options={options.language}
            onChange={(value) => handleDropdownChange('language', value)}
          />

          <InfoSetting
            label="Payment Timeout"
            value={settings.paymentTimeout}
          />

          {/* Security Section */}
          <SettingHeader title="Security" />

          <LinkSetting
            label="Backup"
            onClick={() => handleNavigation('/backup')}
          />

          <div className="text-gray-500 mb-2 text-sm">
            Your secret 12-word recovery phrase is the ONLY way to recover your funds if you lose access to your wallet.
          </div>

          <ToggleSetting
            label="Secure with Passcode"
            value={settings.secureWithPasscode}
            onChange={() => handleToggle('secureWithPasscode')}
            description="Keep your assets safe by enabling passcode protection."
          />

          <ToggleSetting
            label="Secure with Face ID"
            value={settings.secureWithFaceID}
            onChange={() => handleToggle('secureWithFaceID')}
            description="Add a passcode to activate Face ID protection."
          />

          {/* Company Section */}
          <SettingHeader title="Company" />

          {companyLinks.map((link, index) => (
            <LinkSetting
              key={index}
              label={link.label}
              onClick={() => handleNavigation(link.path)}
            />
          ))}

          {/* Sign Out */}
          <div className="flex justify-between items-center text-red-500 py-1 cursor-pointer" onClick={handleLogout}>
            <span className="text-base">Sign Out Wallet</span>
            <LogOut size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;