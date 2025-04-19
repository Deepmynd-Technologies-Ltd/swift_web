import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { PinContext } from "../../context/PinContext";

export default function CreatePin() {
    const [pin, setPin] = useState(["", "", "", ""]);
    const history = useHistory();
    const [error, setError] = useState(null);
    const { setPin: setContextPin } = useContext(PinContext);

    const handleNext = () => {
        const pinCode = pin.join("");
        if (pinCode.length !== 4) return;

        const encryptedPin = btoa(pinCode);
        sessionStorage.setItem("walletPin", encryptedPin);
        setContextPin(pinCode);
        history.push("/auth/confirmpin");
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
        <div className="container mx-auto px-4 h-screen flex items-center justify-center">
            <div className="relative flex flex-col w-full lg:w-6/12 px-4">
                <div className="bg-white rounded-my shadow-lg p-8">
                    <a className="relative left-90 text-black text-3xl font-bold font-weight-900" onClick={() => window.history.back()}>
                        ←
                    </a>
                    <h2 className="text-2xl font-bold mb-4 text-green">Create Wallet Pin</h2>
                    <p className="text-sm text-blueGray-500 mb-6 font-semibold">
                        Create a pin for your wallet, this will also be used to perform transactions.
                    </p>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4 mt-6">
                            <div className="flex space-x-6 justify-between">
                                {pin.map((value, index) => (
                                    <input
                                        key={index}
                                        id={`pin-input-${index}`}
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
                                onClick={handleNext}
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
