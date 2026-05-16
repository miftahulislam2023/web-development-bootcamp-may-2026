import { z } from "zod";

export const sendMessageSchema = z.object({
  roomId: z.string().min(1, "roomId is required."),
  content: z
    .string()
    .trim()
    .min(1, "Message content is required.")
    .max(2000, "Message content must be at most 2000 characters."),
});

export const getMessagesQuerySchema = z.object({
  roomId: z.string().min(1, "roomId is required."),
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
