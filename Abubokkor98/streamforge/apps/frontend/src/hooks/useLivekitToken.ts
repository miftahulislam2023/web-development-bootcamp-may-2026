"use client"

import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/api-client"
import type { ApiResponse } from "@/lib/types/api"

interface LiveKitTokenResponse {
  token: string
  identity: string
  roomKey: string
}

const TOKEN_ENDPOINT = "/api/livekit/token"

interface UseLivekitTokenOptions {
  roomKey: string
  isHost: boolean
  guestName?: string
  enabled?: boolean
}

async function fetchToken(
  roomKey: string,
  isHost: boolean,
  guestName?: string,
): Promise<LiveKitTokenResponse> {
  const response = await axiosInstance.post<ApiResponse<LiveKitTokenResponse>>(
    TOKEN_ENDPOINT,
    { roomKey, isHost, guestName },
  )
  return response.data.data
}

export function useLivekitToken({
  roomKey,
  isHost,
  guestName,
  enabled = true,
}: UseLivekitTokenOptions) {
  const { data: tokenData, isLoading, error } = useQuery({
    queryKey: ["livekit-token", roomKey, isHost, guestName],
    queryFn: () => fetchToken(roomKey, isHost, guestName),
    staleTime: Infinity,
    enabled,
  })

  return { tokenData, isLoading, error }
}

export type { LiveKitTokenResponse }
