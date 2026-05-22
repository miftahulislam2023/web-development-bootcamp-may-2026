import { Hono } from 'hono';
import type { WSContext } from 'hono/ws';
import type { AppEnv } from '@/types/app-env';
import { auth } from '@socialIO/auth';
import { db } from '@socialIO/db';
import { messageStatus, message, participant } from '@socialIO/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

import { upgradeWebSocket } from '@hono/node-server';
import { joinRoom, leaveRoom, leaveAllRooms } from './registry';
import { subscribeToConversation, publish } from './pubsub';
import { setOnline, setOffline, refreshPresenceTTL } from '@/services/presence.service';
import { startTyping, stopTyping, getWhoIsTyping } from '@/services/typing.service';
import { createTypedWS, parseInboundEvent, type InboundEvent, type TypedWS } from './types';

export const wsRouter = new Hono<AppEnv>();

wsRouter.get(
	'/',
	upgradeWebSocket(async (c) => {
		const session = await auth.api.getSession({ headers: c.req.raw.headers });

		if (!session?.user) {
			return {
				onOpen(_event, _ws) {
					const tws = createTypedWS(_ws);
					tws.send({ type: 'error', error: 'Unauthorized' });
					tws.close();
				},
			};
		}

		const userId = session.user.id;

		return {
			async onOpen(_event, _ws: WSContext) {
				await setOnline(userId);
				const convIds = await getUserConversationIds(userId);
				for (const convId of convIds) {
					await publish(convId, { type: 'presence_update', userId, online: true });
				}
			},

			async onMessage(event: MessageEvent, ws: WSContext) {
				const tws = createTypedWS(ws);
				const raw = typeof event.data === 'string' ? event.data : String(event.data);
				const inbound = parseInboundEvent(raw);

				if (!inbound) {
					tws.send({ type: 'error', error: 'Invalid message format' });
					return;
				}

				await handleEvent(inbound, userId, ws, tws);
			},

			async onClose(_event, ws: WSContext) {
				const roomsLeft = leaveAllRooms(userId, ws);
				await setOffline(userId);
				const lastSeenAt = new Date().toISOString();
				for (const convId of roomsLeft) {
					await publish(convId, {
						type: 'presence_update',
						userId,
						online: false,
						lastSeenAt,
					});
				}
			},

			onError(error: Event) {
				console.error('[ws] error:', error);
			},
		};
	}),
);

async function handleEvent(event: InboundEvent, userId: string, ws: WSContext, tws: TypedWS): Promise<void> {
	switch (event.type) {
		case 'echo': {
			tws.send({ type: 'echo', payload: event.payload });
			return;
		}

		case 'join_conversation': {
			const { conversationId } = event.payload;
			const isMember = await checkMembership(conversationId, userId);
			if (!isMember) {
				tws.send({ type: 'error', error: 'Not a participant in this conversation' });
				return;
			}
			joinRoom(conversationId, userId, ws);
			await subscribeToConversation(conversationId);
			tws.send({ type: 'joined', conversationId });
			break;
		}

		case 'leave_conversation': {
			leaveRoom(event.payload.conversationId, userId, ws);
			break;
		}

		case 'typing_start': {
			const { conversationId } = event.payload;
			await startTyping(conversationId, userId);
			const typingUserIds = await getWhoIsTyping(conversationId);
			await publish(conversationId, { type: 'typing_update', conversationId, typingUserIds });
			break;
		}

		case 'typing_stop': {
			const { conversationId } = event.payload;
			await stopTyping(conversationId, userId);
			const typingUserIds = await getWhoIsTyping(conversationId);
			await publish(conversationId, { type: 'typing_update', conversationId, typingUserIds });
			break;
		}

		case 'message_seen': {
			const { conversationId, messageId } = event.payload;

			// Never count the sender's own view as "seen"
			const [msgRow] = await db
				.select({ senderId: message.senderId })
				.from(message)
				.where(eq(message.id, messageId))
				.limit(1);
			if (!msgRow || msgRow.senderId === userId) break;

			await db
				.insert(messageStatus)
				.values({ messageId, userId, status: 'seen', updatedAt: new Date() })
				.onConflictDoUpdate({
					target: [messageStatus.messageId, messageStatus.userId],
					set: { status: 'seen', updatedAt: new Date() },
				});
			await publish(conversationId, {
				type: 'message_status_update',
				conversationId,
				messageId,
				userId,
				status: 'seen',
			});
			break;
		}

		case 'heartbeat': {
			await refreshPresenceTTL(userId);
			tws.send({ type: 'heartbeat_ack' });
			break;
		}

		default: {
			const _exhaustive: never = event;
			tws.send({ type: 'error', error: 'Unknown event type' });
			return _exhaustive;
		}
	}
}

async function checkMembership(conversationId: string, userId: string): Promise<boolean> {
	const [row] = await db
		.select({ id: participant.id })
		.from(participant)
		.where(
			and(eq(participant.conversationId, conversationId), eq(participant.userId, userId), isNull(participant.leftAt)),
		)
		.limit(1);
	return !!row;
}

async function getUserConversationIds(userId: string): Promise<string[]> {
	const rows = await db
		.select({ conversationId: participant.conversationId })
		.from(participant)
		.where(and(eq(participant.userId, userId), isNull(participant.leftAt)));
	return rows.map((r) => r.conversationId);
}
