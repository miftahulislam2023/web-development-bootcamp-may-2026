"use client"

import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/api-client"
import type { Room } from "@/lib/types/room"
import type { ApiResponse } from "@/lib/types/api"

const ROOMS_ENDPOINT = "/api/rooms"
const ROOM_STALE_TIME = 5 * 60 * 1000
const ROOM_GC_TIME = 30 * 60 * 1000

async function fetchRoom(roomKey: string): Promise<Room> {
  const encodedKey = encodeURIComponent(roomKey)
  const response = await axiosInstance.get<ApiResponse<Room>>(
    `${ROOMS_ENDPOINT}/${encodedKey}`,
  )
  return response.data.data
}

export function useRoom(roomKey: string, refetchInterval?: number) {
  const { data: room, isLoading, error } = useQuery({
    queryKey: ["room", roomKey],
    queryFn: () => fetchRoom(roomKey),
    staleTime: refetchInterval ? 0 : ROOM_STALE_TIME,
    gcTime: ROOM_GC_TIME,
    refetchInterval,
  })

  return { room, isLoading, error }
}
