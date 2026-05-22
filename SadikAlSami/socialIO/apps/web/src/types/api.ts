import { z } from 'zod';

//  Enums

const conversationType = z.enum(['dm', 'group']);
const messageType = z.enum(['text', 'image', 'system']);
const participantRole = z.enum(['admin', 'member']);
const messageDeliveryStatus = z.enum(['sent', 'delivered', 'seen']);

//  Profile

export const profileResponseSchema = z.object({
	id: z.string(),
	displayName: z.string(),
	avatarUrl: z.string().nullable(),
	bio: z.string().nullable(),
	lastSeenAt: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const searchResultSchema = z.object({
	id: z.string(),
	displayName: z.string(),
	avatarUrl: z.string().nullable(),
});

//  Message

export const messageResponseSchema = z.object({
	id: z.string(),
	conversationId: z.string(),
	senderId: z.string(),
	sequenceNumber: z.number(),
	content: z.string().nullable(),
	type: messageType,
	imageUrl: z.string().nullable(),
	replyToId: z.string().nullable(),
	isEdited: z.boolean(),
	editedAt: z.string().nullable(),
	isDeleted: z.boolean(),
	deletedAt: z.string().nullable(),
	createdAt: z.string(),
	senderDisplayName: z.string().nullable().optional(),
	deliveredCount: z.number().default(0),
	seenCount: z.number().default(0),
});

//  Conversation

export const conversationResponseSchema = z.object({
	id: z.string(),
	type: conversationType,
	name: z.string().nullable(),
	avatarUrl: z.string().nullable(),
	lastMessageId: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const conversationListItemSchema = conversationResponseSchema.extend({
	participants: z.array(
		z.object({
			userId: z.string(),
			displayName: z.string().nullable(),
			avatarUrl: z.string().nullable(),
		}),
	),
	lastMessage: z
		.object({
			id: z.string(),
			content: z.string().nullable(),
			type: messageType,
			isDeleted: z.boolean(),
			createdAt: z.string(),
			senderId: z.string(),
			senderName: z.string().nullable(),
		})
		.nullable(),
	unreadCount: z.number().int().min(0).default(0),
});

export const conversationParticipantSchema = z.object({
	id: z.string(),
	userId: z.string(),
	role: participantRole,
	nickname: z.string().nullable(),
	joinedAt: z.string(),
	displayName: z.string().nullable(),
	avatarUrl: z.string().nullable(),
});

export const conversationDetailResponseSchema = conversationResponseSchema.extend({
	participants: z.array(conversationParticipantSchema),
});

//  Inferred Types

export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type ConversationResponse = z.infer<typeof conversationResponseSchema>;
export type ConversationListItem = z.infer<typeof conversationListItemSchema>;
export type ConversationParticipant = z.infer<typeof conversationParticipantSchema>;
export type ConversationDetail = z.infer<typeof conversationDetailResponseSchema>;
export type ConversationType = z.infer<typeof conversationType>;
export type MessageType = z.infer<typeof messageType>;
export type ParticipantRole = z.infer<typeof participantRole>;
export type MessageDeliveryStatus = z.infer<typeof messageDeliveryStatus>;

//  Hook response/body types

export interface MessagePage {
	messages: MessageResponse[];
	hasMore: boolean;
}

export interface MessageStatusCounts {
	deliveredCount: number;
	seenCount: number;
	totalParticipants: number;
}

export type CreateDmBody = { type: 'dm'; participantId: string };
export type CreateGroupBody = {
	type: 'group';
	name: string;
	participantIds: string[];
	avatarUrl?: string;
};
export type CreateConversationBody = CreateDmBody | CreateGroupBody;

export type CreateProfileBody = {
	displayName: string;
	avatarUrl?: string;
	bio?: string;
};

export type EditMessageBody = { content: string };
