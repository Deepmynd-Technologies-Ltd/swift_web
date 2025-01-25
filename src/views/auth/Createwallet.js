import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function Register() {
    const [pin, setPin] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleNext = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await generateWallet();
        setLoading(false);
        if (success) {
            history.push("/admin/dashboard/");
        } else {
            alert("Failed to create wallet. Please try again.");
        }
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

    const generateWallet = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/wallet/generate_wallet/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pin: pin.join("") }),
            });
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error generating wallet:", error);
            return false;
        }
    };

    return (
        <div className="container mx-auto px-4 h-screen flex items-center justify-center" style={{ maxHeight: "100vh", overflow: "hidden" }}>
            <div className="relative flex flex-col w-full lg:w-6/12 px-4">
                <div className="bg-white rounded-my shadow-lg p-8">
                    {loading ? (
                        <div className="text-center">
                            <p className="text-lg font-semibold">Creating your wallet...</p>
                            <div className="loader mt-4"></div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-lg font-semibold">Failed to create wallet. Please try again.</p>
                            <button className="mt-4 bg-red-500 text-white font-semibold p-3 rounded-my" onClick={handleNext}>
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
