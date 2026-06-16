"use client"

import { useConnectionState } from "@livekit/components-react"
import { ConnectionState } from "livekit-client"
import { WifiSlash } from "@phosphor-icons/react"

/**
 * Reconnection overlay — shown inside a <LiveKitRoom> context when the
 * SDK detects a network disruption and is automatically attempting to
 * reconnect. LiveKit handles all reconnection logic internally
 * (ICE restart, signaling re-establishment); this component only
 * provides visual feedback.
 */
function ReconnectionOverlay() {
  const connectionState = useConnectionState()

  if (connectionState !== ConnectionState.Reconnecting) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm"
      role="alert"
      aria-live="assertive"
    >
      <WifiSlash className="size-10 animate-pulse text-warning" weight="bold" />
      <p className="text-sm font-medium text-foreground">Reconnecting…</p>
      <p className="text-xs text-muted-foreground">
        Please wait while we restore your connection
      </p>
    </div>
  )
}

export { ReconnectionOverlay }
