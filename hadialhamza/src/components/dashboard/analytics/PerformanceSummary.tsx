"use client";

import { motion } from "motion/react";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface SpendingMonth {
  name: string;
  income: number;
  expenses: number;
}

interface PerformanceSummaryProps {
  currentMonth?: SpendingMonth;
  prevMonth?: SpendingMonth;
  isLoading: boolean;
}

export default function PerformanceSummary({ currentMonth, prevMonth, isLoading }: PerformanceSummaryProps) {
  const calculateTrend = (curr: number, prev: number) => {
    if (!prev || prev === 0) return { val: "0%", up: true };
    const diff = ((curr - prev) / prev) * 100;
    return {
      val: `${Math.abs(diff).toFixed(1)}%`,
      up: diff >= 0
    };
  };

  const incomeTrend = calculateTrend(currentMonth?.income || 0, prevMonth?.income || 0);
  const expenseTrend = calculateTrend(currentMonth?.expenses || 0, prevMonth?.expenses || 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="lg:col-span-2 bg-card border border-border p-8 rounded-3xl shadow-sm"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Performance Summary
          </h3>
          <p className="text-sm text-muted-foreground font-medium">Comparison with previous month</p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="w-full h-16 rounded-xl" />
            <Skeleton className="w-full h-16 rounded-xl" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Metric</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">This Month</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vs Last Month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr className="group">
                  <td className="py-4 font-bold text-sm">Total Income</td>
                  <td className="py-4 font-black text-sm text-emerald-500">
                    {formatCurrency(currentMonth?.income || 0)}
                  </td>
                  <td className="py-4">
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-black",
                      incomeTrend.up ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {incomeTrend.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {incomeTrend.val}
                    </div>
                  </td>
                </tr>
                <tr className="group">
                  <td className="py-4 font-bold text-sm">Total Expenses</td>
                  <td className="py-4 font-black text-sm text-rose-500">
                    {formatCurrency(currentMonth?.expenses || 0)}
                  </td>
                  <td className="py-4">
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-black",
                      expenseTrend.up ? "text-rose-500" : "text-emerald-500"
                    )}>
                      {expenseTrend.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {expenseTrend.val}
                    </div>
                  </td>
                </tr>
                <tr className="group">
                  <td className="py-4 font-bold text-sm">Net Savings</td>
                  <td className="py-4 font-black text-sm text-primary">
                    {formatCurrency((currentMonth?.income || 0) - (currentMonth?.expenses || 0))}
                  </td>
                  <td className="py-4">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {((currentMonth?.income || 0) - (currentMonth?.expenses || 0)) > ((prevMonth?.income || 0) - (prevMonth?.expenses || 0)) ? "Improving" : "Decreasing"}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
