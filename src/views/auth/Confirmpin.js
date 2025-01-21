import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { PinContext } from "../../context/PinContext";
// import { generateMnemonic } from 'bip39'; // Import generateMnemonic from bip39

export default function ConfirmPin() {
    const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
    const [error, setError] = useState(null);
    const history = useHistory();
    const { setWalletDetails } = useContext(PinContext);

    const generateWalletDetails = () => {
        const walletAddress = `0x${Math.random().toString(36).substring(2, 15)}`;
        const seedWords = Array.from({ length: 12 }, () =>
            Math.random().toString(36).substring(2, 8)
        );
        return { walletAddress, seedWords };
    };


    // const generateWalletDetails = async () => {
    //     const walletResponse = await fetch('/api/generate_wallet/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });

    //     if (!walletResponse.ok) {
    //         throw new Error('Failed to generate wallet details');
    //     }

    //     const walletData = await walletResponse.json();
    //     const phraseResponse = await fetch('/api/phrase/', {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });

    //     if (!phraseResponse.ok) {
    //         throw new Error('Failed to generate wallet phrase');
    //     }

    //     const phraseData = await phraseResponse.json();
    //     return {
    //         walletAddress: walletData[0].address,
    //         seedWords: phraseData.phrase.split(' '),
    //     };
    // };

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
        // Generate wallet details locally
        try {
            const walletDetails = generateWalletDetails();
            // Save wallet details to context or localStorage
            setWalletDetails(walletDetails);
            localStorage.setItem("walletDetails", JSON.stringify(walletDetails));
            history.push("/auth/securewallet");
        } catch (error) {
            setError(error.message);
        }
        // Remove redundant code
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
                    <h2 className="text-2xl font-semibold mb-4 text-green text-aeonik">
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
