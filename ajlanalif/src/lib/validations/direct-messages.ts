import { z } from "zod";

export const createOrOpenConversationSchema = z.object({
  targetUserId: z.string().min(1, "targetUserId is required."),
});

export const searchUsersQuerySchema = z.object({
  q: z.string().trim().max(50).optional(),
});

export const sendDirectMessageSchema = z.object({
  conversationId: z.string().min(1, "conversationId is required."),
  content: z
    .string()
    .trim()
    .min(1, "Message content is required.")
    .max(2000, "Message content must be at most 2000 characters."),
});

export const getDirectMessagesQuerySchema = z.object({
  conversationId: z.string().min(1, "conversationId is required."),
  cursor: z.string().min(1).optional(),
  limit: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return 20;
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return 20;
      return Math.min(Math.max(Math.trunc(parsed), 1), 100);
    }),
});
