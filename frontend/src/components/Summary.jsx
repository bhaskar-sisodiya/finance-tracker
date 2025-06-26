import React, { useState } from "react";
import { Link } from "react-router-dom";
import ExpensePieChart from "./ExpensePieChart";

const Summary = ({ summary, user, onAddClick, onSeeClick, expenses }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-[30%] h-full rounded-3xl">
      <div className="user-info bg-[#4caf50] rounded-t-3xl h-[15%] p-2 flex gap-2 items-center">
        <div className="profile-img font-semibold text-white flex flex-col gap-1 items-center">
          <img
            src={user?.profilePic || "/default-avatar.png"}
            alt="profile"
            className="h-15 w-15 rounded-full object-cover bg-white"
          />
          <Link to="/edit-profile" className="text-[13px] hover:text-black">
            Edit Profile
          </Link>
        </div>
        <h1 className="pb-5 text-white text-3xl font-semibold">
          {user?.name || "User"}
        </h1>
      </div>

      <hr className="border-white border-2" />

      <div className="user-summary bg-[#4caf50] text-white h-[35%] p-2">
        <h1 className="text-4xl font-semibold">Summary</h1>
        <div className="mt-2">
          <p>Total Balance = ₹{summary?.totalBalance ?? "--"}</p>
          <p>Remaining Balance = ₹{summary?.remainingBalance ?? "--"}</p>
          <p>Savings = ₹{summary?.savings ?? "--"}</p>
          <p>Deficit = ₹{summary?.deficit ?? "--"}</p>
        </div>
        <div className="buttons mt-4 flex gap-5 justify-center">
          <button
            onClick={onSeeClick}
            className="pt-2 pb-2 px-5 text-[#22a127] hover:text-white bg-white hover:bg-[#007d04] rounded-3xl"
          >
            See Expenses
          </button>
          <button
            onClick={onAddClick}
            className="pt-2 pb-2 px-5 text-[#22a127] hover:text-white bg-white hover:bg-[#007d04] rounded-3xl"
          >
            Add Expense
          </button>
        </div>
      </div>

      <hr className="border-white border-2" />

      <div className="bg-gradient-to-br from-[#4caf50] via-[#388e3c] to-[#2e7d32] pie-chart rounded-b-3xl h-[calc(50%-6px)] flex justify-center">
        {/* <div className="pie h-[40vh] w-[40vh] rounded-full bg-white"> */}
        <ExpensePieChart expenses={expenses} />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Summary;
