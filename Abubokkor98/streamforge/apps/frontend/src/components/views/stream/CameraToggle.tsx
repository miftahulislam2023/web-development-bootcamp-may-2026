"use client"

import { useTrackToggle } from "@livekit/components-react"
import { Track } from "livekit-client"
import { Button } from "@/components/ui/button"
import { VideoCamera, VideoCameraSlash } from "@phosphor-icons/react"

function CameraToggle() {
  const { buttonProps, enabled } = useTrackToggle({
    source: Track.Source.Camera,
  })

  const Icon = enabled ? VideoCamera : VideoCameraSlash

  return (
    <Button
      {...buttonProps}
      variant={enabled ? "secondary" : "destructive"}
      size="icon"
      className="size-12 rounded-full transition-colors"
      aria-label={enabled ? "Turn off camera" : "Turn on camera"}
      aria-pressed={enabled}
    >
      <Icon className="size-5" weight={enabled ? "bold" : "fill"} />
    </Button>
  )
}

export { CameraToggle }
