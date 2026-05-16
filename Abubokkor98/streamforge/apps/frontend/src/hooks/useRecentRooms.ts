"use client"

import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/api-client"
import type { RecentRoom } from "@/lib/types/home"

const RECENT_ROOMS_QUERY_KEY = "recent-rooms"
const RECENT_ROOMS_ENDPOINT = "/api/rooms/recent"

interface UseRecentRoomsReturn {
  rooms: RecentRoom[]
  isLoading: boolean
  error: Error | null
}

export function useRecentRooms(): UseRecentRoomsReturn {
  const { data, isLoading, error } = useQuery<RecentRoom[]>({
    queryKey: [RECENT_ROOMS_QUERY_KEY],
    queryFn: async () => {
      const response = await axiosInstance.get(RECENT_ROOMS_ENDPOINT)
      return response.data.data
    },
  })

  return {
    rooms: data ?? [],
    isLoading,
    error: error as Error | null,
  }
}
