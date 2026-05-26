// admin.validation.ts
import { z } from "zod";

const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export const getAllUsersSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export const suspendUserSchema = z.object({
  params: z.object({
    userId: z.string().min(10),
  }),
  body: z.object({
    reason: z.string().min(3).max(500).optional(),
  }),
});

export const unsuspendUserSchema = z.object({
  params: z.object({
    userId: z.string().min(10),
  }),
});

export const deleteConversationSchema = z.object({
  params: z.object({
conversationId: z.string().min(20).max(40)
  }),
});

export const getConversationsSchema = paginationSchema;