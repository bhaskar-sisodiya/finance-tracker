import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthControls from "../auth/AuthControls";

const Navbar = () => {
  const { isLoggedIn } = useAuth();

  const linkClass = ({ isActive }) =>
    `relative text-sm sm:text-base font-medium transition-colors duration-150 pb-0.5
     after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-200
     ${isActive
      ? "text-black after:w-full after:bg-black"
      : "text-gray-500 hover:text-black after:w-0 hover:after:w-full after:bg-black"
    }`;

  return (
    <nav className="sticky top-0 z-[100] w-full h-16 flex items-center px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Left: Logo + Nav links */}
      <div className="flex items-center gap-5 sm:gap-8 flex-1">
        <NavLink to="/" className="flex items-center shrink-0">
          <img src="/images/logo.svg" alt="App Logo" className="h-6 sm:h-8 lg:h-9" />
        </NavLink>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-6">
          {isLoggedIn && (
            <NavLink to="/stats" className={linkClass}>
              Stats
            </NavLink>
          )}
          {isLoggedIn && (
            <NavLink to="/manage" className={linkClass}>
              Manage
            </NavLink>
          )}
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </div>
      </div>

      {/* Right: Auth controls */}
      <div className="flex items-center gap-3">
        <AuthControls />
      </div>
    </nav>
  );
};

export default Navbar;