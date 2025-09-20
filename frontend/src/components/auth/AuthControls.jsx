import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthControls = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <>
      {/* ✅ Desktop buttons */}
      <div className="hidden sm:flex gap-3">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md border-2 bg-transparent hover:bg-black text-black hover:text-white transition-all duration-150 text-sm sm:text-base"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-md border-2 bg-transparent hover:bg-black text-black hover:text-white transition-all duration-150 text-sm sm:text-base"
            >
              LogIn
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-md border-2 bg-black hover:bg-white text-white hover:text-black transition-all duration-150 text-sm sm:text-base"
            >
              Get Started
            </button>
          </>
        )}
      </div>

      {/* ✅ Mobile dropdown */}
      <div className="relative sm:hidden">
        <button
  onClick={() => setOpen(!open)}
  className="w-8 h-8 flex items-center justify-center border rounded-md bg-black text-white text-base"
>
  ☰
</button>


        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg flex flex-col">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="px-4 py-2 text-left hover:bg-gray-100"
                >
                  LogIn
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setOpen(false);
                  }}
                  className="px-4 py-2 text-left hover:bg-gray-100"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AuthControls;
