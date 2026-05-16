import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  accent?: boolean
}

function StatCard({ icon, label, value, accent }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
      <CardContent className="flex flex-col gap-2 pt-5">
        <div
          className={`inline-flex size-10 items-center justify-center rounded-lg ${
            accent
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {icon}
        </div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

export { StatCard }
