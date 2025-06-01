import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { 
    storeEncryptedWallet, 
    storeEncryptedPin,
    getEncryptedWallet
} from "../../views/auth/utils/storage";
import localforage from "localforage";

export default function CreateWallet() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [existingWallet, setExistingWallet] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const { phrase, pin: pinFromLocation } = location.state || {};

    // Check for existing wallet
    const checkExistingWallet = async () => {
        try {
            const wallet = await localforage.getItem('encryptedWallet');
            const pin = await localforage.getItem('walletPin');
            return !!wallet || !!pin;
        } catch (err) {
            console.error("Error checking for existing wallet:", err);
            return false;
        }
    };

    const handleWalletCreation = async () => {
        if (!phrase) {
            setError("Missing seed phrase");
            setLoading(false);
            return;
        }
        if (!pinFromLocation) {
            setError("PIN not available");
            setLoading(false);
            return;
        }
        
        await generateWallet(pinFromLocation);
    };

    const generateWallet = async (currentPin) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log("Starting wallet generation...");
            const response = await fetch("https://swift-api-g7a3.onrender.com/api/wallet/generate_wallet/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phrase }),
            });

            if (!response.ok) throw new Error("Failed to create wallet");

            const walletData = await response.json();
            console.log("Raw wallet data from API:", walletData);

            // Clear any existing data first
            await localforage.removeItem('encryptedWallet');
            await localforage.removeItem('walletPin');

            console.log("Storing encrypted data...");
            await storeEncryptedPin(currentPin);
            
            let storageSuccess = false;
            try {
                storageSuccess = await storeEncryptedWallet(walletData, currentPin);
            } catch (storageError) {
                console.log("Initial storage failed, trying alternative format...");
                if (walletData.data) {
                    storageSuccess = await storeEncryptedWallet(walletData.data, currentPin);
                } else {
                    throw storageError;
                }
            }

            if (!storageSuccess) throw new Error("Failed to store wallet data");
            
            history.push("/admin/dashboard");
        } catch (err) {
            console.error("Error generating wallet:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleOverwrite = async () => {
        // User chose to overwrite existing wallet
        await handleWalletCreation();
    };

    const handleLoginRedirect = () => {
        // User chose to login to existing wallet
        history.push("/auth/login");
    };

    useEffect(() => {
        const init = async () => {
            try {
                const hasExistingWallet = await checkExistingWallet();
                if (hasExistingWallet) {
                    setExistingWallet(true);
                    setLoading(false);
                } else {
                    // No existing wallet, proceed with creation
                    await handleWalletCreation();
                }
            } catch (err) {
                console.error("Initialization error:", err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        init();
    }, []);

    if (existingWallet) {
        return (
            <div className="container mx-auto px-4 h-screen flex items-center justify-center" style={{ maxHeight: "100vh", overflow: "hidden" }}>
                <div className="relative flex flex-col w-full lg:w-7/12 px-4" style={{maxWidth: "400px"}}>
                    <div className="bg-black rounded-my shadow-lg p-4">
                        {/* Header with icon */}
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/20 mb-4">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-6 w-6 text-blue-400" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Wallet Already Exists</h2>
                            <p className="text-gray-300 text-xs md:text-base">
                                We found an existing wallet in your browser storage. Would you like to login to the wallet or delete and create another wallet
                            </p>
                        </div>
    
                        {/* Content */}
                        <div className="px-6 pb-6 mt-4">                            
                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={handleLoginRedirect}
                                    className="flex-1 flex items-center justify-center p-3 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg shadow hover:shadow-green-500/30 transition-all duration-300"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5 mr-2" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>
                                    Login
                                </button>
    
                                <button
                                    onClick={handleOverwrite}
                                    className="flex-1 flex items-center justify-center p-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow hover:shadow-red-500/30 transition-all duration-300"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5 mr-2" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path 
                                            fillRule="evenodd" 
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                                            clipRule="evenodd" 
                                        />
                                    </svg>
                                    Delete & Continue
                                </button>
                            </div>
                        </div>
    
                        {/* Footer note */}
                        <div className="px-6 pb-6 text-center">
                            <p className="text-xs text-gray-500">
                                Note: Deleting will permanently remove your current wallet from this device.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 h-screen flex items-center justify-center" style={{ maxHeight: "100vh", overflow: "hidden" }}>
            <div className="relative flex flex-col w-full lg:w-6/12 px-4">
                <div className="bg-black rounded-my shadow-lg p-8">
                    <div className="flex justify-center items-center">
                        <div className="loader items-center">
                        <div className="flex flex-row gap-2 square-bar-container">
                            <div className="square w-5 h-5"></div>
                                <div className="flex flex-col">
                                    <div className="bar" style={{ height: "8px", width: "30px" }}></div>
                                    <div className="bar" style={{ height: "10px", width: "40px", marginTop: "-4px" }}></div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 square-bar-container">
                                <div className="square w-6 h-6"></div>
                                <div className="flex flex-col">
                                    <div className="bar" style={{ height: "10px", width: "40px" }}></div>
                                    <div className="bar" style={{ height: "12px", width: "60px", marginTop: "-4px" }}></div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 square-bar-container">
                                <div className="square w-8 h-8"></div>
                                <div className="flex flex-col">
                                    <div className="bar" style={{ height: "12px", width: "50px" }}></div>
                                    <div className="bar" style={{ height: "14px", width: "70px", marginTop: "-4px" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center gap-4">
                        {loading ? (
                            <p className="text-gray-600 mt-4 text-blueGray-500 semibold">Creating your wallet...</p>
                        ) : error ? (
                            <>
                                <p className="text-gray-600 mt-4 text-blueGray-500 semibold">Error: {error}</p>
                                <button 
                                    className="mt-4 bg-green-500 text-white font-semibold p-3 rounded-my"
                                    onClick={handleWalletCreation}
                                >
                                    Try Again
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}