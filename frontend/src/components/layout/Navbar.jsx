import React from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import AuthControls from "../auth/AuthControls";

const Navbar = () => {
  const { isLoggedIn } = useAuth();

  const activeLinkClass = "text-[#4caf50]";
  const inactiveLinkClass = "text-gray-500 hover:text-[#4caf50]";
  const underlineBase = "absolute bottom-0 left-0 w-full h-[3px] bg-[#4caf50] transition-transform duration-300 origin-center";

  return (
    <nav className="sticky top-0 z-[100] w-full h-16 flex items-center px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Left: Logo + Nav links */}
      <div className="flex items-center gap-5 sm:gap-8 flex-1">
        <Link to="/" className="flex items-center shrink-0">
          <img src="/images/logo.svg" alt="App Logo" className="h-6 sm:h-8 lg:h-9" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-6">
          {isLoggedIn && (
            <Link
              to="/stats"
              className={({ isActive }) =>
                `group relative text-sm font-bold pb-1.5 transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              {({ isActive }) => (
                <>
                  Stats
                  <span
                    className={`${underlineBase} ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                  />
                </>
              )}
            </Link>
          )}
          {isLoggedIn && (
            <Link
              to="/manage"
              className={({ isActive }) =>
                `group relative text-sm font-bold pb-1.5 transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              {({ isActive }) => (
                <>
                  Manage
                  <span
                    className={`${underlineBase} ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                  />
                </>
              )}
            </Link>
          )}
          <Link
            to="/about"
            className={({ isActive }) =>
              `group relative text-sm font-bold pb-1.5 transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`
            }
          >
            {({ isActive }) => (
              <>
                About
                <span
                  className={`${underlineBase} ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                />
              </>
            )}
          </Link>
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