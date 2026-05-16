"use client"

import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/api-client"
import type { StreamSessionSummary } from "@/lib/types/stream-session"

const ALL_HISTORY_QUERY_KEY = "all-stream-history"
const ALL_HISTORY_ENDPOINT = "/api/streams/my-history"

interface UseAllStreamHistoryReturn {
  sessions: StreamSessionSummary[]
  isLoading: boolean
  error: Error | null
}

export function useAllStreamHistory(): UseAllStreamHistoryReturn {
  const { data, isLoading, error } = useQuery<StreamSessionSummary[]>({
    queryKey: [ALL_HISTORY_QUERY_KEY],
    queryFn: async () => {
      const response = await axiosInstance.get(ALL_HISTORY_ENDPOINT)
      return response.data.data
    },
  })

  return {
    sessions: data ?? [],
    isLoading,
    error: error as Error | null,
  }
}
