/**
 * Frontend types for public homepage room data.
 * Matches backend LiveRoomResponse and RecentRoomResponse shapes.
 */

export interface LiveRoom {
  roomKey: string
  title: string
  description: string | null
  hostName: string
  viewerCount: number
  startedAt: string
}

export interface RecentRoom {
  roomKey: string
  title: string
  hostName: string
  endedAt: string
  durationSeconds: number | null
  peakViewerCount: number
  totalChatMessages: number
}
