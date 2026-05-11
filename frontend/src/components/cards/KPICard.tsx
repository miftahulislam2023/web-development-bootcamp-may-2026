// src/components/cards/KPICard.tsx
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export default function KPICard({
  title,
  value,
  change,
  icon,
  trend,
}: KPICardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm mt-2 ${trend === "up" ? "text-red-500" : trend === "down" ? "text-green-500" : "text-muted-foreground"}`}
          >
            {trend === "up" && <ArrowUp size={14} />}
            {trend === "down" && <ArrowDown size={14} />}
            <span>{Math.abs(change)}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
