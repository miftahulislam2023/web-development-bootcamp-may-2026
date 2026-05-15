interface StatsCardProps {
  title: string
  amount: string
  icon: React.ReactNode
  description?: string
}

export default function StatsCard({
  title,
  amount,
  icon,
  description,
}: StatsCardProps) {
  return (
    <div className="bg-card rounded-3xl border p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between">

        <div className="space-y-2">

          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="text-3xl font-semibold tracking-tight">
            {amount}
          </h2>

          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="bg-muted rounded-2xl border p-3">
          {icon}
        </div>
      </div>
    </div>
  )
}