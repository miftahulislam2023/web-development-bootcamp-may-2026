"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/api-client"
import type { Room } from "@/lib/types/room"
import type { ApiResponse } from "@/lib/types/api"

const ROOMS_ENDPOINT = "/api/rooms/mine"
const ROOMS_QUERY_KEY = ["rooms", "mine"] as const
const ROOMS_STALE_TIME = 5 * 60 * 1000
const ROOMS_GC_TIME = 30 * 60 * 1000

async function fetchRooms(): Promise<Room[]> {
  const response =
    await axiosInstance.get<ApiResponse<Room[]>>(ROOMS_ENDPOINT)
  return response.data.data
}

export function useRooms() {
  const queryClient = useQueryClient()

  const { data: rooms = [], isLoading, error } = useQuery({
    queryKey: ROOMS_QUERY_KEY,
    queryFn: fetchRooms,
    staleTime: ROOMS_STALE_TIME,
    gcTime: ROOMS_GC_TIME,
  })

  function refetch() {
    queryClient.invalidateQueries({ queryKey: ROOMS_QUERY_KEY })
  }

  return { rooms, isLoading, error, refetch }
}
