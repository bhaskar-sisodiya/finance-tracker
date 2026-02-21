import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const EyeIcon = ({ open }) =>
  open ? (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.53-4.003M6.228 6.228A9.969 9.969 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-1.88 3.34M3 3l18 18" />
    </svg>
  );

const Registration = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    budget: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
        showToast(data.message || "Registration failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error. Please try again.", "error");
    } finally {
      setIsLoading(false);
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 sm:py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
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
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 sm:py-2.5 rounded-md font-semibold hover:from-green-600 hover:to-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isLoading ? "Creating account…" : "Register"}
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
