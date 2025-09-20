import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute.jsx";
import HomeRedirector from "./components/common/HomeRedirector.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Registration from "./components/auth/Registration.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";
import Stats from "./components/dashboard/Stats.jsx";
import About from "./pages/About.jsx";

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
