"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { Skeleton } from "@/components/ui/Skeleton";

interface StatData {
  label: string;
  value: number;
  trend: string;
  trendUp: boolean;
}

interface StatItemProps extends StatData {
  icon: React.ReactNode;
  delay: number;
  isLoading?: boolean;
  colorClass: string;
  bgClass: string;
  gradientClass: string;
}

const StatCard = ({
  label,
  value,
  trend,
  trendUp,
  icon,
  delay,
  isLoading,
  colorClass,
  bgClass,
  gradientClass,
}: StatItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={cn(
      "bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden bg-linear-to-br",
      gradientClass,
    )}
  >
    <div className="flex justify-between items-start mb-4">
      <div
        className={cn(
          "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
          bgClass,
          colorClass,
        )}
      >
        {icon}
      </div>
      {!isLoading ? (
        <div
          className={cn(
            "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
            trendUp
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-rose-500/10 text-rose-500",
          )}
        >
          {trendUp ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {trend}
        </div>
      ) : (
        <Skeleton className="w-12 h-5 rounded-full" />
      )}
    </div>
    <div className="space-y-1 relative z-10">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Skeleton className="h-8 w-24 rounded-lg" />
        ) : (
          <h3 className="text-2xl font-black text-foreground tracking-tight tabular-nums">
            {formatCurrency(value)}
          </h3>
        )}
      </div>
    </div>

    <div
      className={cn(
        "absolute right-2 -bottom-2 opacity-[0.15] group-hover:opacity-[0.3] group-hover:-translate-x-3 group-hover:-translate-y-3 transition-all duration-700 pointer-events-none",
        colorClass,
      )}
    >
      <div className="scale-[4] rotate-12">{icon}</div>
    </div>
  </motion.div>
);

export default function StatsGrid() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cardThemes = [
    {
      color: "text-primary",
      bg: "bg-primary/10",
      gradient: "from-card to-primary/5",
    },
    {
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      gradient: "from-card to-blue-500/5",
    },
    {
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      gradient: "from-card to-rose-500/5",
    },
    {
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      gradient: "from-card to-amber-500/5",
    },
  ];

  const icons = [
    <Wallet key="wallet" className="w-5 h-5" />,
    <TrendingUp key="income" className="w-5 h-5" />,
    <TrendingDown key="expense" className="w-5 h-5" />,
    <CreditCard key="savings" className="w-5 h-5" />,
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/analytics/stats");
        if (res.ok && isMounted) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <StatCard
              key={`skeleton-${i}`}
              label="Loading..."
              value={0}
              trend="0%"
              trendUp={true}
              icon={icons[i]}
              delay={i * 0.1}
              isLoading={true}
              colorClass={cardThemes[i].color}
              bgClass={cardThemes[i].bg}
              gradientClass={cardThemes[i].gradient}
            />
          ))
        : stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              icon={icons[index % icons.length]}
              delay={index * 0.1}
              colorClass={cardThemes[index % cardThemes.length].color}
              bgClass={cardThemes[index % cardThemes.length].bg}
              gradientClass={cardThemes[index % cardThemes.length].gradient}
            />
          ))}
    </div>
  );
}
