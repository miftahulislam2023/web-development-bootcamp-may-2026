import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BudgetCardProps = {
  title: string;
  spent: number;
  limit: number;
  category?: string;
  period?: string;
  currency?: string;
};

export default function BudgetCard({
  title,
  spent,
  limit,
  category,
  period = "Monthly",
  currency = "$",
}: BudgetCardProps) {
  const normalizedSpent = Number(spent);
  const normalizedLimit = Number(limit);
  const percentage =
    normalizedLimit > 0 ? (normalizedSpent / normalizedLimit) * 100 : 0;
  const remaining = normalizedLimit - normalizedSpent;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {category ? (
          <p className="text-xs text-muted-foreground">{category}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Spent</span>
          <span className="font-semibold">
            {currency}
            {Number.isFinite(normalizedSpent)
              ? normalizedSpent.toFixed(2)
              : "0.00"}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {percentage.toFixed(0)}% of {currency}
            {Number.isFinite(normalizedLimit)
              ? normalizedLimit.toFixed(2)
              : "0.00"}
          </span>
          <span>
            {remaining > 0 ? "Remaining" : "Over"}: {currency}
            {Math.abs(remaining).toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{period}</p>
      </CardContent>
    </Card>
  );
}
