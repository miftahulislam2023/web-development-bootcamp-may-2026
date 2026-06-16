"use client"

import { useEffect, useRef, useState } from "react"
import { socket } from "@/lib/socket"
import { useAuthStore } from "@/lib/auth-store"
import { toast } from "sonner"

interface UseSocketOptions {
  guestName?: string
}

interface UseSocketReturn {
  isConnected: boolean
  connectionError: string | null
}

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { guestName } = options
  const accessToken = useAuthStore((state) => state.accessToken)

  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Track whether we had a previous successful connection (for reconnect toasts)
  const hadConnectionRef = useRef(false)

  useEffect(() => {
    if (accessToken) {
      socket.auth = { token: accessToken }
    } else if (guestName) {
      socket.auth = { guestName }
    } else {
      return
    }

    socket.connect()

    function onConnect() {
      setIsConnected(true)
      setConnectionError(null)

      if (hadConnectionRef.current) {
        toast.success("Reconnected to server")
      }
      hadConnectionRef.current = true
    }

    function onDisconnect(reason: string) {
      setIsConnected(false)

      // Only show toast for unexpected disconnects (not intentional cleanup)
      const isUnexpected =
        reason === "transport close" ||
        reason === "transport error" ||
        reason === "ping timeout"

      if (isUnexpected) {
        toast.error("Connection lost. Reconnecting…")
      }
    }

    function onConnectError(error: Error) {
      setConnectionError(error.message)
      setIsConnected(false)

      // Only show toast once (not on every retry attempt)
      if (!hadConnectionRef.current) {
        toast.error("Unable to connect to chat server")
      }
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("connect_error", onConnectError)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("connect_error", onConnectError)
      socket.disconnect()
    }
  }, [accessToken, guestName])

  return { isConnected, connectionError }
}
