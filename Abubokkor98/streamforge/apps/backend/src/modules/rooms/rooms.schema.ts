import { z } from 'zod';

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;
const SLOW_MODE_MIN_SECONDS = 1;
const SLOW_MODE_MAX_SECONDS = 60;

export const createRoomSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: 'Title is required' })
    .max(TITLE_MAX_LENGTH, { error: `Title must not exceed ${TITLE_MAX_LENGTH} characters` }),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH, {
      error: `Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters`,
    })
    .optional(),
  slowModeInterval: z
    .number()
    .int({ error: 'Slow mode interval must be a whole number' })
    .min(SLOW_MODE_MIN_SECONDS, {
      error: `Slow mode interval must be at least ${SLOW_MODE_MIN_SECONDS} second`,
    })
    .max(SLOW_MODE_MAX_SECONDS, {
      error: `Slow mode interval must not exceed ${SLOW_MODE_MAX_SECONDS} seconds`,
    })
    .nullable()
    .optional(),
  guestChatEnabled: z.boolean().optional(),
});

export const updateRoomSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: 'Title cannot be empty' })
    .max(TITLE_MAX_LENGTH, { error: `Title must not exceed ${TITLE_MAX_LENGTH} characters` })
    .optional(),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH, {
      error: `Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters`,
    })
    .nullable()
    .optional(),
  slowModeInterval: z
    .number()
    .int({ error: 'Slow mode interval must be a whole number' })
    .min(SLOW_MODE_MIN_SECONDS, {
      error: `Slow mode interval must be at least ${SLOW_MODE_MIN_SECONDS} second`,
    })
    .max(SLOW_MODE_MAX_SECONDS, {
      error: `Slow mode interval must not exceed ${SLOW_MODE_MAX_SECONDS} seconds`,
    })
    .nullable()
    .optional(),
  guestChatEnabled: z.boolean().optional(),
});

export const roomKeyParam = z.object({
  roomKey: z.string().min(1, { error: 'Room key is required' }),
});

export type CreateRoomSchemaInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomSchemaInput = z.infer<typeof updateRoomSchema>;
export type RoomKeyParam = z.infer<typeof roomKeyParam>;
