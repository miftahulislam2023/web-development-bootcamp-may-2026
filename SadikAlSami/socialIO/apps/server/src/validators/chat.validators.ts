import { z } from 'zod';

import {
	CONVERSATION_NAME_MAX,
	MESSAGE_REACTION_EMOJI_MAX,
	// conversationInsertSchema,
	conversationSelectSchema,
	conversationUpdateSchema,
	messageInsertSchema,
	messageReactionInsertSchema,
	messageReactionSelectSchema,
	messageSelectSchema,
	messageStatusInsertSchema,
	messageStatusSelectSchema,
	participantInsertSchema,
	participantSelectSchema,
	participantUpdateSchema,
} from '@socialIO/db/validators/chat.validators';

export const MESSAGE_CONTENT_MIN = 1;
export const MESSAGE_CONTENT_MAX = 4000;
export const MESSAGE_PAGE_SIZE_DEFAULT = 30;
export const MESSAGE_PAGE_SIZE_MAX = 50;

export const conversationIdParamSchema = z.object({
	id: z.string().min(1),
});

export const messageIdParamSchema = z.object({
	id: z.string().min(1),
	msgId: z.string().min(1),
});

export const memberUserIdParamSchema = z.object({
	userId: z.string().min(1),
});

export const reactionEmojiParamSchema = z.object({
	emoji: z.string().min(1).max(MESSAGE_REACTION_EMOJI_MAX),
});

export const createDmConversationBodySchema = z.object({
	type: z.literal('dm'),
	participantId: z.string().min(1),
});

export const createGroupConversationBodySchema = z.object({
	type: z.literal('group'),
	name: z.string().min(1).max(CONVERSATION_NAME_MAX),
	participantIds: z.array(z.string().min(1)).min(1).max(49),
	avatarUrl: z.url().optional(),
});

export const createConversationBodySchema = z.discriminatedUnion('type', [
	createDmConversationBodySchema,
	createGroupConversationBodySchema,
]);

export const updateConversationBodySchema = conversationUpdateSchema
	.pick({ name: true, avatarUrl: true })
	.superRefine((data, ctx) => {
		if (!data.name && !data.avatarUrl) {
			ctx.addIssue({
				code: 'custom',
				message: 'name or avatarUrl is required',
				path: ['name'],
			});
		}
	});

export const conversationResponseSchema = conversationSelectSchema;

/** Minimal participant info */
export const conversationListParticipantSchema = z.object({
	userId: z.string(),
	displayName: z.string().nullable(),
	avatarUrl: z.string().nullable(),
});

export const conversationListItemSchema = conversationResponseSchema.extend({
	participants: z.array(conversationListParticipantSchema),
	lastMessage: z
		.object({
			id: z.string(),
			content: z.string().nullable(),
			type: z.enum(['text', 'image', 'system']),
			isDeleted: z.boolean(),
			createdAt: z.date(),
			senderId: z.string(),
			senderName: z.string().nullable(),
		})
		.nullable(),
	unreadCount: z.number().int().min(0).default(0),
});

export const conversationParticipantSchema = z.object({
	id: z.string(),
	userId: z.string(),
	role: z.enum(['admin', 'member']),
	nickname: z.string().nullable(),
	joinedAt: z.date(),
	displayName: z.string().nullable(),
	avatarUrl: z.string().nullable(),
});

export const conversationDetailResponseSchema = conversationResponseSchema.extend({
	participants: z.array(conversationParticipantSchema),
});

export const createGroupBodySchema = z.object({
	name: z.string().min(1).max(CONVERSATION_NAME_MAX),
	participantIds: z.array(z.string()).min(1).max(49),
	avatarUrl: z.url().optional(),
});

const messageTypeInputSchema = z.enum(['text', 'image']);

export const createMessageBodySchema = messageInsertSchema
	.pick({ replyToId: true, imageUrl: true })
	.extend({
		type: messageTypeInputSchema,
		content: z.string().min(MESSAGE_CONTENT_MIN).max(MESSAGE_CONTENT_MAX),
	})
	.superRefine((data, ctx) => {
		if (data.type === 'image' && !data.imageUrl) {
			ctx.addIssue({
				code: 'custom',
				message: 'imageUrl is required for image messages',
				path: ['imageUrl'],
			});
		}

		if (data.type === 'text' && data.imageUrl) {
			ctx.addIssue({
				code: 'custom',
				message: 'imageUrl must be empty for text messages',
				path: ['imageUrl'],
			});
		}
	});

export const editMessageBodySchema = z.object({
	content: z.string().min(MESSAGE_CONTENT_MIN).max(MESSAGE_CONTENT_MAX),
});

export const messageResponseSchema = messageSelectSchema.omit({ contentEnc: true, contentIv: true }).extend({
	content: z.string().min(MESSAGE_CONTENT_MIN).max(MESSAGE_CONTENT_MAX).nullable(),
	senderDisplayName: z.string().nullable().optional(),
	deliveredCount: z.number().int().default(0),
	seenCount: z.number().int().default(0),
});

export const messageListQuerySchema = z.object({
	cursor: z.coerce.number().int().min(1).optional(),
	limit: z.coerce.number().int().min(1).max(MESSAGE_PAGE_SIZE_MAX).default(MESSAGE_PAGE_SIZE_DEFAULT),
});

export const addMemberBodySchema = participantInsertSchema.pick({
	userId: true,
	role: true,
	nickname: true,
});

export const updateMemberBodySchema = participantUpdateSchema.pick({ nickname: true }).superRefine((data, ctx) => {
	if (!data.nickname) {
		ctx.addIssue({
			code: 'custom',
			message: 'nickname is required',
			path: ['nickname'],
		});
	}
});

export const participantResponseSchema = participantSelectSchema;

export const addReactionBodySchema = messageReactionInsertSchema.pick({
	emoji: true,
});

export const reactionResponseSchema = messageReactionSelectSchema;

export const updateMessageStatusBodySchema = messageStatusInsertSchema.pick({
	status: true,
});

export const messageStatusResponseSchema = messageStatusSelectSchema;

export type ConversationResponse = z.infer<typeof conversationResponseSchema>;
export type CreateConversationBody = z.infer<typeof createConversationBodySchema>;
export type UpdateConversationBody = z.infer<typeof updateConversationBodySchema>;

export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type CreateMessageBody = z.infer<typeof createMessageBodySchema>;
export type EditMessageBody = z.infer<typeof editMessageBodySchema>;
export type MessageListQuery = z.infer<typeof messageListQuerySchema>;

export type AddMemberBody = z.infer<typeof addMemberBodySchema>;
export type UpdateMemberBody = z.infer<typeof updateMemberBodySchema>;
export type ParticipantResponse = z.infer<typeof participantResponseSchema>;

export type AddReactionBody = z.infer<typeof addReactionBodySchema>;
export type ReactionResponse = z.infer<typeof reactionResponseSchema>;

export type UpdateMessageStatusBody = z.infer<typeof updateMessageStatusBodySchema>;
export type MessageStatusResponse = z.infer<typeof messageStatusResponseSchema>;

// Testing types
export type ConversationListItemResponse = z.infer<typeof conversationListItemSchema>;

export type ConversationDetailResponse = z.infer<typeof conversationDetailResponseSchema>;

export type CreateGroupBody = z.infer<typeof createGroupBodySchema>;
