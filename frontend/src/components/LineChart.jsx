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
          `${
            import.meta.env.VITE_API_URL
          }/api/expenses/daily-trend/${year}/${month}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!trendRes.ok) throw new Error("Trend fetch failed");

        const trend = await trendRes.json();
        const daysInMonth = new Date(year, month, 0).getDate();

        const filledData = Array.from({ length: daysInMonth }, (_, i) => {
          const match = trend.find((item) => item._id === i + 1);
          return { day: i + 1, total: match ? match.total : 0 };
        });

        setData(filledData);

        const userRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const user = await userRes.json();
        setBudget(user.budget);
      } catch (err) {
        console.error("Line chart error:", err);
      }
    };

    fetchTrendAndUser();
  }, [year, month, token]);

  return (
    <div className="w-[50%] h-full bg-white flex flex-col p-2 rounded-2xl">
      <div className="flex justify-between items-center mb-2">
  <h2 className="text-lg font-semibold text-gray-700">Daily Debit Trend</h2>

  <div className="flex gap-2 items-center">
    <select
      value={month}
      onChange={(e) => setMonth(Number(e.target.value))}
      className="px-2 py-1 rounded text-sm border"
    >
      {Array.from({ length: 12 }, (_, i) => (
        <option key={i} value={i + 1}>
          {new Date(0, i).toLocaleString("default", { month: "long" })}
        </option>
      ))}
    </select>

    <select
      value={year}
      onChange={(e) => setYear(Number(e.target.value))}
      className="px-2 py-1 rounded text-sm border"
    >
      {[2023, 2024, 2025].map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  </div>
</div>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`₹${value}`, "Total"]}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#4f46e5"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={400}
          />
          {budget && (
            <ReferenceLine
              y={budget}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{
                value: "Budget",
                position: "right",
                fill: "#ef4444",
                fontSize: 12,
              }}
            />
          )}
          {year === new Date().getFullYear() &&
            month === new Date().getMonth() + 1 && (
              <ReferenceLine
                x={new Date().getDate()}
                stroke="orange"
                strokeDasharray="3 3"
                label={{
                  value: "Today",
                  position: "top",
                  fill: "orange",
                  fontSize: 12,
                }}
              />
            )}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
