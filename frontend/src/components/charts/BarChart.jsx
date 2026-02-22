import React, { useEffect, useState } from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BarChart = ({ year }) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear];
  const [selectedYear, setSelectedYear] = useState(year || currentYear);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/expenses/yearly-summary/${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const summary = await res.json();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formatted = summary.map((item) => ({
        name: monthNames[item.month - 1],
        debit: item.debit,
        credit: item.credit,
        budget: item.budget,
      }));
      setData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear, token]);

  return (
    <div className="w-full h-full bg-white flex flex-col p-2 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-700">Yearly Summary (incl. Budget)</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-2 py-1 rounded text-sm border"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value, name) => [`₹${value}`, name.charAt(0).toUpperCase() + name.slice(1)]} />
            <Legend verticalAlign="top" align="center" />
            <Bar dataKey="budget" fill="#3b82f6" name="Budget" stackId="a" />
            <Bar dataKey="credit" fill="#10b981" name="Credit" stackId="a" />
            <Bar dataKey="debit" fill="#ef4444" name="Debit" />
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
