import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: {
    icon: "bg-primary/10 text-primary",
    value: "text-foreground",
  },
  success: {
    icon: "bg-emerald-500/10 text-emerald-600",
    value: "text-emerald-600",
  },
  warning: {
    icon: "bg-amber-500/10 text-amber-600",
    value: "text-amber-600",
  },
  danger: {
    icon: "bg-rose-500/10 text-rose-600",
    value: "text-rose-600",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
      <div className={cn("rounded-lg p-2.5 shrink-0", styles.icon)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p
          className={cn("text-2xl font-bold mt-0.5 leading-none", styles.value)}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
