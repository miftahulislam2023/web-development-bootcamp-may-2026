interface BudgetCardProps {
  budgetAmount: number
  totalExpense: number
  remainingAmount: number
  percentageUsed: string
}

export default function BudgetProgressCard({
  budgetAmount,
  totalExpense,
  remainingAmount,
  percentageUsed,
}: BudgetCardProps) {
  return (
    <div className="bg-card rounded-3xl border p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold">
            Monthly Budget
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your spending progress
          </p>
        </div>

        <div className="rounded-2xl bg-muted px-3 py-2 text-sm font-medium">
          {percentageUsed}%
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">

        <div className="mb-2 flex items-center justify-between text-sm">

          <span className="text-muted-foreground">
            Spent
          </span>

          <span className="font-medium">
            ${totalExpense} / ${budgetAmount}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-muted">

          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${percentageUsed}%`,
            }}
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-muted/50 p-4">

        <div>

          <p className="text-sm text-muted-foreground">
            Remaining
          </p>

          <h3 className="mt-1 text-2xl font-semibold">
            ${remainingAmount}
          </h3>
        </div>

        <div className="text-right">

          <p className="text-sm text-muted-foreground">
            Budget
          </p>

          <h3 className="mt-1 text-2xl font-semibold">
            ${budgetAmount}
          </h3>
        </div>
      </div>
    </div>
  )
}