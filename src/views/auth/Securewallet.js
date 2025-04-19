import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { PinContext } from "../../context/PinContext";
import CryptoJS from "crypto-js";

export default function SecureWallet() {
    const [seedWords, setSeedWords] = useState([]);
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const { setWalletDetails } = useContext(PinContext);

    const deriveKey = (pin, salt) => {
        return CryptoJS.PBKDF2(pin, salt, {
            keySize: 256 / 32,
            iterations: 1000,
        });
    };

    const encryptSeed = (seed, key, iv) => {
        return CryptoJS.AES.encrypt(seed, key, { iv }).toString();
    };

    const generateWalletPhrase = async () => {
        const pin = sessionStorage.getItem("walletPin");
        if (!pin) return;

        const salt = CryptoJS.lib.WordArray.random(16);
        const iv = CryptoJS.lib.WordArray.random(16);
        const key = deriveKey(pin, salt);

        const res = await fetch('https://swift-api-g7a3.onrender.com/api/wallet/phrase/');
        const { data: phrase } = await res.json();

        const encryptedSeed = encryptSeed(phrase, key, iv);

        sessionStorage.setItem("encryptedWalletSeed", encryptedSeed);
        sessionStorage.setItem("walletSalt", salt.toString());
        sessionStorage.setItem("walletIV", iv.toString());

        setSeedWords(phrase.split(" "));
        setWalletDetails({ seedWords: phrase.split(" "), seedPhrase: phrase });
        setLoading(false); // Set loading to false after seed generation is complete
    };

    useEffect(() => {
        generateWalletPhrase();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert("Copied to clipboard"))
            .catch(() => alert("Failed to copy"));
    };

    const handleNext = () => {
        history.push("/auth/createwallet");
    };

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
