import type { StreamSession, Room, User } from '@prisma/client';
import type { StreamSessionResponse, StreamSessionSummary } from '@/modules/streams/streams.types';

export function toStreamSessionResponse(session: StreamSession): StreamSessionResponse {
  return {
    id: session.id,
    roomId: session.room_id,
    startedAt: session.started_at,
    endedAt: session.ended_at,
    durationSeconds: session.duration_seconds,
    peakViewerCount: session.peak_viewer_count,
    totalChatMessages: session.total_chat_messages,
  };
}

type SessionWithRoomAndHost = StreamSession & {
  room: Room & { host: Pick<User, 'name'> };
};

export function toStreamSessionSummary(session: SessionWithRoomAndHost): StreamSessionSummary {
  return {
    ...toStreamSessionResponse(session),
    roomTitle: session.room.title,
    roomKey: session.room.room_key,
    hostName: session.room.host.name,
  };
}
