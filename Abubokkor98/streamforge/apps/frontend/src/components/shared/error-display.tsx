import { WarningCircle } from "@phosphor-icons/react/dist/ssr"

interface ErrorDisplayProps {
  title: string
  message?: string
  action?: React.ReactNode
  fullPage?: boolean
}

function ErrorDisplay({
  title,
  message,
  action,
  fullPage = false,
}: ErrorDisplayProps) {
  const containerClass = fullPage
    ? "flex min-h-dvh flex-col items-center justify-center gap-4"
    : "flex flex-col items-center gap-4 py-20 text-center"

  return (
    <section className={containerClass} role="alert">
      <div className="rounded-full bg-destructive/10 p-3">
        <WarningCircle
          className="size-6 text-destructive"
          weight="fill"
          aria-hidden="true"
        />
      </div>
      <h2 className="text-lg font-semibold text-destructive">{title}</h2>
      {message && (
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          {message}
        </p>
      )}
      {action}
    </section>
  )
}

export { ErrorDisplay }
