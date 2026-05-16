"use client"

import { useTrackToggle } from "@livekit/components-react"
import { Track } from "livekit-client"
import { Button } from "@/components/ui/button"
import { Microphone, MicrophoneSlash } from "@phosphor-icons/react"

function MicToggle() {
  const { buttonProps, enabled } = useTrackToggle({
    source: Track.Source.Microphone,
  })

  const Icon = enabled ? Microphone : MicrophoneSlash

  return (
    <Button
      {...buttonProps}
      variant={enabled ? "secondary" : "destructive"}
      size="icon"
      className="size-12 rounded-full transition-colors"
      aria-label={enabled ? "Mute microphone" : "Unmute microphone"}
      aria-pressed={enabled}
    >
      <Icon className="size-5" weight={enabled ? "bold" : "fill"} />
    </Button>
  )
}

export { MicToggle }
