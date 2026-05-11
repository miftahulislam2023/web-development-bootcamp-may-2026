// src/components/cards/BudgetCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BudgetCardProps {
  title: string;
  spent: number;
  limit: number;
  category?: string;
  period?: string;
  currency?: string;
}

export default function BudgetCard({
  title,
  spent,
  limit,
  category,
  period = "Monthly",
  currency = "$",
}: BudgetCardProps) {
  const percentage = (spent / limit) * 100;
  const remaining = limit - spent;
  const isWarning = percentage > 80;
  const isOver = percentage > 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {category && (
          <p className="text-xs text-muted-foreground">{category}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent</span>
            <span className="font-semibold">
              {currency}
              {spent.toFixed(2)}
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                isOver
                  ? "bg-red-500"
                  : isWarning
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {percentage.toFixed(0)}% of {currency}
              {limit.toFixed(2)}
            </span>
            <span>
              {remaining > 0 ? "Remaining" : "Over"}: {currency}
              {Math.abs(remaining).toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">{period}</p>
        </div>
      </CardContent>
    </Card>
  );
}
