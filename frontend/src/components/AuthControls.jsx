// components/AuthControls.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthControls = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return isLoggedIn ? (
    <button
      onClick={handleLogout}
      className="p-2 rounded-md border-2 bg-transparent hover:bg-black text-black hover:text-white transition-all duration-75"
    >
      Logout
    </button>
  ) : (
    <>
      <button
        onClick={() => navigate("/login")}
        className="p-2 rounded-md border-2 bg-transparent hover:bg-black text-black hover:text-white transition-all duration-75"
      >
        LogIn
      </button>
      <button
        onClick={() => navigate("/register")}
        className="p-2 rounded-md border-2 bg-black hover:bg-white text-white hover:text-black transition-all duration-75"
      >
        Get Started
      </button>
    </>
  );
};

export default AuthControls;