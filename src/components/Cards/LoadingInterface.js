// LoadingInterface.js
import React from "react";

const LoadingInterface = ({ loading }) => (
    loading ? (
        <div className="container mx-auto px-4 flex items-center justify-center" style={{ maxHeight: "100vh", overflow: "hidden" }}>
            <div className="relative flex flex-col w-full lg:w-6/12 px-4">
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
                                <div className="bar" style={{ height: "12px", width: "60px", marginTop: "-4px" }}></div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 square-bar-container">
                            <div className="square w-8 h-8"></div>
                            <div className="flex flex-col">
                                <div className="bar" style={{ height: "12px", width: "50px" }}></div>
                                <div className="bar" style={{ height: "14px", width: "70px", marginTop: "-4px" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null
);

export default LoadingInterface;