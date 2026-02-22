import React from "react";
import { useNavigate } from "@tanstack/react-router";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Smart Recalculation",
      desc: "Instantly rebuild your entire financial history with one click. Respects historical budgets for 100% accuracy.",
      icon: "🔄",
    },
    {
      title: "Real-time Analytics",
      desc: "Visualize your spending patterns with dynamic pie charts and trend lines that update as you type.",
      icon: "📊",
    },
    {
      title: "Money-Safe Precision",
      desc: "Built with industry-standard decimal handling. Every paisa is accounted for without floating-point errors.",
      icon: "🛡️",
    },
    {
      title: "Live Projections",
      desc: "See your end-of-month savings or deficit predicted in real-time based on your current spending velocity.",
      icon: "⏳",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-16 sm:py-24 text-center max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Take Control of Your Pocket, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4caf50] to-[#2e7d32]">
              One Transaction at a Time
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The intelligent way to track, categorize, and master your daily expenses.
            Experience high-precision financial tracking designed for the modern user.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate({ to: "/register" })}
              className="px-8 py-4 bg-[#4caf50] hover:bg-[#388e3c] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => navigate({ to: "/about" })}
              className="px-8 py-4 bg-white border-2 border-gray-100 hover:border-[#4caf50] text-gray-700 rounded-2xl font-bold text-lg shadow-sm transition-all"
            >
              Learn More
            </button>
          </div>

          {/* Dashboard Preview Overlay */}
          <div className="mt-16 relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#4caf50] to-[#2e7d32] rounded-3xl blur opacity-20"></div>
            <img
              src="/images/dashboard-modern.png"
              alt="Premium Dashboard Mockup"
              className="relative rounded-2xl shadow-2xl border border-gray-100 mx-auto max-w-4xl w-full"
            />
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-white/50 py-20 px-6 backdrop-blur-sm border-y border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Why Pocket Tracker?</h2>
              <div className="h-1 w-20 bg-[#4caf50] mx-auto mt-2 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#4caf50] to-[#2e7d32] rounded-[3rem] p-10 sm:p-16 text-white shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to balance your books?</h2>
            <p className="text-lg text-green-50 mb-10 max-w-xl mx-auto opacity-90">
              Join thousands of users who have taken the first step toward 100% financial clarity.
            </p>
            <button
              onClick={() => navigate({ to: "/register" })}
              className="px-10 py-4 bg-white text-[#2e7d32] rounded-2xl font-bold text-xl hover:bg-green-50 transition-colors shadow-lg"
            >
              Join Us Now
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
