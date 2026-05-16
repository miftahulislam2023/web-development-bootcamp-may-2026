import { z } from "zod";

export const createRoomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Room name is required.")
    .max(80, "Room name must be at most 80 characters."),
  description: z
    .string()
    .trim()
    .max(300, "Description must be at most 300 characters.")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value && value.length > 0 ? value : undefined)),
});

export const joinRoomSchema = z.object({
  roomId: z.string().min(1, "roomId is required."),
});
