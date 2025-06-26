import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const About = () => {
  return (
    <div className="h-screen w-full">
      <Navbar />
      <div className="h-[80%] w-full max-w-3xl mx-auto px-4 py-10 text-gray-700">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          About This App
        </h1>

        <p className="mb-4">
          This app helps users track their finances month-by-month with simple
          yet powerful visual summaries. You can view your income and expenses,
          monitor your savings and deficits, and stay in control of your budget.
        </p>

        <p className="mb-4">
          Built with the MERN stack (MongoDB, Express, React, Node.js), the app
          automatically generates monthly summaries and visual reports. Whether
          you're budgeting for college or planning long-term savings, it’s
          designed to grow with your goals.
        </p>

        <p className="mb-4">Features include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Secure authentication and user-specific dashboards</li>
          <li>Dynamic visualizations of credit and debit flows</li>
          <li>Automated monthly snapshots</li>
          {/* <li>Responsive design for mobile and desktop</li> */}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default About;
