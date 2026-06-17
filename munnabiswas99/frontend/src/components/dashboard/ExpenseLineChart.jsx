import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


export default function ExpenseLineChart({ recentExpense }) {

  const data = recentExpense.map((item) => ({
    name: item.title,
    expense: item.amount,
  }));

  return (
    <div className="w-full h-90 md:h-110 bg-gray-200 rounded-3xl p-4 md:p-6 shadow-lg border-2 border-gray-300">
      <h1 className="text-lg md:text-2xl font-semibold mb-4">
        Recent Expences
      </h1>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />

          <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 12 }} />

          <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} />

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          />

          <Legend />

          {/* Expense Line */}
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#FF8042"
            strokeWidth={3}
            dot={{
              fill: "#8b5cf6",
              r: 4,
            }}
            activeDot={{
              r: 7,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
