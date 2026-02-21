import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart = ({ expenses, containerClassName }) => {
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
      <h2 className="text-white text-base sm:text-sm font-semibold flex justify-center items-center">
        No data to visualize yet.
      </h2>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          font: {
            size: 12,
            family: "Inter",
          },
        },
      },
    },
    radius: "90%",
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between items-center rounded-b-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg p-6">
      {/* Heading */}
      <h3 className="text-center text-sm sm:text-base md:text-lg font-semibold text-white mb-2">
        Domain-wise Debit/Credit Breakdown
      </h3>

      {/* Pie chart wrapper fills remaining height */}
      <div className="flex-1 w-full flex justify-center items-center">
        <div className={containerClassName || "w-[220px] h-[250px] sm:w-[200px] sm:h-[160px] md:w-[180px] md:h-[140px]"}>

          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ExpensePieChart;
