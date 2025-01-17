import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function Register() {
    const [pin, setPin] = useState(["", "", "", ""]);
    const history = useHistory();

    const handleNext = (e) => {
        e.preventDefault();
        history.push("/auth/securewallet");
    };

    const handleChange = (value, index) => {
        if (value.length > 1) return; // Prevent more than one character
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Move focus to the next input box
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
                    <h2 className="text-2xl font-semibold mb-4 text-green text-aeonik">
                        Verify Account
                    </h2>
                    <p className="text-sm text-blueGray-500 mb-6 font-semibold">
                        We need to verify your email, we promise this is the last step before your wallet creation.
                    </p>
                    <p className="text-xs text-black mb-6 font-semibold">
                        We sent a code to your email, enter it below!
                    </p>
                    <p className="text-sm text-blueGray-500">
                        Not your email?{" "}
                        <Link to="/auth/login" className="hover:underline text-green font-bold">
                            Change Email
                        </Link>
                    </p>

                    <form>
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
                                className="w-full mt-6 bg-green-500 text-white font-semibold p-3 rounded-my"
                                onClick={handleNext}
                            >
                                Create my Wallet
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-blueGray-500">
                            Didn't receive a code?{" "}
                            <Link to="/auth/login" className="hover:underline text-green font-bold">
                                Resend in 00:45
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
