import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import LineChart from "../charts/LineChart";
import BarChart from "../charts/BarChart";

const Stats = () => {
  const navigate = useNavigate();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  return (
    <div className="w-full h-screen flex flex-col bg-[#f0faf0]">
      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header bar — back button + title in their own row */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#c8e6c9] bg-white/60">
          <button
            onClick={() => navigate("/dashboard")}
            aria-label="Go back"
            className="
              w-9 h-9 shrink-0 flex items-center justify-center
              rounded-full bg-white border-2 border-[#4caf50]
              text-[#2e7d32] hover:bg-[#4caf50] hover:text-white
              shadow-sm transition-all duration-200
              hover:scale-110 active:scale-95
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#2e7d32] leading-tight">Statistics</h1>
            <p className="text-xs text-gray-400 font-medium">Financial overview</p>
          </div>
        </div>

        {/* Charts grid */}
        <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-auto">

          {/* Line Chart card */}
          <div className="flex flex-col rounded-2xl overflow-hidden shadow-md border border-[#c8e6c9] bg-white min-h-[300px]">
            <div className="bg-gradient-to-r from-[#4caf50] to-[#2e7d32] px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l4-8 4 4 4-6 4 3" />
              </svg>
              <h2 className="text-white font-semibold text-sm tracking-wide">Daily Spending Trend</h2>
            </div>
            <div className="flex-1 p-3">
              <LineChart year={year} month={month} />
            </div>
          </div>

          {/* Bar Chart card */}
          <div className="flex flex-col rounded-2xl overflow-hidden shadow-md border border-[#c8e6c9] bg-white min-h-[300px]">
            <div className="bg-gradient-to-r from-[#4caf50] to-[#2e7d32] px-4 py-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M9 17V9m4 8V5m4 12v-4" />
              </svg>
              <h2 className="text-white font-semibold text-sm tracking-wide">Yearly Debit vs Credit</h2>
            </div>
            <div className="flex-1 p-3">
              <BarChart />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Stats;
