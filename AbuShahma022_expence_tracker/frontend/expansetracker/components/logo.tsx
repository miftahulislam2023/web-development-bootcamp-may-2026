import { Wallet } from "lucide-react"

export const Logo = ({
  className,
}: {
  className?: string
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
        <Wallet className="size-5" />
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight">
          ExpenseTracker
        </span>

        <span className="text-xs text-muted-foreground">
          Smart Finance Management
        </span>
      </div>
    </div>
  )
}

export const LogoIcon = ({
  className,
}: {
  className?: string
}) => {
  return (
    <div
      className={`flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm ${className}`}>
      <Wallet className="size-5" />
    </div>
  )
}