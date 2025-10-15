import React from "react";

const Hovercard = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-sm p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-100">
                <h2 className="text-xl font-semibold text-gray-800">Hover Card</h2>
                <p className="mt-2 text-gray-600">
                    This is a simple hover card built with React and Tailwind CSS. Hover over it to see the effect!
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Learn More
                </button>
            </div>
        </div>
    );
};

export default Hovercard;
