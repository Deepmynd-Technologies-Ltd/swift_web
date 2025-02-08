import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { PinContext } from "../../context/PinContext";

export default function SecureWallet() {
    const [walletDetails, setWalletDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { setWalletDetails: setContextWalletDetails } = useContext(PinContext);

    const generateWalletPhrase = async () => {
        setLoading(true);
        try {
            // Generate Wallet Phrase
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

            const details = {
                seedWords: phraseData.data.split(' '), // Split phrase into seed words
            };
            console.log('Wallet Details:', details);

            localStorage.setItem("walletDetails", JSON.stringify(details));
            setWalletDetails(details);
            setContextWalletDetails(details);
        } catch (error) {
            console.error("Phrase Generation Error:", error);
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
            generateWalletPhrase().catch(console.error);
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
        history.push("/auth/createwallet");
    };

    const { seedWords = [] } = walletDetails || {};

    return (
        <div
            className="container mx-auto h-screen flex items-center justify-center"
            style={{ maxHeight: "100vh", overflow: "hidden" }}
        >
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
                    <div className="container flex items-center justify-center">
                        <div className="text-center">
                            <p>Loading...</p>
                        </div>
                    </div>
                ) : (
                    <div className="border border-gray-200 rounded-lg p-4 relative">
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
                            <a
                                className="relative bottom-2 left-2 text-blue-500 flex"
                                onClick={() => copyToClipboard(seedWords.join(" "))}
                            >
                                <img
                                    src={require("../../assets/img/copy_image_1.png")}
                                    alt="Copy"
                                    className="relative"
                                    style={{ width: "20px", height: "20px" }}
                                />
                                <h3 className="text-sm font-semibold text-blue-500 ml-2">Copy</h3>
                            </a>
                        </div>
                    </div>
                )}
                <button
                    className="w-full mt-6 bg-green-500 text-white font-semibold p-3 rounded-my"
                    onClick={handleNext}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
