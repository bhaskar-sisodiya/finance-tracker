import React from "react";
import { useNavigate } from "@tanstack/react-router";
import Navbar from "../components/layout/Navbar";

const features = [
  {
    icon: "📊",
    title: "Monthly Summaries",
    desc: "Instantly see your total balance, remaining budget, savings, and deficits — updated every time you log a transaction.",
  },
  {
    icon: "📈",
    title: "Visual Analytics",
    desc: "Interactive charts break down your spending by category and show credit vs debit trends over time.",
  },
  {
    icon: "🗂️",
    title: "Expense Manager",
    desc: "Search, filter by type, domain, or date — then edit or bulk-delete records with a single click.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "JWT-based authentication ensures your financial data stays safe and visible only to you.",
  },
  {
    icon: "📅",
    title: "Automated Snapshots",
    desc: "Monthly snapshots preserve your financial history so you can look back at any previous period.",
  },
  {
    icon: "⚡",
    title: "Built for Speed",
    desc: "Client-side caching with Redux means navigation is instant — no repeated network calls as you browse pages.",
  },
  {
    icon: "🛣️",
    title: "Type-Safe Routing",
    desc: "Powered by TanStack Router for ultra-fast, type-safe navigation and robust route guards.",
  },
];

const stack = [
  { name: "MongoDB", color: "bg-green-100 text-green-700", label: "Database" },
  { name: "Express", color: "bg-gray-100 text-gray-700", label: "Backend" },
  { name: "React 19", color: "bg-sky-100 text-sky-700", label: "Frontend" },
  { name: "Node.js", color: "bg-lime-100 text-lime-700", label: "Runtime" },
  { name: "Redux Toolkit", color: "bg-purple-100 text-purple-700", label: "State" },
  { name: "TailwindCSS", color: "bg-cyan-100 text-cyan-700", label: "Styling" },
  { name: "JWT", color: "bg-yellow-100 text-yellow-700", label: "Auth" },
  { name: "TanStack Router", color: "bg-orange-100 text-orange-700", label: "Routing" },
  { name: "Recharts", color: "bg-pink-100 text-pink-700", label: "Charts" },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#f0faf0]">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col gap-10">

        {/* ── Back + Header ── */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            aria-label="Back to dashboard"
            className="mt-1 w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-white border-2 border-[#4caf50] text-[#2e7d32] hover:bg-[#4caf50] hover:text-white shadow-sm transition hover:scale-110 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div>
            <h1 className="text-3xl font-extrabold text-[#2e7d32] leading-tight">
              About Pocket Tracker
            </h1>
            <p className="text-gray-500 mt-1 text-sm max-w-xl">
              A personal finance manager built with the MERN stack — designed to
              give you clear, visual control over every rupee you earn and spend.
            </p>
          </div>
        </div>

        {/* ── Hero card ── */}
        <div className="rounded-3xl overflow-hidden shadow-md border border-[#c8e6c9]">
          <div className="bg-gradient-to-r from-[#4caf50] to-[#2e7d32] px-6 py-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">Our Mission</p>
            <p className="text-xl font-bold leading-snug max-w-2xl">
              Make personal budgeting effortless — because understanding where your
              money goes is the first step to making it work for you.
            </p>
          </div>
          <div className="bg-white px-6 py-5 grid grid-cols-3 divide-x divide-gray-100 text-center">
            {[["₹", "Track every rupee"], ["📆", "Month-by-month history"], ["📉", "Visualise debt & savings"]].map(([icon, label]) => (
              <div key={label} className="px-4 py-1">
                <span className="text-2xl">{icon}</span>
                <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Features grid ── */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#c8e6c9] shadow-sm p-4 flex flex-col gap-2 hover:shadow-md hover:scale-105 transition-all">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech stack ── */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {stack.map(({ name, color, label }) => (
              <div key={name} className={`flex flex-col items-center rounded-xl px-4 py-2 ${color} border border-current/10`}>
                <span className="font-bold text-sm">{name}</span>
                <span className="text-[10px] opacity-70 font-medium uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-xs text-gray-400 pb-4">
          Built with ❤️ by Bhaskar Sisodiya · 2026
        </p>
      </div>
    </div>
  );
};

export default About;
