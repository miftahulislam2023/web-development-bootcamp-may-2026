import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "success" | "warning" | "destructive";
  delay?: number;
}

const colorClasses = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  destructive: "text-destructive bg-destructive/10",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "primary",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`p-2.5 rounded-xl ${colorClasses[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend.isPositive
                ? "text-success bg-success/10"
                : "text-destructive bg-destructive/10"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
