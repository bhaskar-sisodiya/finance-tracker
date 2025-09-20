import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Home from "../../pages/Home.jsx";

const HomeRedirector = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/dashboard" /> : <Home />;
};

export default HomeRedirector;
