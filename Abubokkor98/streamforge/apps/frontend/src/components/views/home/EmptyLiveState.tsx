import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Broadcast, Lightning } from "@phosphor-icons/react/dist/ssr"

function EmptyLiveState() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      {/* Animated broadcast icon */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" aria-hidden="true" />
        <div className="relative flex size-20 items-center justify-center rounded-full border border-border/60 bg-card/80 backdrop-blur-sm">
          <Broadcast size={36} weight="duotone" className="text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          No one is live right now
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          All creators are currently offline. Be the first to go live, or check
          back later for broadcasts.
        </p>
      </div>

      <Button variant="outline" size="sm" className="gap-2" asChild>
        <Link href="/dashboard">
          <Lightning size={14} weight="fill" />
          Start Your First Stream
        </Link>
      </Button>
    </div>
  )
}

export { EmptyLiveState }
