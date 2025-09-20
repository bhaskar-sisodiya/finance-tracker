import React, { useEffect, useState } from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const LineChart = ({ initialYear, initialMonth }) => {
  const today = new Date();
  const [month, setMonth] = useState(initialMonth || today.getMonth() + 1);
  const [year, setYear] = useState(initialYear || today.getFullYear());

  const [data, setData] = useState([]);
  const [budget, setBudget] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTrendAndUser = async () => {
      try {
        const trendRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/expenses/daily-trend/${year}/${month}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const trend = await trendRes.json();

        const daysInMonth = new Date(year, month, 0).getDate();
        const filledData = Array.from({ length: daysInMonth }, (_, i) => {
          const match = trend.find((item) => item._id === i + 1);
          return { day: i + 1, total: match ? match.total : 0 };
        });
        setData(filledData);

        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await userRes.json();
        setBudget(user.budget);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrendAndUser();
  }, [year, month, token]);

  return (
    <div className="w-full h-full bg-white flex flex-col p-2 rounded-2xl shadow-sm">
      {/* Header with month/year selectors */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-700">Daily Debit Trend</h2>
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-2 py-1 rounded text-sm border"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "short" })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-2 py-1 rounded text-sm border"
          >
            {[...Array(3)].map((_, i) => {
              const dynamicYear = new Date().getFullYear() - (2 - i);
              return (
                <option key={dynamicYear} value={dynamicYear}>
                  {dynamicYear}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`₹${value}`, "Total"]}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} />
            {budget && (
              <ReferenceLine
                y={budget}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: "Budget", position: "right", fill: "#ef4444", fontSize: 12 }}
              />
            )}
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
