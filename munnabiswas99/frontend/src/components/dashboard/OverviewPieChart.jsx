import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#8b5cf6", "#FF8042", "#00C49F", "#FFBB28"];

const OverviewPieChart = ({ summary }) => {
  console.log(summary);
  const data = [
    { name: "Income", value: summary.totalIncome },
    { name: "Expense", value: summary.totalExpense },
    { name: "Savings", value: summary.totalSavings },
    { name: "Investment", value: summary.totalInvestment },
  ];
  return (
    <div className="w-full h-90 md:h-110 bg-gray-200 rounded-3xl p-4 md:p-6 shadow-lg border-2 border-gray-300">
      <h1 className="text-lg md:text-2xl font-semibold mb-4">
        Financial Overview
      </h1>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverviewPieChart;
