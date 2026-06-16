"use client"

import { useTrackToggle } from "@livekit/components-react"
import { Track } from "livekit-client"
import { Button } from "@/components/ui/button"
import { Monitor } from "@phosphor-icons/react"

function ScreenShareToggle() {
  const { buttonProps, enabled } = useTrackToggle({
    source: Track.Source.ScreenShare,
  })

  return (
    <Button
      {...buttonProps}
      variant={enabled ? "default" : "secondary"}
      size="icon"
      className="size-12 rounded-full transition-colors"
      aria-label={enabled ? "Stop screen share" : "Share screen"}
      aria-pressed={enabled}
    >
      <Monitor className="size-5" weight={enabled ? "fill" : "bold"} />
    </Button>
  )
}

export { ScreenShareToggle }
