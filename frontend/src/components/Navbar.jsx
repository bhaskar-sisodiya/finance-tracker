import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthControls from "./AuthControls";

const Navbar = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="navbar w-full h-[10%] flex">
      <div className="right font-semibold text-2xl w-1/2 h-full p-2 flex gap-7 items-center">
        <Link to="/">
          <img src="/images/logo.svg" alt="App Logo" />
        </Link>

        {isLoggedIn && (
          <Link
            to="/stats"
            className="pb-1 border-b-0 hover:border-b-4 hover:border-black transition-all duration-75"
          >
            Stats
          </Link>
        )}

        <Link
          to="/about"
          className="pb-1 border-b-0 hover:border-b-4 hover:border-black transition-all duration-75"
        >
          About
        </Link>
      </div>

      <div className="left font-semibold text-2xl w-1/2 h-full p-4 flex justify-end gap-7 items-center">
        <AuthControls />
      </div>
    </div>
  );
};

export default Navbar;