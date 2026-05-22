"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Plus, Wallet, TrendingUp, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/currency";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { customToast } from "@/components/ui/customToast";
import SetBudgetModal from "./SetBudgetModal";

interface BudgetData {
  budget: number;
  totalSpent: number;
  month: number;
  year: number;
}

export default function BudgetContent() {
  const [data, setData] = useState<BudgetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBudget = useCallback(async () => {
    try {
      const res = await fetch("/api/budgets");
      if (res.ok) {
        setData(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch budget", error);
      customToast.error("Error", "Failed to load budget data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      if (isMounted) await fetchBudget();
    };

    init();
    return () => { isMounted = false; };
  }, [fetchBudget]);

  const percent = data?.budget ? Math.min((data.totalSpent / data.budget) * 100, 100) : 0;
  const remaining = (data?.budget || 0) - (data?.totalSpent || 0);
  const isOverBudget = remaining < 0;
  const isNearLimit = percent >= 85;

  useEffect(() => {
    if (!isLoading && data?.budget) {
      if (isOverBudget) {
        customToast.error("Budget Exceeded", `You have exceeded your monthly budget by ${formatCurrency(Math.abs(remaining))}`);
      } else if (isNearLimit) {
        customToast.warning("Budget Warning", `You have used ${percent.toFixed(0)}% of your monthly budget.`);
      }
    }
  }, [isLoading, data?.budget, isOverBudget, isNearLimit, percent, remaining]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black text-foreground tracking-tight"
          >
            Monthly Budget
          </motion.h1>
          <p className="text-muted-foreground font-medium mt-1">
            Plan your spending and track your progress.
          </p>
        </div>

        <Button 
          variant="primary" 
          className="shadow-xl shadow-primary/20 px-6"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsModalOpen(true)}
        >
          {data?.budget ? "Update Budget" : "Set Budget"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Budget Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-card border border-border p-8 rounded-3xl shadow-sm relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Limit</p>
              {isLoading ? (
                <Skeleton className="h-10 w-32 rounded-lg" />
              ) : (
                <h2 className="text-4xl font-black text-foreground tracking-tighter">
                  {formatCurrency(data?.budget || 0)}
                </h2>
              )}
            </div>
            <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Spending</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 rounded-lg" />
                ) : (
                  <p className="text-2xl font-black text-foreground">
                    {formatCurrency(data?.totalSpent || 0)}
                  </p>
                )}
              </div>
              <div className="text-right space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progress</p>
                <p className={cn(
                  "text-2xl font-black",
                  isOverBudget ? "text-rose-500" : isNearLimit ? "text-amber-500" : "text-primary"
                )}>
                  {percent.toFixed(0)}%
                </p>
              </div>
            </div>

            <div className="h-4 w-full bg-muted rounded-full overflow-hidden p-1 border border-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full transition-colors duration-500",
                  isOverBudget ? "bg-rose-500" : isNearLimit ? "bg-amber-500" : "bg-primary"
                )}
              />
            </div>

            {isNearLimit && !isOverBudget && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3 text-amber-600"
              >
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-bold">You have used {percent.toFixed(0)}% of your monthly budget.</p>
              </motion.div>
            )}

            {isOverBudget && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-600"
              >
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm font-bold">Warning: You have exceeded your monthly budget by {formatCurrency(Math.abs(remaining))}.</p>
              </motion.div>
            )}
          </div>

          <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 pointer-events-none">
            <Wallet className="w-64 h-64 rotate-12" />
          </div>
        </motion.div>

        {/* Stats Column */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border p-6 rounded-3xl shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Remaining</p>
                <h4 className={cn("text-xl font-black", remaining < 0 ? "text-rose-500" : "text-emerald-500")}>
                  {formatCurrency(remaining)}
                </h4>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border p-6 rounded-3xl shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Billing Period</p>
                <h4 className="text-xl font-black text-foreground">
                  {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <SetBudgetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBudget}
        currentBudget={data?.budget || 0}
      />
    </div>
  );
}
