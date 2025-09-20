import React from "react";
import User from "../profile/User";
import Navbar from "../layout/Navbar";

const Dashboard = () => {
  return (
    <div className="main w-full h-screen">
      <Navbar />
      <User />
    </div>
  );
};

export default Dashboard;
