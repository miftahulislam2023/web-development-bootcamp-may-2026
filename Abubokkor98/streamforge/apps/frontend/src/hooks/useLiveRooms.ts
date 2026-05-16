"use client"

import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/api-client"
import type { LiveRoom } from "@/lib/types/home"

const LIVE_ROOMS_QUERY_KEY = "live-rooms"
const LIVE_ROOMS_ENDPOINT = "/api/rooms/live"
const LIVE_ROOMS_POLL_INTERVAL_MS = 30_000

interface UseLiveRoomsReturn {
  rooms: LiveRoom[]
  isLoading: boolean
  error: Error | null
}

export function useLiveRooms(): UseLiveRoomsReturn {
  const { data, isLoading, error } = useQuery<LiveRoom[]>({
    queryKey: [LIVE_ROOMS_QUERY_KEY],
    queryFn: async () => {
      const response = await axiosInstance.get(LIVE_ROOMS_ENDPOINT)
      return response.data.data
    },
    refetchInterval: LIVE_ROOMS_POLL_INTERVAL_MS,
  })

  return {
    rooms: data ?? [],
    isLoading,
    error: error as Error | null,
  }
}
