import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { storeEncryptedWallet, storeEncryptedPin } from "../../views/auth/utils/storage";

export default function CreateWallet() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();
    const location = useLocation();
    const { phrase, pin: pinFromLocation } = location.state || {}; // Destructure both values at once

    const generateWallet = async (currentPin) => {
        setLoading(true);
        setError(null);
        
        try {
            if (!phrase) throw new Error("Missing seed phrase");
            if (!currentPin) throw new Error("PIN not available");
    
            console.log("Starting wallet generation...");
            const response = await fetch("https://swift-api-g7a3.onrender.com/api/wallet/generate_wallet/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phrase }),
            });
    
            if (!response.ok) throw new Error("Failed to create wallet");
    
            const walletData = await response.json();
            console.log("Raw wallet data from API:", walletData); // Detailed log
            
            // Store both the wallet and PIN
            console.log("Storing encrypted data...");
            await storeEncryptedPin(currentPin);
            
            // Try to store the wallet data in different formats if needed
            let storageSuccess = false;
            try {
                storageSuccess = await storeEncryptedWallet(walletData, currentPin);
            } catch (storageError) {
                console.log("Initial storage failed, trying alternative format...");
                // Try storing just the data property if it exists
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

    useEffect(() => {
        // Check if we have all required data immediately
        if (phrase && pinFromLocation) {
            console.log("All data available, starting wallet generation"); // Debug log
            generateWallet(pinFromLocation);
        } else if (!phrase) {
            console.error("Missing seed phrase"); // Debug log
            setError("Missing seed phrase");
            setLoading(false);
        } else if (!pinFromLocation) {
            console.error("PIN not available"); // Debug log
            setError("PIN not available");
            setLoading(false);
        }
    }, [phrase, pinFromLocation]); // Depend on both values

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
                                    onClick={generateWallet}
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