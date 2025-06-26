import React from "react";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[80%] w-full flex">
      <div className="w-1/2 h-full flex flex-col justify-center items-center">
        <div className="w-4/5 text-center">
          <h2 className="font-semibold text-5xl">
            Add & Categorize daily expense
          </h2>
          <p className="text-xl">
            Track, categorize, and manage your daily expenses effortlessly to
            keep your pocket money in check! 💰📊
          </p>
        </div>
        <button
          onClick={() => navigate("/register")}
          className="mt-4 p-2 text-2xl font-bold rounded-md border-2 bg-black hover:bg-white text-white hover:text-black transition-all duration-75"
        >
          Register Now
        </button>
      </div>
      <div className="w-1/2 h-full flex flex-col justify-center items-center">
        <img className="w-2/3" src="/images/dashboard-modern.png" alt="" />
      </div>
    </div>
  );
};

export default Body;
