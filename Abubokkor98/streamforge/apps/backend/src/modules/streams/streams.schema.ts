import { z } from 'zod';

export const roomKeyParam = z.object({
  roomKey: z.string().min(1, { error: 'Room key is required' }),
});

export const sessionDetailParam = z.object({
  roomKey: z.string().min(1, { error: 'Room key is required' }),
  sessionId: z.coerce.number().int().positive({ error: 'Valid session ID is required' }),
});

export type StreamRoomKeyParam = z.infer<typeof roomKeyParam>;
export type SessionDetailParam = z.infer<typeof sessionDetailParam>;
