import React, { useState } from "react";
import { Link } from "react-router-dom";
import ExpensePieChart from "../charts/ExpensePieChart";

const Summary = ({ summary, user, onAddClick, onSeeClick, expenses }) => {
  const [isEditing] = useState(false);

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-sm flex flex-col">
      {/* user header */}
      <div className="user-info bg-[#4caf50] p-4 flex items-center gap-4">
        <div className="profile-img flex flex-col items-center">
          <img
            src={user?.profilePic || "/default-avatar.png"}
            alt="profile"
            className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover bg-white"
          />
          <Link
            to="/edit-profile"
            className="text-[11px] sm:text-[13px] text-white hover:text-black mt-1"
          >
            Edit Profile
          </Link>
        </div>

        <div className="flex-1">
          <h1 className="text-white text-lg sm:text-2xl font-semibold">
            {user?.name || "User"}
          </h1>
        </div>
      </div>

      <hr className="border-white border-t-2" />

      
      {/* summary stats + desktop buttons */}
      <div className="user-summary bg-[#4caf50] text-white p-4 flex flex-col justify-between lg:h-[250px]">
        <div className="space-y-1">
          {/* Heading chhota aur responsive */}
          <h2 className="text-xl sm:text-2xl lg:text-xl font-semibold mb-2">
            Summary
          </h2>
          <div className="space-y-1 text-xs sm:text-sm lg:text-sm">
            <p>Total Balance = ₹{summary?.totalBalance ?? "--"}</p>
            <p>Remaining Balance = ₹{summary?.remainingBalance ?? "--"}</p>
            <p>Savings = ₹{summary?.savings ?? "--"}</p>
            <p>Deficit = ₹{summary?.deficit ?? "--"}</p>
          </div>
        </div>

        {/* desktop-only buttons */}
        <div className="mt-4 hidden lg:flex gap-3 justify-center">
          <button
            onClick={onSeeClick}
            className="pt-2 pb-2 px-5 text-[#22a127] hover:text-white bg-white hover:bg-[#007d04] rounded-3xl transition"
            type="button"
          >
            See Expenses
          </button>
          <button
            onClick={onAddClick}
            className="pt-2 pb-2 px-5 text-[#22a127] hover:text-white bg-white hover:bg-[#007d04] rounded-3xl transition"
            type="button"
          >
            Add Expense
          </button>
        </div>
      </div>

      <hr className="border-white border-t-2" />

      {/* pie chart */}
      <div className="bg-gradient-to-br from-[#4caf50] via-[#388e3c] to-[#2e7d32] p-4 flex justify-center items-center w-full lg:h-[400px]">
        {/* Outer wrapper full width */}
        <div className="w-full flex justify-center items-center">
          <ExpensePieChart expenses={expenses} />
        </div>
      </div>
    </div>
  );
};

export default Summary;
