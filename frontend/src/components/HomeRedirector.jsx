import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "./Home.jsx";

const HomeRedirector = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/dashboard" /> : <Home />;
};

export default HomeRedirector;
