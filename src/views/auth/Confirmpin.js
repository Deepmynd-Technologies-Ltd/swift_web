import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function ConfirmPin() {
    const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const savedPin = localStorage.getItem("walletPin");
        if (savedPin) {
            setConfirmPin(savedPin.split(""));
        }
    }, []);

    const handleConfirm = () => {
        const confirmPinCode = confirmPin.join("");  
        const pin = localStorage.getItem("walletPin");  

        if (!pin) {
            setError("PIN is missing.");
            return;
        }

        if (confirmPinCode.length !== 4) {
            setError("PIN must be exactly 4 digits.");
            return;
        }

        if (confirmPinCode !== pin) {
            setError("PIN does not match.");
            return;
        }

        localStorage.setItem("walletPin2", confirmPinCode);
        console.log("Saved PIN:", confirmPinCode);

        history.push("/auth/securewallet");
    };

    const handleChange = (value, index) => {
        if (value.length > 1) return;  
        const newPin = [...confirmPin];
        newPin[index] = value;
        setConfirmPin(newPin);

        if (value && index < 3) {
            document.getElementById(`confirm-pin-input-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !confirmPin[index] && index > 0) {
            document.getElementById(`confirm-pin-input-${index - 1}`).focus();
        }
    };

    return (
        <div
            className="container mx-auto px-4 h-screen flex items-center justify-center"
            style={{ maxHeight: "100vh", overflow: "hidden" }}
        >
            <div className="relative flex flex-col w-full lg:w-6/12 px-4">
                <div className="bg-white rounded-my shadow-lg p-8">
                    <a
                        className="relative left-90 text-black text-3xl font-bold font-weight-900"
                        onClick={() => window.history.back()}
                    >
                        ←
                    </a>
                    <h2 className="text-2xl font-bold mb-4 text-green">
                        Confirm Wallet Pin
                    </h2>
                    <p className="text-sm text-blueGray-500 mb-6 font-semibold">
                        Sorry for the troubles, we just had to make sure you remember the pin.
                    </p>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4 mt-6">
                            <div className="flex space-x-6 justify-between">
                                {confirmPin.map((value, index) => (
                                    <input
                                        key={index}
                                        id={`confirm-pin-input-${index}`}
                                        type="password"
                                        value={value}
                                        maxLength="1"
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="w-12 h-12 border border-gray-300 text-center text-lg rounded-lg focus:ring focus:outline-none"
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                className="w-full mt-6 bg-green-500 text-white font-semibold p-3 rounded-my"
                                onClick={handleConfirm}
                            >
                                Continue
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
