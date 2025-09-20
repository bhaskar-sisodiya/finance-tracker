import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LineChart from "../charts/LineChart";
import BarChart from "../charts/BarChart";

const Stats = () => {
  const navigate = useNavigate();
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Top bar */}
      <div className="w-full h-[7%] p-2 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="
    bg-gradient-to-r from-green-400 to-green-600
    text-white font-semibold
    px-2 sm:px-3 md:px-4
    py-1 sm:py-1.5 md:py-2
    rounded-md sm:rounded-lg
    shadow-md
    hover:from-green-500 hover:to-green-700
    hover:scale-105 transition-transform duration-200
    flex items-center gap-1 sm:gap-2
    text-xs sm:text-sm md:text-base
  "
        >
          <span className="text-sm sm:text-base md:text-lg">←</span> Back to
          Home
        </button>
      </div>

      {/* Charts container */}
      <div className="w-full h-[93%] bg-[#4caf50] p-2 flex flex-col lg:flex-row gap-2">
        {/* Mobile: stacked, Desktop: side-by-side */}
        <div className="flex-1 h-1/2 lg:h-full">
          <LineChart year={year} month={month} />
        </div>
        <div className="flex-1 h-1/2 lg:h-full">
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default Stats;
