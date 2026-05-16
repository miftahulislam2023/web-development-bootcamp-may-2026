"use client"

import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/api-client"
import type { StreamSession } from "@/lib/types/stream-session"

const STREAM_HISTORY_QUERY_KEY = "stream-history"
const STREAMS_ENDPOINT = "/api/streams"

interface UseStreamHistoryReturn {
  sessions: StreamSession[]
  isLoading: boolean
  error: Error | null
}

export function useStreamHistory(roomKey: string): UseStreamHistoryReturn {
  const encodedKey = encodeURIComponent(roomKey)

  const { data, isLoading, error } = useQuery<StreamSession[]>({
    queryKey: [STREAM_HISTORY_QUERY_KEY, roomKey],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${STREAMS_ENDPOINT}/${encodedKey}/history`,
      )
      return response.data.data
    },
  })

  return {
    sessions: data ?? [],
    isLoading,
    error: error as Error | null,
  }
}
