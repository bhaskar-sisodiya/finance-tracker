import React from "react";
import Body from "../components/layout/Body";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const Home = () => {

  return (
    <div className="main w-full h-screen">
      <Navbar />
      <Body />
      <Footer />
    </div>
  );
};

export default Home;
