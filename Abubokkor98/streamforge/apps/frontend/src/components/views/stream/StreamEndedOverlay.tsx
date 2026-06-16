import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Television } from "@phosphor-icons/react/dist/ssr"

function StreamEndedOverlay({ roomTitle }: { roomTitle: string }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 animate-fade-in-up">
      <div className="rounded-full bg-muted/60 p-5 ring-1 ring-border/50 backdrop-blur-sm">
        <Television className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>

      <div className="space-y-1.5 text-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Stream Ended
        </h1>
        <p className="text-sm text-muted-foreground">
          &ldquo;{roomTitle}&rdquo; has finished broadcasting.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </main>
  )
}

export { StreamEndedOverlay }
