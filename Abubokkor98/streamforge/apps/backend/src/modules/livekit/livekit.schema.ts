import { z } from 'zod';

const GUEST_NAME_MIN_LENGTH = 2;
const GUEST_NAME_MAX_LENGTH = 30;

export const livekitTokenSchema = z
  .object({
    roomKey: z.string().min(1, { error: 'Room key is required' }),
    isHost: z.boolean(),
    guestName: z
      .string()
      .trim()
      .min(GUEST_NAME_MIN_LENGTH, {
        error: `Guest name must be at least ${GUEST_NAME_MIN_LENGTH} characters`,
      })
      .max(GUEST_NAME_MAX_LENGTH, {
        error: `Guest name must not exceed ${GUEST_NAME_MAX_LENGTH} characters`,
      })
      .optional(),
  });

export type LiveKitTokenSchemaInput = z.infer<typeof livekitTokenSchema>;
