// CreateWallet.js
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export default function CreateWallet() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();
    const location = useLocation();
    const phrase = location.state?.phrase;

    const generateWallet = async () => {
        setLoading(true);
        setError(null);
        
        try {
            if (!phrase) {
                throw new Error("Missing seed phrase");
            }

            const response = await fetch("https://swift-api-g7a3.onrender.com/api/wallet/generate_wallet/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phrase }),
            });

            if (!response.ok) {
                throw new Error("Failed to create wallet");
            }

            const walletData = await response.json();
            console.log("Wallet created successfully:", walletData);
            history.push("/admin/dashboard");
        } catch (err) {
            console.error("Error generating wallet:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (phrase) {
            generateWallet();
        } else {
            setError("Missing seed phrase");
            setLoading(false);
        }
    }, [phrase]);

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