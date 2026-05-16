import { z } from 'zod';

const MAX_MESSAGE_LENGTH = 300;

export const sendMessageSchema = z.object({
  roomKey: z.string().min(1),
  text: z.string().min(1).max(MAX_MESSAGE_LENGTH),
});

export const deleteMessageSchema = z.object({
  messageId: z.number().int().positive(),
  roomKey: z.string().min(1),
});

export const pinMessageSchema = z.object({
  messageId: z.number().int().positive(),
  roomKey: z.string().min(1),
  isPinned: z.boolean(),
});
