export interface StreamSessionResponse {
  id: number;
  roomId: number;
  startedAt: Date;
  endedAt: Date | null;
  durationSeconds: number | null;
  peakViewerCount: number;
  totalChatMessages: number;
}

export interface StreamSessionSummary extends StreamSessionResponse {
  roomTitle: string;
  roomKey: string;
  hostName: string;
}
