"use client"

import { useState, useCallback } from "react"
import { axiosInstance } from "@/lib/api-client"
import { toast } from "sonner"

type HostStreamPhase = "preview" | "live" | "ended"

interface HostStreamActions {
  phase: HostStreamPhase
  goLive: () => Promise<void>
  endStream: () => Promise<void>
}

const STREAM_ENDPOINT = "/api/streams"

/**
 * Manages only the stream lifecycle (start/end session).
 * Token fetching is handled by TanStack Query in the view.
 */
export function useHostStreamActions(roomKey: string): HostStreamActions {
  const [phase, setPhase] = useState<HostStreamPhase>("preview")

  const goLive = useCallback(async () => {
    const encodedKey = encodeURIComponent(roomKey)
    try {
      await axiosInstance.post(`${STREAM_ENDPOINT}/${encodedKey}/start`)
      setPhase("live")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start stream"
      toast.error(message)
      throw error
    }
  }, [roomKey])

  const endStream = useCallback(async () => {
    const encodedKey = encodeURIComponent(roomKey)
    try {
      await axiosInstance.post(`${STREAM_ENDPOINT}/${encodedKey}/end`)
      setPhase("ended")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to end stream"
      toast.error(message)
      throw error
    }
  }, [roomKey])

  return { phase, goLive, endStream }
}

export type { HostStreamPhase }
