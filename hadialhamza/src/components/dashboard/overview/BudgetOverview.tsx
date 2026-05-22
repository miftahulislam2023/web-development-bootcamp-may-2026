"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { Skeleton } from "@/components/ui/Skeleton";

interface BudgetData {
  category: string;
  spent: number;
  limit: number;
  color: string;
}

export default function BudgetOverview() {
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchBudgets = async () => {
      try {
        const breakdownRes = await fetch("/api/analytics/categories");
        if (breakdownRes.ok && isMounted) {
          const breakdownData = await breakdownRes.json();
          setBudgets(breakdownData);
        }
      } catch (error) {
        console.error("Failed to fetch budget overview", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBudgets();
    return () => { isMounted = false; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-card border border-border p-6 rounded-2xl shadow-sm h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">
            Category Breakdown
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            Monthly spending by category
          </p>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`budget-skeleton-${i}`} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
                <Skeleton className="w-full h-2 rounded-full" />
              </div>
            ))}
          </div>
        ) : budgets.length > 0 ? (
          budgets.map((b) => {
            const total = b.limit || 1000;
            const percent = Math.min((b.spent / total) * 100, 100);
            return (
              <div key={b.category} className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-sm font-bold text-foreground">
                    {b.category}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    <span className="font-black text-foreground">{formatCurrency(b.spent)}</span>{" "}
                    of {formatCurrency(total)}
                  </p>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full", 
                      percent > 90 ? "bg-rose-500" : percent > 70 ? "bg-amber-500" : "bg-primary"
                    )}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
            <p className="text-sm font-bold">No category data</p>
          </div>
        )}
      </div>

      {!isLoading && budgets.length > 0 && (
        <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-xl">
          <p className="text-xs font-medium text-foreground leading-relaxed">
            <span className="font-black text-primary uppercase tracking-widest mr-1">
              Insights:
            </span>
            {budgets[0].spent > 800 ? `You've spent a significant amount on ${budgets[0].category} this month.` : "Your spending is within normal limits."}
          </p>
        </div>
      )}
    </motion.div>
  );
}
