import React, { useState, useEffect } from "react";
import axios from "axios";
import Summary from "./Summary";
import ExpenseForm from "./ExpenseForm";
import ExpenseTable from "./ExpenseTable";

const User = () => {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [view, setView] = useState("form"); // or "table"
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    setSummary(data);
  };

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/expenses/current-month`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchUser();
    fetchSummary();
    fetchExpenses();
  }, []);

  return (
    <div className="user-main h-[90%] p-3 flex gap-4">
      <Summary
        summary={summary}
        user={user}
        expenses={expenses}
        onAddClick={() => setView("form")}
        onSeeClick={() => setView("table")}
      />

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
  );
};

export default User;
