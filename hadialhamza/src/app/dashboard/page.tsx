"use client";

import StatsGrid from "@/components/dashboard/overview/StatsGrid";
import SpendingChart from "@/components/dashboard/overview/SpendingChart";
import RecentTransactions from "@/components/dashboard/overview/RecentTransactions";
import BudgetOverview from "@/components/dashboard/overview/BudgetOverview";
import { motion } from "motion/react";
import { Calendar } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black text-foreground tracking-tight"
          >
            Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground font-medium mt-1"
          >
            Welcome back, here&apos;s what&apos;s happening with your money.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-xl shadow-sm"
        >
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">
            Oct 12, 2026 - Nov 12, 2026
          </span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="xl:col-span-2">
          <SpendingChart />
        </div>

        {/* Transactions Section */}
        <div className="xl:col-span-1">
          <RecentTransactions />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-1">
          <BudgetOverview />
        </div>

        {/* Placeholder for other components like Goals or Insights */}
        <div className="lg:col-span-2 bg-primary/5 border-2 border-dashed border-primary/20 rounded-3xl flex items-center justify-center min-h-75">
          <div className="text-center px-6">
            <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-2">
              Upcoming Feature
            </p>
            <h4 className="text-xl font-bold text-foreground">
              AI Financial Insights
            </h4>
            <p className="text-muted-foreground text-sm font-medium mt-1 max-w-sm mx-auto">
              We&apos;re building something intelligent to help you identify
              spending patterns and save more efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
