import z from "zod";

export const createConversationSchema = z.object({
  participantId: z
    .string("Participant id is required.")
    .trim()
    .nonempty("Participant id cannot be empty."),
});

export type TCreateConversationSchema = z.infer<
  typeof createConversationSchema
>;
