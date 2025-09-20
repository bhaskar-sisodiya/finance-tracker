import React, { useState, useEffect } from "react";
import axios from "axios";
import Summary from "./Summary";
import ExpenseTable from "../expenses/ExpenseTable";
import ExpenseForm from "../expenses/ExpenseForm";

const User = () => {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [view, setView] = useState("summary"); // "summary" | "form" | "table"
  const [expenses, setExpenses] = useState([]);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUser(data);
  };

  const fetchSummary = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/summary`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setSummary(data);
  };

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/expenses/current-month`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchUser();
    fetchSummary();
    fetchExpenses();
  }, []);

  return (
    <div className="user-main h-[90%] p-3 flex flex-col gap-4">
      {/* ===== Mobile / Tablet 3-button menu ===== */}
      <div className="flex lg:hidden justify-center mb-4">
        <div className="flex gap-2 bg-gray-100 p-2 rounded-lg shadow-md">
          <button
            type="button"
            onClick={() => setView("summary")}
            aria-pressed={view === "summary"}
            className={`px-3 py-1 rounded-md font-medium transition ${
              view === "summary"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Summary
          </button>
          <button
            type="button"
            onClick={() => setView("form")}
            aria-pressed={view === "form"}
            className={`px-3 py-1 rounded-md font-medium transition ${
              view === "form" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Expense Form
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            aria-pressed={view === "table"}
            className={`px-3 py-1 rounded-md font-medium transition ${
              view === "table" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Expense Table
          </button>
        </div>
      </div>

      {/* ===== Mobile/Tablet: show selected panel ===== */}
      <div className="lg:hidden w-full">
        {view === "summary" && (
          <div className="mx-auto w-full max-w-3xl">
            <Summary summary={summary} user={user} expenses={expenses} />
          </div>
        )}
        {view === "form" && (
          <div className="mx-auto w-full max-w-3xl">
            <ExpenseForm
              onExpenseAdded={() => {
                fetchSummary();
                fetchExpenses();
              }}
            />
          </div>
        )}
        {view === "table" && (
          <div className="mx-auto w-full max-w-3xl">
            <ExpenseTable />
          </div>
        )}
      </div>

      {/* ===== Desktop: 2-column layout ===== */}
      <div className="hidden lg:flex w-full gap-4 h-[85vh]">
        <div className="w-[30%] h-full">
          <Summary
            summary={summary}
            user={user}
            expenses={expenses}
            onAddClick={() => setView("form")}
            onSeeClick={() => setView("table")}
          />
        </div>

        <div className="w-[70%] h-full">
          {view === "form" ? (
            <ExpenseForm
              onExpenseAdded={() => {
                fetchSummary();
                fetchExpenses();
              }}
            />
          ) : (
            <ExpenseTable />
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
