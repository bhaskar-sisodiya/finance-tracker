import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";
import HomeRedirector from "./components/HomeRedirector.jsx";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Registration from "./components/Registration.jsx";
import EditProfilePage from "./pages/EditProfile";
import Stats from "./components/Stats.jsx";
import About from "./components/About.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirector />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/edit-profile" element={<EditProfilePage />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default App;
