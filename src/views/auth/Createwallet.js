// CreateWallet.js
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import LoadingInterface from "../../components/Cards/LoadingInterface";

export default function CreateWallet() {
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const generateWallet = async (phrase) => {
        try {
            const response = await fetch("https://swift-api-g7a3.onrender.com/api/wallet/generate_wallet/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phrase,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error details:", errorData);
                throw new Error("Failed to create wallet");
            }

            const walletData = await response.json();
            console.log("Wallet created successfully:", walletData);

            const details = {
                walletAddresses: walletData.data,
                seedWords: phrase.split(" "),
            };
            localStorage.setItem("walletDetails", JSON.stringify(details));

            return true;
        } catch (error) {
            console.error("Error generating wallet:", error);
            return false;
        }
    };

    const handleNext = async () => {
        setLoading(true);

        try {
            const phraseResponse = await fetch("https://swift-api-g7a3.onrender.com/api/wallet/phrase/", {
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

            const success = await generateWallet(phrase);

            setLoading(false);

            if (success) {
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

    useEffect(() => {
        handleNext();
    }, []);

    return (
        <div className="container mx-auto px-4 flex items-center justify-center" style={{ height: "500px", overflow: "hidden" }}>
            <div className="relative flex flex-col w-full lg:w-6/12 px-4 top-20">
                <div className="bg-white rounded-my shadow-lg p-8">
                    <LoadingInterface loading={loading} />
                    <div className="text-center gap-4">
                        {loading ? (
                            <p className="text-gray-600 mt-4 text-blueGray-500 semibold">Generating wallet address...</p>
                        ) : (
                            <p className="text-gray-600 mt-4 text-blueGray-500 semibold">
                                Generate Wallet Address
                            </p>
                        )}
                        <a className="mt-4 text-blueGray-500 font-semibold p-3 rounded-my" onClick={handleNext}>
                            Try Again
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}