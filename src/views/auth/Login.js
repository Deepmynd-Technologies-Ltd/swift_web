import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import localforage from "localforage";
import CryptoJS from "crypto-js";

export default function Login() {
    const [pin, setPin] = useState(["", "", "", ""]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    // Internal encryption function
    const encryptData = (data, key) => {
        try {
            const encrypted = CryptoJS.AES.encrypt(data, key).toString();
            return encrypted;
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error('Failed to encrypt data');
        }
    };

    // Internal decryption function
    const decryptData = (encryptedData, key) => {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
            return decrypted;
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Failed to decrypt data');
        }
    };

    // Migrate old PIN format if needed
    const migrateOldPin = async (enteredPin) => {
        try {
            // Check for old format (direct encrypted string)
            const oldPin = await localforage.getItem('walletPin');
            if (typeof oldPin === 'string') {
                // Decrypt old format
                const decryptedPin = decryptData(oldPin, enteredPin);
                
                if (decryptedPin === enteredPin) {
                    // Convert to new format
                    await localforage.setItem('walletPin', {
                        pin: encryptData(enteredPin, enteredPin),
                        timestamp: Date.now()
                    });
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Migration error:', error);
            return false;
        }
    };

    const handleLogin = async () => {
        const pinCode = pin.join("");

        // Clear previous errors
        setError(null);

        // Validate PIN format first
        if (pinCode.length !== 4 || !/^\d+$/.test(pinCode)) {
            setError("PIN must be exactly 4 digits (numbers only)");
            return;
        }

        setLoading(true);

        try {
            const storedPinData = await localforage.getItem('walletPin');
            
            // If no PIN found in new format, try migrating old format
            if (!storedPinData) {
                const migrationSuccess = await migrateOldPin(pinCode);
                if (!migrationSuccess) {
                    setError("No PIN found. Please set up a new PIN.");
                    return;
                }
                // After migration, get the newly stored data
                storedPinData = await localforage.getItem('walletPin');
            }

            // Handle case where storedPinData might still be a string (migration failed)
            if (typeof storedPinData === 'string') {
                setError("PIN format corrupted. Please reset your PIN.");
                return;
            }


            const oneDay = 24 * 60 * 60 * 1000;
            const isSessionValid = storedPinData.timestamp && 
                                 (Date.now() - storedPinData.timestamp) < oneDay;

            if (!isSessionValid) {
                setError("Session expired. Please Import Wallet again");
                return;
            }

            // Verify PIN
            const decryptedPin = decryptData(storedPinData.pin, pinCode);
            
            if (decryptedPin !== pinCode) {
                setError("Incorrect PIN. Please try again.");
                return;
            }

            // Update session timestamp
            await localforage.setItem('walletPin', {
                ...storedPinData,
                timestamp: Date.now()
            });

            history.push("/admin/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError("Failed to verify PIN. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value, index) => {
        // Only allow numeric input
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length > 1) return;

        const newPin = [...pin];
        newPin[index] = numericValue;
        setPin(newPin);

        if (numericValue && index < 3) {
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
                <div className="bg-black rounded-my shadow-lg p-8">
                    <a className="relative left-90 text-white text-3xl font-bold" onClick={() => window.history.back()}>←</a>
                    <h2 className="text-2xl font-bold mb-4 text-green">Enter Passcode</h2>
                    <p className="text-sm text-blueGray-500 mb-6 font-semibold">Passcode is required for security means</p>
                    
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}>
                        <div className="space-y-4 mt-6">
                            <div className="flex space-x-6 justify-between">
                                {pin.map((value, index) => (
                                    <input
                                        key={index}
                                        id={`pin-input-${index}`}
                                        type="password"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        value={value}
                                        maxLength="1"
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="w-12 h-12 border border-gray-300 bg-black text-white text-center text-lg rounded-lg focus:ring focus:outline-none"
                                        disabled={loading}
                                        autoComplete="off"
                                    />
                                ))}
                            </div>
                            <button 
                                type="submit" 
                                className="w-full mt-6 bg-green-500 text-white text-dark-mode-1 font-semibold p-3 rounded-my disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Login"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}