import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KPICardProps = {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
};

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
        <div className="text-2xl font-semibold">{value}</div>
        {change !== undefined ? (
          <div
            className={
              "mt-2 flex items-center gap-1 text-sm " +
              (trend === "up" ? "text-green-500" : "text-red-500")
            }
          >
            {trend === "up" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span>{Math.abs(change)}% from last month</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
