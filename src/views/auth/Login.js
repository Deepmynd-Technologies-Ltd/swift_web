import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import CryptoJS from "crypto-js";

export default function Login() {
    const [pin, setPin] = useState(["", "", "", ""]);
    const [error, setError] = useState(null);
    const history = useHistory();

    const deriveKey = (pin, salt) => {
        return CryptoJS.PBKDF2(pin, CryptoJS.enc.Hex.parse(salt), {
            keySize: 256 / 32,
            iterations: 1000,
        });
    };

    const decryptSeed = (encryptedSeed, key, iv) => {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedSeed, key, {
                iv: CryptoJS.enc.Hex.parse(iv),
            });
            const seed = decrypted.toString(CryptoJS.enc.Utf8);
            return seed;
        } catch (error) {
            return null;
        }
    };

    const handleLogin = () => {
        const pinCode = pin.join("");

        if (pinCode.length !== 4) {
            setError("PIN must be exactly 4 digits.");
            return;
        }

        const encryptedSeed = sessionStorage.getItem("encryptedWalletSeed");
        const salt = sessionStorage.getItem("walletSalt");
        const iv = sessionStorage.getItem("walletIV");

        if (!encryptedSeed || !salt || !iv) {
            setError("Wallet data is missing. Please create a wallet again.");
            return;
        }

        const key = deriveKey(pinCode, salt);
        const seed = decryptSeed(encryptedSeed, key, iv);
        console.log(seed)

        if (!seed) {
            setError("Incorrect PIN.");
            return;
        }

        // Optional: You can fetch wallet info here using seed
        history.push("/admin/dashboard");
    };

    const handleChange = (value, index) => {
        if (value.length > 1) return;
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        if (value && index < 3) {
            document.getElementById(`pin-input-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            document.getElementById(`pin-input-${index - 1}`).focus();
        }
    };

    return (
        <div className="container mx-auto px-4 h-screen flex items-center justify-center" style={{ maxHeight: "100vh", overflow: "hidden" }}>
            <div className="relative flex flex-col w-full lg:w-6/12 px-4">
                <div className="bg-white rounded-my shadow-lg p-8">
                    <a className="relative left-90 text-black text-3xl font-bold" onClick={() => window.history.back()}>←</a>
                    <h2 className="text-2xl font-bold mb-4 text-green">Enter Passcode</h2>
                    <p className="text-sm text-blueGray-500 mb-6 font-semibold">Passcode is required for security</p>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4 mt-6">
                            <div className="flex space-x-6 justify-between">
                                {pin.map((value, index) => (
                                    <input
                                        key={index}
                                        id={`pin-input-${index}`}
                                        type="tel"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        value={value ? "•" : ""}
                                        maxLength="1"
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="w-12 h-12 border border-gray-300 text-center text-lg rounded-lg focus:ring focus:outline-none"
                                    />
                                ))}
                            </div>
                            <button type="button" className="w-full mt-6 bg-green-500 text-white font-semibold p-3 rounded-my" onClick={handleLogin}>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
