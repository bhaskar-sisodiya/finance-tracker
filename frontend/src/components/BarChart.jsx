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

const BarChart = ({ refreshTrigger }) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear];
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/expenses/yearly-summary/${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch bar chart data");

      const summary = await res.json();

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const formatted = summary.map((item) => ({
        name: monthNames[item.month - 1],
        debit: item.debit,
        credit: item.credit,
      }));

      setData(formatted);
    } catch (error) {
      console.error("BarChart fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear, token]);

  return (
    <div className="w-[50%] h-full bg-white rounded-2xl p-2 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Yearly Debit vs Credit Summary
        </h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-2 py-1 rounded text-sm border"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full h-full bg-gray-100 rounded-md">
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{
                value: "Month",
                position: "insideBottom",
                offset: -5,
              }}
            />

            <YAxis
              label={{
                value: "Amount (₹)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip
              formatter={(value) => [`₹${value}`, "Amount"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend
              verticalAlign="top"
              align="center"
              content={({ payload }) => (
                <ul
                  className="flex justify-center gap-4 mb-2"
                  style={{ listStyle: "none", padding: 0, marginTop: "0.5rem" }}
                >
                  {payload?.map((entry, index) => (
                    <li key={index} className="flex items-center gap-1 text-sm">
                      <svg width={14} height={14}>
                        <rect
                          width="14"
                          height="14"
                          fill={entry.color}
                          rx={2}
                          ry={2}
                        />
                      </svg>
                      <span style={{ color: entry.color }}>{entry.value}</span>
                    </li>
                  ))}
                </ul>
              )}
            />
            <Bar dataKey="debit" fill="#ef4444" name="Debit" />
            <Bar dataKey="credit" fill="#10b981" name="Credit" />
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
