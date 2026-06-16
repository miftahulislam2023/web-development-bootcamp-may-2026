"use client"

import { useStreamTimer } from "@/hooks/useStreamTimer"
import { Timer, Eye, CircleDashed } from "@phosphor-icons/react"

interface StreamStatsProps {
  isLive: boolean
  viewerCount: number
}

function StreamStats({ isLive, viewerCount }: StreamStatsProps) {
  const { formattedTime } = useStreamTimer(isLive)

  if (!isLive) {
    return (
      <aside
        className="flex items-center gap-3 text-sm text-muted-foreground"
        aria-label="Stream status"
      >
        <span className="flex items-center gap-1.5">
          <CircleDashed className="size-4" weight="bold" />
          Preview
        </span>
      </aside>
    )
  }

  return (
    <aside
      className="flex items-center gap-3 text-sm"
      aria-label="Stream statistics"
    >
      <span className="flex items-center gap-1.5 rounded-full bg-live/15 px-3 py-1 font-semibold text-live">
        <span
          className="size-2 animate-pulse rounded-full bg-live"
          aria-hidden="true"
        />
        LIVE
      </span>
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Timer className="size-4" weight="bold" />
        <time>{formattedTime}</time>
      </span>
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Eye className="size-4" weight="bold" />
        {viewerCount}
      </span>
    </aside>
  )
}

export { StreamStats }
