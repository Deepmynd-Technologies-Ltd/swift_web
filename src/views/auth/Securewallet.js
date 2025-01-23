import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { PinContext } from "../../context/PinContext";

export default function SecureWallet() {
    const [walletDetails, setWalletDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { setWalletDetails: setContextWalletDetails } = useContext(PinContext);

    const generateWalletDetails = async () => {
        setLoading(true);
        try {
            // Step 1: Generate Wallet Phrase
            const phraseResponse = await fetch('http://127.0.0.1:8000/api/wallet/phrase/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!phraseResponse.ok) {
                throw new Error('Failed to generate wallet phrase');
            }

            const phraseData = await phraseResponse.json();
            console.log(phraseData.data);
            
            // Step 2: Generate Wallet using the Phrase
            const walletResponse = await fetch('http://127.0.0.1:8000/api/wallet/generate_wallet/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phrase: phraseData.data }) // Use .data for the actual phrase
            });

            if (!walletResponse.ok) {
                const errorData = await walletResponse.json();
                console.error('Wallet Generation Error Details:', errorData);
                throw new Error('Failed to generate wallet details');
            }

            const walletData = await walletResponse.json();

            const details = {
                walletAddress: walletData.data[0].address, // Adjust based on your backend response structure
                seedWords: phraseData.data.split(' '), // Split phrase into seed words
            };

            localStorage.setItem("walletDetails", JSON.stringify(details));
            setWalletDetails(details);
            setContextWalletDetails(details);
        } catch (error) {
            console.error("Wallet Generation Error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const details = JSON.parse(localStorage.getItem("walletDetails"));
        if (details) {
            setWalletDetails(details);
            setContextWalletDetails(details);
        } else {
            generateWalletDetails().catch(console.error);
        }
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => alert("Copied to clipboard"))
            .catch(() => alert("Failed to copy"));
    };

    const handleNext = () => {
        alert("Wallet secured!");
        history.push("/admin/dashboard");
    };

    const { walletAddress = "", seedWords = [] } = walletDetails || {};





    return (
        <div
            className="container mx-auto px-4 h-screen flex items-center justify-center"
            style={{ maxHeight: "100vh", overflow: "hidden" }}
        >
            <div className="relative flex flex-col w-full lg:w-6/12 px-4"></div>
                <div className="bg-white rounded-my shadow-lg p-8" style={{ width: "420px", overflowX: "hidden" }}>
                    <a
                        className="relative left-90 text-black text-3xl font-bold font-weight-900"
                        onClick={() => window.history.back()}
                    >
                        ←
                    </a>
                    <h2 className="text-2xl font-semibold mb-4 text-green text-aeonik">Wallet</h2>
                    <p className="text-sm text-blueGray-500 mb-6 font-semibold">
                        We have created your web3 Wallet, below is your wallet seed words.
                        Keep it safe and make sure you're the only one that have access to it.
                    </p>

                    <h3 className="text-sm font-semibold mt-4 mb-2 text-green-500">Seed Words</h3>
                    {loading ? (
                        <div className="container mx-auto px-4 h-screen flex items-center justify-center">
                            <div className="text-center">
                                <p>Loading...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-gray-200 rounded-lg p-4 relative">
                            <a
                                className="absolute top-2 right-2 text-blue-500"
                                onClick={() => copyToClipboard(seedWords.join(" "))}
                            >
                                <img
                                    src={require("../../assets/img/copy_image_1.png")}
                                    alt="Copy"
                                    className="relative"
                                    style={{ width: "20px", height: "20px", left: "300px", bottom: "10px" }}
                                />
                            </a>

                            <div
                                className="grid grid-cols-4 gap-4 auto-rows-auto"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, 1fr)",
                                }}
                            >
                                {Array.isArray(seedWords) && seedWords.map((word, index) => (
                                    <div
                                        key={index}
                                        className="p-2 text-center bg-gray-50 rounded"
                                        style={{
                                            minWidth: "60px",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <span className="text-sm text-gray-700">{word}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}       
                    <button
                        className="w-full mt-6 bg-green-500 text-white font-semibold p-3 rounded-my"
                        onClick={handleNext}
                    >
                        Secure my Wallet
                    </button>
                </div>
        </div>
    );
}
