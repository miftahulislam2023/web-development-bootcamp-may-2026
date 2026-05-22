"use client";

import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface TransactionStatsProps {
  totalIncome: number;
  totalExpense: number;
}

export default function TransactionStats({ totalIncome, totalExpense }: TransactionStatsProps) {
  const balance = totalIncome - totalExpense;

  const stats = [
    {
      label: "Total Balance",
      value: balance,
      icon: <Wallet className="w-5 h-5" />,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Monthly Income",
      value: totalIncome,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Monthly Expense",
      value: totalExpense,
      icon: <TrendingDown className="w-5 h-5" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border border-border p-6 rounded-3xl shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
              <p className={cn("text-2xl font-black tracking-tight mt-1", 
                stat.label === "Total Balance" && balance < 0 ? "text-rose-500" : "text-foreground"
              )}>
                {formatCurrency(Math.abs(stat.value))}
                {stat.label === "Total Balance" && balance < 0 && " (Dr)"}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
