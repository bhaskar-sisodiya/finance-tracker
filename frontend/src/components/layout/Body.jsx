import React from "react";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] w-full flex flex-col lg:flex-row items-center justify-center">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start p-6 lg:pl-20">
        <div className="w-full sm:w-4/5 text-center lg:text-left">
          <h2 className="font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Add & Categorize daily expense
          </h2>
          <p className="mt-4 text-base sm:text-lg lg:text-xl">
            Track, categorize, and manage your daily expenses effortlessly to
            keep your pocket money in check! 💰📊
          </p>
        </div>
        <button
          onClick={() => navigate("/register")}
          className="mt-6 px-6 py-3 text-lg sm:text-xl lg:text-2xl font-bold rounded-md border-2 bg-black hover:bg-white text-white hover:text-black transition-all duration-150"
        >
          Register Now
        </button>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
        <img
          className="w-3/4 sm:w-2/3 max-w-md"
          src="/images/dashboard-modern.png"
          alt="Dashboard Preview"
        />
      </div>
    </div>
  );
};

export default Body;
