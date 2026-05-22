"use client";

import { motion } from "motion/react";
import { PieChart as PieChartIcon, Tag } from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { formatCurrency } from "@/lib/currency";
import { Skeleton } from "@/components/ui/Skeleton";

interface CategoryDistribution {
  category: string;
  spent: number;
}

interface ExpenseDistributionProps {
  data: CategoryDistribution[];
  isLoading: boolean;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ExpenseDistribution({ data, isLoading }: ExpenseDistributionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card border border-border p-8 rounded-3xl shadow-sm"
    >
      <div className="mb-8">
        <h3 className="text-xl font-black text-foreground flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-primary" />
          Distribution
        </h3>
        <p className="text-sm text-muted-foreground font-medium">Spending by category</p>
      </div>

      <div className="h-[300px] w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Skeleton className="w-48 h-48 rounded-full" />
            <Skeleton className="w-32 h-4" />
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="spent"
                nameKey="category"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "16px"
                }}
                formatter={(val: string | number | readonly (string | number)[] | undefined) => 
                  formatCurrency(Number(Array.isArray(val) ? val[0] : (val ?? 0)))
                }
              />
              <Legend verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <Tag className="w-12 h-12 mb-2 text-muted-foreground" />
            <p className="text-sm font-bold">No data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
