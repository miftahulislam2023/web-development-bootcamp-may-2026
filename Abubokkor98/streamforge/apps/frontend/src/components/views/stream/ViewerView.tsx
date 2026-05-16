"use client"

import { useState, useEffect, useRef } from "react"
import { LiveKitRoom } from "@livekit/components-react"
import "@livekit/components-styles"
import { useRoom } from "@/hooks/useRoom"
import { useLivekitToken } from "@/hooks/useLivekitToken"
import { useIsAuthenticated } from "@/lib/auth-store"
import { useSocket } from "@/hooks/useSocket"
import { socket } from "@/lib/socket"
import { toast } from "sonner"
import { ViewerStreamLayout } from "@/components/views/stream/ViewerStreamLayout"
import { GuestNamePrompt } from "@/components/views/stream/GuestNamePrompt"
import { WaitingForHost } from "@/components/views/stream/WaitingForHost"
import { HostViewSkeleton } from "@/components/views/stream/HostViewSkeleton"
import { HostViewError } from "@/components/views/stream/HostViewError"
import { StreamEndedOverlay } from "@/components/views/stream/StreamEndedOverlay"

interface ViewerViewProps {
  roomKey: string
}

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL ?? ""

function ViewerView({ roomKey }: ViewerViewProps) {
  const isAuthenticated = useIsAuthenticated()
  const [guestName, setGuestName] = useState<string | null>(null)

  const { room, isLoading: isRoomLoading, error: roomError } = useRoom(roomKey, 15000)

  // Socket connection — auth user or guest
  useSocket({ guestName: guestName ?? undefined })

  // Instant stream-ended detection via Socket.IO (fallback: 15s polling above)
  const [isStreamEnded, setIsStreamEnded] = useState(false)
  const previousStatusRef = useRef<string | null>(null)

  useEffect(() => {
    function onStreamEnded(payload: { roomKey: string }) {
      if (payload.roomKey === roomKey) {
        toast.info("Stream has ended")
        setIsStreamEnded(true)
      }
    }

    socket.on("stream-ended", onStreamEnded)
    return () => {
      socket.off("stream-ended", onStreamEnded)
    }
  }, [roomKey])

  // Detect status transition via polling fallback (LIVE → ENDED)
  const roomStatus = room?.status ?? null

  useEffect(() => {
    if (!roomStatus) return
    if (isStreamEnded) return

    if (previousStatusRef.current === "LIVE" && roomStatus === "ENDED") {
      toast.info("Stream has ended")
      setIsStreamEnded(true)
    }
    previousStatusRef.current = roomStatus
  }, [roomStatus, isStreamEnded])

  // Token is fetched only when the viewer is ready (authenticated OR guest name provided)
  const isReadyToConnect = isAuthenticated || guestName !== null
  const { tokenData, isLoading: isTokenLoading, error: tokenError } =
    useLivekitToken({
      roomKey,
      isHost: false,
      guestName: guestName ?? undefined,
      enabled: isReadyToConnect && room?.status === "LIVE",
    })

  if (!LIVEKIT_URL) {
    return <HostViewError message="NEXT_PUBLIC_LIVEKIT_URL is not defined in environment variables." />
  }

  if (isRoomLoading) {
    return <HostViewSkeleton />
  }

  if (roomError) {
    return <HostViewError message={roomError.message} />
  }

  if (!room) {
    return <HostViewError message="Room not found" />
  }

  if (room.status !== "LIVE" || isStreamEnded) {
    return room.status === "ENDED" || isStreamEnded
      ? <StreamEndedOverlay roomTitle={room.title} />
      : <WaitingForHost roomTitle={room.title} hostName={room.hostName} />
  }

  // Guest flow: prompt for display name before connecting
  if (!isAuthenticated && guestName === null) {
    return <GuestNamePrompt roomTitle={room.title} onSubmit={setGuestName} />
  }

  if (isTokenLoading) {
    return <HostViewSkeleton />
  }

  if (tokenError) {
    return <HostViewError message={tokenError.message} />
  }

  if (!tokenData) {
    return <HostViewError message="Failed to join stream" />
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={tokenData.token}
      connect={true}
      video={false}
      audio={false}
    >
      <ViewerStreamLayout
        room={room}
        guestChatEnabled={room.guestChatEnabled}
      />
    </LiveKitRoom>
  )
}

export { ViewerView }
