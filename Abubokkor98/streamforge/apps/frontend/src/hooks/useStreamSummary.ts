"use client"

import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/api-client"
import type { StreamSessionSummary } from "@/lib/types/stream-session"

const STREAM_SUMMARY_QUERY_KEY = "stream-summary"
const STREAMS_ENDPOINT = "/api/streams"

interface UseStreamSummaryReturn {
  summary: StreamSessionSummary | null
  isLoading: boolean
  error: Error | null
}

export function useStreamSummary(
  roomKey: string,
  sessionId: string,
): UseStreamSummaryReturn {
  const encodedKey = encodeURIComponent(roomKey)
  const encodedSessionId = encodeURIComponent(sessionId)

  const { data, isLoading, error } = useQuery<StreamSessionSummary>({
    queryKey: [STREAM_SUMMARY_QUERY_KEY, roomKey, sessionId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `${STREAMS_ENDPOINT}/${encodedKey}/summary/${encodedSessionId}`,
      )
      return response.data.data
    },
  })

  return {
    summary: data ?? null,
    isLoading,
    error: error as Error | null,
  }
}
