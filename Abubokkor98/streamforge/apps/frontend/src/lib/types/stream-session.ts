/**
 * Frontend StreamSession types — matches backend response shapes (camelCase).
 */

export interface StreamSession {
  id: number
  roomId: number
  startedAt: string
  endedAt: string | null
  durationSeconds: number | null
  peakViewerCount: number
  totalChatMessages: number
}

export interface StreamSessionSummary extends StreamSession {
  roomTitle: string
  roomKey: string
  hostName: string
}
