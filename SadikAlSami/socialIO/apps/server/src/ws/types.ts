import { z } from 'zod';
import type { WSContext } from 'hono/ws';
import type { MessageResponse } from '@/validators';

// ─── Inbound Zod Schemas ─────────────────────────────────────────────────────

const echoSchema = z.object({
	type: z.literal('echo'),
	payload: z.object({ text: z.string() }),
});

const joinConversationSchema = z.object({
	type: z.literal('join_conversation'),
	payload: z.object({ conversationId: z.string().min(1) }),
});

const leaveConversationSchema = z.object({
	type: z.literal('leave_conversation'),
	payload: z.object({ conversationId: z.string().min(1) }),
});

const typingStartSchema = z.object({
	type: z.literal('typing_start'),
	payload: z.object({ conversationId: z.string().min(1) }),
});

const typingStopSchema = z.object({
	type: z.literal('typing_stop'),
	payload: z.object({ conversationId: z.string().min(1) }),
});

const messageSeenSchema = z.object({
	type: z.literal('message_seen'),
	payload: z.object({
		conversationId: z.string().min(1),
		messageId: z.string().min(1),
	}),
});

const heartbeatSchema = z.object({
	type: z.literal('heartbeat'),
	payload: z.object({}).strict().optional().default({}),
});

export const inboundEventSchema = z.discriminatedUnion('type', [
	echoSchema,
	joinConversationSchema,
	leaveConversationSchema,
	typingStartSchema,
	typingStopSchema,
	messageSeenSchema,
	heartbeatSchema,
]);

export type InboundEvent = z.infer<typeof inboundEventSchema>;

// ─── Outbound Types ──────────────────────────────────────────────────────────

export type EchoEvent = {
	type: 'echo';
	payload: { text: string };
};

export type NewMessageEvent = {
	type: 'new_message';
	conversationId: string;
	message: MessageResponse;
};

export type JoinedEvent = {
	type: 'joined';
	conversationId: string;
};

export type TypingUpdateEvent = {
	type: 'typing_update';
	conversationId: string;
	typingUserIds: string[];
};

export type PresenceUpdateEvent = {
	type: 'presence_update';
	userId: string;
	online: boolean;
	lastSeenAt?: string;
};

export type MessageStatusUpdateEvent = {
	type: 'message_status_update';
	conversationId: string;
	messageId: string;
	userId: string;
	status: 'delivered' | 'seen';
};

export type ConversationUpdatedEvent = {
	type: 'conversation_updated';
	conversationId: string;
	lastMessageId: string;
	updatedAt: string;
};

export type HeartbeatAckEvent = {
	type: 'heartbeat_ack';
};

export type ErrorEvent = {
	type: 'error';
	error: string;
};

export type OutboundEvent =
	| EchoEvent
	| NewMessageEvent
	| JoinedEvent
	| TypingUpdateEvent
	| PresenceUpdateEvent
	| MessageStatusUpdateEvent
	| ConversationUpdatedEvent
	| HeartbeatAckEvent
	| ErrorEvent;

// ─── Helpers ─────────────────────────────────────────────────────────────────

export type TypedWS = {
	send: (event: OutboundEvent) => void;
	close: () => void;
};

export function createTypedWS(ws: WSContext): TypedWS {
	return {
		send: (event) => ws.send(JSON.stringify(event)),
		close: () => ws.close(),
	};
}

export function parseInboundEvent(data: string): InboundEvent | null {
	try {
		const parsed = JSON.parse(data) as unknown;
		const result = inboundEventSchema.safeParse(parsed);
		return result.success ? result.data : null;
	} catch {
		return null;
	}
}
