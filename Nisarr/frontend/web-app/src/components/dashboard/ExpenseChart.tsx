import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ExpenseData {
  name: string;
  value: number;
  color: string;
}

interface ExpenseChartProps {
  data: ExpenseData[];
  total: number;
}

export function ExpenseChart({ data, total }: ExpenseChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Monthly Expenses</h3>
        <span className="text-lg font-bold text-gradient">৳{total.toLocaleString()}</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid #8b5cf6",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 24px -4px rgba(0, 0, 0, 0.15)",
              }}
              formatter={(value: number) => [`৳${value.toLocaleString()}`, ""]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
