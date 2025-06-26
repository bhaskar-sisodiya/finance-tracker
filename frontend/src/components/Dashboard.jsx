import React from "react";
import Navbar from "./Navbar";
import User from "./User";

const Dashboard = () => {
  return (
    <div className="main w-full h-screen">
      <Navbar />
      <User />
    </div>
  );
};

export default Dashboard;
