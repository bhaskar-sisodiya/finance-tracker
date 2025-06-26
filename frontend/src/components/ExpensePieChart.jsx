import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart = ({ expenses }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!Array.isArray(expenses)) return;

    const domainTotals = {};
    expenses.forEach((exp) => {
      domainTotals[exp.domain] = (domainTotals[exp.domain] || 0) + exp.amount;
    });

    const labels = Object.keys(domainTotals);
    const values = Object.values(domainTotals);

    setChartData({
      labels,
      datasets: [
        {
          label: "Spending by Domain",
          data: values,
          backgroundColor: [
            "#4CAF50",
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#8E44AD",
            "#FF7043",
            "#26A69A",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [expenses]);

  if (!chartData || chartData.labels.length === 0) {
    return (
      <h2 className="text-white text-2xl font-semibold flex justify-center items-center">No data to visualize yet.</h2>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 🔧 allows custom sizing
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          font: {
            size: 14,
            family: "Inter",
          },
        },
      },
    },
    radius: "90%",
  };

  return (
    <div className="w-full flex flex-col justify-center items-center rounded-b-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
      <h3 className="text-center text-2xl font-semibold text-white">
        Domain-wise Debit/Credit Breakdown
      </h3>
      <div className="w-[300px] h-[250px] flex justify-center items-center">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ExpensePieChart;
