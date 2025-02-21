import React, { useState } from "react";

const DuckDuckGoSearch = () => {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
        window.open(searchUrl, "_blank");
    };

    return (
        <div className="w-full max-w-xl mx-auto p-4 mt-8 h-screen flex flex-col justify-between">
            <form onSubmit={handleSearch} className="relative mt-90 md:mt-0 order-2 md:order-none">
                <span
                    className="absolute mt-3 ml-4 text-gray-400 cursor-pointer"
                    onClick={handleSearch}
                >
                    <i className="fa fa-search"></i>
                </span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search or enter address"
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
            </form>
            <div className="flex-grow"></div>
        </div>
    );
};

export default DuckDuckGoSearch;
