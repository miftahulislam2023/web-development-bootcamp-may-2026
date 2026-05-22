import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import {
	conversation,
	message,
	messageEditHistory,
	messageReaction,
	messageStatus,
	participant,
} from "../schema/chat";

// Shared field constraints for chat tables.
export const CONVERSATION_NAME_MAX = 80;
export const CONVERSATION_AVATAR_URL_MAX = 2048;
export const PARTICIPANT_NICKNAME_MAX = 80;
export const MESSAGE_IMAGE_URL_MAX = 2048;
export const MESSAGE_REACTION_EMOJI_MAX = 32;

const conversationFieldOverrides = {
	name: (schema: z.ZodString) => schema.min(1).max(CONVERSATION_NAME_MAX),
	avatarUrl: (schema: z.ZodString) => schema.max(CONVERSATION_AVATAR_URL_MAX),
};

const participantFieldOverrides = {
	nickname: (schema: z.ZodString) => schema.min(1).max(PARTICIPANT_NICKNAME_MAX),
};

const messageFieldOverrides = {
	sequenceNumber: (schema: z.ZodNumber) => schema.int().min(1),
	contentIv: (schema: z.ZodString) => schema.min(1),
	contentEnc: (schema: z.ZodString) => schema.min(1),
	imageUrl: (schema: z.ZodString) => schema.max(MESSAGE_IMAGE_URL_MAX),
};

const messageEditHistoryOverrides = {
	prevContentIv: (schema: z.ZodString) => schema.min(1),
	prevContentEnc: (schema: z.ZodString) => schema.min(1),
};

const messageReactionOverrides = {
	emoji: (schema: z.ZodString) => schema.min(1).max(MESSAGE_REACTION_EMOJI_MAX),
};

export const conversationSelectSchema = createSelectSchema(conversation, conversationFieldOverrides);
export const conversationInsertSchema = createInsertSchema(conversation, conversationFieldOverrides);
export const conversationUpdateSchema = createUpdateSchema(conversation, conversationFieldOverrides);

export const participantSelectSchema = createSelectSchema(participant, participantFieldOverrides);
export const participantInsertSchema = createInsertSchema(participant, participantFieldOverrides);
export const participantUpdateSchema = createUpdateSchema(participant, participantFieldOverrides);

export const messageSelectSchema = createSelectSchema(message, messageFieldOverrides);
export const messageInsertSchema = createInsertSchema(message, messageFieldOverrides);
export const messageUpdateSchema = createUpdateSchema(message, messageFieldOverrides);

export const messageEditHistorySelectSchema = createSelectSchema(
	messageEditHistory,
	messageEditHistoryOverrides,
);
export const messageEditHistoryInsertSchema = createInsertSchema(
	messageEditHistory,
	messageEditHistoryOverrides,
);
export const messageEditHistoryUpdateSchema = createUpdateSchema(
	messageEditHistory,
	messageEditHistoryOverrides,
);

export const messageStatusSelectSchema = createSelectSchema(messageStatus);
export const messageStatusInsertSchema = createInsertSchema(messageStatus);
export const messageStatusUpdateSchema = createUpdateSchema(messageStatus);

export const messageReactionSelectSchema = createSelectSchema(messageReaction, messageReactionOverrides);
export const messageReactionInsertSchema = createInsertSchema(messageReaction, messageReactionOverrides);
export const messageReactionUpdateSchema = createUpdateSchema(messageReaction, messageReactionOverrides);

export type ConversationSelect = z.infer<typeof conversationSelectSchema>;
export type ConversationInsert = z.infer<typeof conversationInsertSchema>;
export type ConversationUpdate = z.infer<typeof conversationUpdateSchema>;

export type ParticipantSelect = z.infer<typeof participantSelectSchema>;
export type ParticipantInsert = z.infer<typeof participantInsertSchema>;
export type ParticipantUpdate = z.infer<typeof participantUpdateSchema>;

export type MessageSelect = z.infer<typeof messageSelectSchema>;
export type MessageInsert = z.infer<typeof messageInsertSchema>;
export type MessageUpdate = z.infer<typeof messageUpdateSchema>;

export type MessageEditHistorySelect = z.infer<typeof messageEditHistorySelectSchema>;
export type MessageEditHistoryInsert = z.infer<typeof messageEditHistoryInsertSchema>;
export type MessageEditHistoryUpdate = z.infer<typeof messageEditHistoryUpdateSchema>;

export type MessageStatusSelect = z.infer<typeof messageStatusSelectSchema>;
export type MessageStatusInsert = z.infer<typeof messageStatusInsertSchema>;
export type MessageStatusUpdate = z.infer<typeof messageStatusUpdateSchema>;

export type MessageReactionSelect = z.infer<typeof messageReactionSelectSchema>;
export type MessageReactionInsert = z.infer<typeof messageReactionInsertSchema>;
export type MessageReactionUpdate = z.infer<typeof messageReactionUpdateSchema>;
