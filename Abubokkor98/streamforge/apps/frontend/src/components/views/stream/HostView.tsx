"use client"

import { LiveKitRoom } from "@livekit/components-react"
import "@livekit/components-styles"
import { useRoom } from "@/hooks/useRoom"
import { useLivekitToken } from "@/hooks/useLivekitToken"
import { useHostStreamActions } from "@/hooks/useHostStream"
import { useSocket } from "@/hooks/useSocket"
import { HostBroadcastLayout } from "@/components/views/stream/HostBroadcastLayout"
import { HostViewSkeleton } from "@/components/views/stream/HostViewSkeleton"
import { HostViewError } from "@/components/views/stream/HostViewError"
import { StreamEndedOverlay } from "@/components/views/stream/StreamEndedOverlay"

interface HostViewProps {
  roomKey: string
}

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL ?? ""

function HostView({ roomKey }: HostViewProps) {
  const { room, isLoading: isRoomLoading, error: roomError } = useRoom(roomKey)
  const { tokenData, isLoading: isTokenLoading, error: tokenError } =
    useLivekitToken({ roomKey, isHost: true })
  const { phase, goLive, endStream } = useHostStreamActions(roomKey)

  // Socket connection for host
  useSocket()

  if (!LIVEKIT_URL) {
    return <HostViewError message="NEXT_PUBLIC_LIVEKIT_URL is not defined in environment variables." />
  }

  if (isRoomLoading || isTokenLoading) {
    return <HostViewSkeleton />
  }

  const errorMessage = roomError?.message ?? tokenError?.message
  if (errorMessage) {
    return <HostViewError message={errorMessage} />
  }

  if (!tokenData || !room) {
    return <HostViewError message="Failed to initialize broadcast" />
  }

  if (phase === "ended") {
    return <StreamEndedOverlay roomTitle={room.title} />
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={tokenData.token}
      connect={true}
      video={true}
      audio={true}
    >
      <HostBroadcastLayout
        room={room}
        isLive={phase === "live"}
        onGoLive={goLive}
        onEndStream={endStream}
      />
    </LiveKitRoom>
  )
}

export { HostView }
