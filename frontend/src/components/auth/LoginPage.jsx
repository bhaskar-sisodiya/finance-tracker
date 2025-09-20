import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard");
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        login(data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative p-2 sm:p-4">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="
          absolute top-2 sm:top-4 md:top-5
          left-2 sm:left-4 md:left-5
          bg-gradient-to-r from-green-400 to-green-600
          text-white font-semibold
          px-2 sm:px-3 md:px-4
          py-1 sm:py-1.5 md:py-2
          rounded-md sm:rounded-lg
          shadow-md
          hover:from-green-500 hover:to-green-700
          hover:scale-105 transition-transform duration-200
          flex items-center gap-1 sm:gap-2
          text-xs sm:text-sm md:text-base
        "
      >
        <span className="text-sm sm:text-base md:text-lg">←</span> Back to Home
      </button>

      {/* Login Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md flex flex-col">
        <h2 className="text-xl sm:text-2xl font-bold mb-5 text-center text-green-700">
          Login to Your Account
        </h2>

        <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="block mb-1 text-sm sm:text-base font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="block mb-1 text-sm sm:text-base font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 sm:py-2.5 rounded-md font-semibold hover:from-green-600 hover:to-green-800 transition"
          >
            Log In
          </button>

          <p className="text-sm sm:text-base text-center mt-3 text-gray-600">
            New here?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-green-600 cursor-pointer hover:underline"
            >
              Create an account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
