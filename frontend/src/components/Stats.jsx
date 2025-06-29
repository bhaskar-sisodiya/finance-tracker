import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

const Stats = () => {
  const navigate = useNavigate();
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1); // January = 1
  const [year, setYear] = useState(now.getFullYear());

  return (
    <div className="w-full h-screen">
      <div className="w-full h-[5%] p-2 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:text-blue-700 transition transform hover:scale-105"
        >
          ← Back to Home
        </button>
      </div>

      <div className="w-full h-[95%] bg-[#4caf50] flex gap-2 p-2">
        <LineChart year={year} month={month} />
        <BarChart />
      </div>
    </div>
  );
};

export default Stats;
