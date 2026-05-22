"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/Skeleton";

interface ChartData {
  name: string;
  income: number;
  expenses: number;
}

export default function SpendingChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const skeletonHeights = ["60%", "40%", "80%", "55%", "70%", "45%"];

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics/spending");
        if (res.ok && isMounted) {
          const result = await res.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch spending analytics", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAnalytics();
    return () => { isMounted = false; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-card border border-border p-6 rounded-2xl shadow-sm h-112.5 flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">Spending Overview</h3>
          <p className="text-sm text-muted-foreground font-medium">Income vs Expenses trends</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expenses</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col gap-4">
             <div className="flex items-end gap-2 flex-1 pb-8">
               {skeletonHeights.map((height, i) => (
                 <Skeleton 
                   key={`chart-bar-skeleton-${i}`} 
                   className="flex-1" 
                   style={{ height }} 
                 />
               ))}
             </div>
             <div className="flex gap-2">
               {Array.from({ length: 6 }).map((_, i) => (
                 <Skeleton key={`chart-label-skeleton-${i}`} className="flex-1 h-3" />
               ))}
             </div>
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                tickFormatter={(value) => `${value > 999 ? (value/1000).toFixed(1) + 'k' : value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "var(--card)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "16px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="#f43f5e" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorExpenses)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-border rounded-2xl">
            <span className="text-xs font-bold text-muted-foreground/60">Not enough data to generate chart</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
