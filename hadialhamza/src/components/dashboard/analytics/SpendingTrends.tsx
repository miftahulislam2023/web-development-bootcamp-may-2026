"use client";

import { motion } from "motion/react";
import { BarChart3 } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from "recharts";
import { formatCurrency } from "@/lib/currency";
import { Skeleton } from "@/components/ui/Skeleton";

interface SpendingMonth {
  name: string;
  income: number;
  expenses: number;
}

interface SpendingTrendsProps {
  data: SpendingMonth[];
  isLoading: boolean;
}

export default function SpendingTrends({ data, isLoading }: SpendingTrendsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-2 bg-card border border-border p-8 rounded-3xl shadow-sm"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Spending Trends
          </h3>
          <p className="text-sm text-muted-foreground font-medium">Income vs Expenses monthly comparison</p>
        </div>
      </div>

      <div className="h-[350px] w-full">
        {isLoading ? (
          <Skeleton className="w-full h-full rounded-2xl" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                tickFormatter={(val) => `৳${val > 999 ? (val/1000).toFixed(1) + 'k' : val}`}
              />
              <Tooltip 
                cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "16px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                }}
                formatter={(val: string | number | readonly (string | number)[] | undefined) => 
                  formatCurrency(Number(Array.isArray(val) ? val[0] : (val ?? 0)))
                }
              />
              <Legend verticalAlign="top" align="right" height={36}/>
              <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} name="Income" />
              <Bar dataKey="expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} barSize={20} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
