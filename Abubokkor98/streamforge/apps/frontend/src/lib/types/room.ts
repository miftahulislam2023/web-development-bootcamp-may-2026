/**
 * Frontend Room type — matches backend RoomResponse (camelCase).
 */

type RoomStatus = "OFFLINE" | "LIVE" | "ENDED"

interface Room {
  id: number
  roomKey: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  status: RoomStatus
  slowModeInterval: number | null
  guestChatEnabled: boolean
  hostName: string
  hostAvatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export type { Room, RoomStatus }

