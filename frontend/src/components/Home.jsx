import React from "react";
import Navbar from "./Navbar";
import Body from "./Body";
import Footer from "./Footer";

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
