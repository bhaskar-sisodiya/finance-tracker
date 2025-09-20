import { useEffect, useState } from "react";
import axios from "axios";

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/expenses/current-month`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to load expenses", err);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <div className="h-full overflow-y-auto w-full rounded-3xl">
      <table className="h-full min-w-full table-auto border border-gray-200 rounded-md shadow-sm">
        <thead className="bg-[#4caf50] text-white text-sm">
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Domain</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Type</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(expenses) && expenses.length > 0 ? (
            expenses.map((exp) => (
              <tr key={exp._id} className="border-t text-sm">
                <td className="p-2">{exp.date.split("T")[0]}</td>
                <td className="p-2">{exp.title}</td>
                <td className="p-2">{exp.domain}</td>
                <td className="p-2">₹{exp.amount}</td>
                <td className="p-2 capitalize">{exp.type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No expenses recorded this month.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
