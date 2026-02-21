import React from "react";
import User from "../profile/User";
import Navbar from "../layout/Navbar";

const Dashboard = () => {
  return (
    <div className="main w-full h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <User />
      </div>
    </div>
  );
};

export default Dashboard;
