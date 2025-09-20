import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Registration = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    budget: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
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
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative p-2 sm:p-4">
      {/* Back Button */}
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

      {/* Registration Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-md flex flex-col">
        <h2 className="text-xl sm:text-2xl font-bold mb-5 text-center text-green-700">
          Create an Account
        </h2>

        <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="block text-sm sm:text-base font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="block text-sm sm:text-base font-medium text-gray-700"
            >
              Email
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
              className="block text-sm sm:text-base font-medium text-gray-700"
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

          <div className="flex flex-col">
            <label
              htmlFor="budget"
              className="block text-sm sm:text-base font-medium text-gray-700"
            >
              Monthly Budget
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 sm:py-2.5 rounded-md font-semibold hover:from-green-600 hover:to-green-800 transition"
          >
            Register
          </button>

          <p className="text-sm sm:text-base text-center mt-3 text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-green-600 cursor-pointer hover:underline"
            >
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
