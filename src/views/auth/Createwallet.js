import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function CreateWallet() {
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    // Function to create wallet using the separated implementation
    const generateWallet = async (phrase) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/wallet/generate_wallet/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phrase, // Wallet phrase passed as a parameter
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                throw new Error("Failed to create wallet");
            }

            const walletData = await response.json();
            console.log("Wallet created successfully:", walletData);

            // Store wallet details locally
            const details = {
                walletAddress: walletData.data[0].address,
                seedWords: phrase.split(" "),
            };
            localStorage.setItem("walletDetails", JSON.stringify(details));

            return true;
        } catch (error) {
            console.error("Error generating wallet:", error);
            return false;
        }
    };

    const handleNext = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Step 1: Fetch wallet phrase
            const phraseResponse = await fetch("http://127.0.0.1:8000/api/wallet/phrase/", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!phraseResponse.ok) {
                throw new Error("Failed to generate wallet phrase");
            }

            const phraseData = await phraseResponse.json();
            const phrase = phraseData.data;

            // Step 2: Generate wallet with the phrase
            const success = await generateWallet(phrase);

            setLoading(false);

            if (success) {
                alert("Wallet created successfully!");
                history.push("/admin/dashboard");
            } else {
                alert("Failed to create wallet. Please try again.");
            }
        } catch (error) {
            console.error("Error during wallet creation:", error);
            setLoading(false);
            alert("Failed to create wallet. Please try again.");
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
