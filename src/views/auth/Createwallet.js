import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import CryptoJS from "crypto-js";
import { useState } from "react";

export default function CreateWallet() {
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    const decryptSeed = (encryptedSeed, pin, salt, iv) => {
        const key = CryptoJS.PBKDF2(pin, CryptoJS.enc.Hex.parse(salt), {
            keySize: 256 / 32,
            iterations: 1000,
        });

        const decrypted = CryptoJS.AES.decrypt(encryptedSeed, key, {
            iv: CryptoJS.enc.Hex.parse(iv),
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    };

    const generateWallet = async () => {
        const encryptedSeed = sessionStorage.getItem("encryptedWalletSeed");
        const salt = sessionStorage.getItem("walletSalt");
        const iv = sessionStorage.getItem("walletIV");
        const pin = sessionStorage.getItem("walletPin");

        if (!encryptedSeed || !salt || !iv || !pin) return;

        const seedPhrase = decryptSeed(encryptedSeed, pin, salt, iv);
        const response = await fetch("https://swift-api-g7a3.onrender.com/api/wallet/generate_wallet/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phrase: seedPhrase }),
        });

        const result = await response.json();
        localStorage.setItem("walletAddresses", JSON.stringify(result.data));
        history.push("/admin/dashboard");
    };

    useEffect(() => {
        generateWallet();
    }, []);

    const handleTryAgain = () => {
        history.push("/auth/createwallet");
    }

    return (
        <div className="container mx-auto px-4 h-screen flex items-center justify-center" style={{ maxHeight: "100vh", overflow: "hidden" }}>
            <div className="relative flex flex-col w-full lg:w-6/12 px-4">
                <div className="bg-white rounded-my shadow-lg p-8">
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
                                    <div className="bar" style={{ height: "12px", width: "60px", marginTop: "-4px"  }}></div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 square-bar-container">
                                <div className="square w-8 h-8"></div>
                                <div className="flex flex-col">
                                    <div className="bar" style={{ height: "12px", width: "50px" }}></div>
                                    <div className="bar" style={{ height: "14px", width: "70px", marginTop: "-4px"  }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center gap-4">
                        {loading ? (
                            <p className="text-gray-600 mt-4 text-blueGray-500 semibold">Generating wallet address...</p>
                            ) : (
                            <p className="text-gray-600 mt-4 text-blueGray-500 semibold">
                                Generate Wallet Address
                            </p>
                        )}
                        <a className="mt-4 text-blueGray-500 font-semibold p-3 rounded-my" onClick={handleTryAgain}>
                            Try Again
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
