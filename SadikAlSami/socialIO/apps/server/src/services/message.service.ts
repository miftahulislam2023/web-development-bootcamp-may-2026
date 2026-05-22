import type { MessageSelect } from '@socialIO/db/validators/chat.validators';
import { decrypt, encrypt } from '@socialIO/db/lib';
import { nanoid } from 'nanoid';
import {
	messageResponseSchema,
	MESSAGE_PAGE_SIZE_DEFAULT,
	type MessageResponse,
	type CreateMessageBody,
	type EditMessageBody,
} from '@/validators';
import { db } from '@socialIO/db';
import { conversation, message, messageEditHistory, participant, userProfile } from '@socialIO/db/schema';
import { and, count, desc, eq, inArray, isNull, lt, max, ne } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import {
	cacheAddMessage,
	cacheBulkAddMessages,
	cacheGetMessages,
	cacheUpdateMessage,
} from '@socialIO/db/redis/service';
import { messageStatus } from '@socialIO/db/schema';
import { publish, publishGlobal } from '@/ws/pubsub';

/**
 * Formats a message row for API responses
 * @param row - The message row from the database
 * @returns The formatted message response
 */
function formatMessage(row: MessageSelect & { senderDisplayName?: string | null }): MessageResponse {
	return messageResponseSchema.parse({
		...row,
		content: row.isDeleted ? null : decrypt({ content_enc: row.contentEnc, content_iv: row.contentIv }),
	});
}

/**
 * Sends a new message in a conversation
 * @param conversationId - The ID of the conversation
 * @param senderId - The ID of the sender
 * @param body - The message content and metadata
 * @returns The formatted message response
 */
export async function sendMessage(
	conversationId: string,
	senderId: string,
	body: CreateMessageBody,
): Promise<MessageResponse> {
	const { content, type = 'text', imageUrl, replyToId } = body;

	// 1. Encrypt the message content before storing it in the database
	const { content_enc, content_iv } = encrypt(content);

	// 2. validate replyToId belongs to this conversation
	if (replyToId) {
		const [replyTarget] = await db
			.select({ id: message.id })
			.from(message)
			.where(and(eq(message.id, replyToId), eq(message.conversationId, conversationId)))
			.limit(1);

		if (!replyTarget) {
			throw new HTTPException(400, { message: 'Invalid replyToId: message does not exist in this conversation' });
		}
	}

	// 3. Transaction: allocate sequence number ,insert the new message, update last_message_id
	const saved = await db.transaction(async (tx) => {
		// Lock the conversation row to prevent concurrent inserts from causing sequence number conflicts

		// 3.1 Fetch the conversation with a "FOR UPDATE" lock to prevent concurrent modifications
		const [conv] = await tx
			.select({ id: conversation.id })
			.from(conversation)
			.where(eq(conversation.id, conversationId))
			.for('update');

		if (!conv) {
			throw new HTTPException(404, { message: 'Conversation not found' });
		}

		// 3.2 Allocate the next sequence number for the new message
		const maxSeqResult = await tx
			.select({ maxSeq: max(message.sequenceNumber) })
			.from(message)
			.where(eq(message.conversationId, conversationId));

		const nextSeq = (maxSeqResult[0]?.maxSeq ?? 0) + 1;

		// 3.3 Insert the new message(Cyphered Text) with the allocated sequence number
		const insertResult = await tx
			.insert(message)
			.values({
				id: nanoid(),
				conversationId,
				senderId,
				sequenceNumber: nextSeq,
				contentEnc: content_enc,
				contentIv: content_iv,
				type,
				imageUrl: imageUrl ?? null,
				replyToId: replyToId ?? null,
			})
			.returning();

		const row = insertResult[0];
		if (!row) {
			throw new HTTPException(500, { message: 'Failed to send message' });
		}

		// 3.4 Update the conversation's last_message_id and updated_at timestamp
		await tx
			.update(conversation)
			.set({ lastMessageId: row.id, updatedAt: new Date() })
			.where(eq(conversation.id, conversationId));
		return row;
	});
	// Transaction Commited

	// 4. Fetch sender's display name for the response
	const [senderProfile] = await db
		.select({ displayName: userProfile.displayName })
		.from(userProfile)
		.where(eq(userProfile.id, senderId))
		.limit(1);

	// 5. Decrypt once to build the public shape
	const formatted = formatMessage({ ...saved, senderDisplayName: senderProfile?.displayName ?? null });

	// 5. Populate Redis cache with plaintext JSON
	try {
		await cacheAddMessage(conversationId, formatted.sequenceNumber, JSON.stringify(formatted));
	} catch {
		console.warn('Failed to update cache for new message', { conversationId: conversationId, messageId: formatted.id });
	}

	// 6. Publish new_message FIRST so the frontend cache has the message before delivered events arrive
	try {
		await publish(conversationId, {
			type: 'new_message',
			conversationId,
			message: formatted,
		});
		await publishGlobal({
			type: 'conversation_updated',
			conversationId,
			lastMessageId: formatted.id,
			updatedAt: new Date().toISOString(),
		});
	} catch {
		console.warn('Failed to publish new message to Redis', { conversationId: conversationId, messageId: formatted.id });
	}

	// 7. Create delivered statuses AFTER new_message is published (fire and forget)
	//    This ensures the frontend cache has the message before delivered WS events increment the count
	setImmediate(() => {
		createDeliveredStatuses(conversationId, formatted.id, senderId).catch((err) => {
			console.error('[message] Failed to create delivered statuses:', err);
		});
	});

	return formatted;
}

/**
 * @desc Get messages for a conversation with pagination
 * @param conversationId
 * @param cursor - The sequence number to paginate from (exclusive)
 * @param limit - Number of messages to return
 * @returns A list of formatted message responses
 */
export async function getMessages(
	conversationId: string,
	cursor?: number,
	limit = MESSAGE_PAGE_SIZE_DEFAULT,
): Promise<MessageResponse[]> {
	if (!cursor) {
		try {
			const cached = await cacheGetMessages(conversationId, limit);
			if (cached) {
				return cached.map((msg) => JSON.parse(msg) as MessageResponse);
			}
		} catch {
			// Cache miss or Redis error, fallback to DB query
			// (We can log the error here if needed, but we don't want to fail the request just because of cache issues)
		}
	}
	const rows = await db
		.select({
			id: message.id,
			conversationId: message.conversationId,
			senderId: message.senderId,
			sequenceNumber: message.sequenceNumber,
			contentEnc: message.contentEnc,
			contentIv: message.contentIv,
			type: message.type,
			imageUrl: message.imageUrl,
			replyToId: message.replyToId,
			isEdited: message.isEdited,
			editedAt: message.editedAt,
			isDeleted: message.isDeleted,
			deletedAt: message.deletedAt,
			createdAt: message.createdAt,
			senderDisplayName: userProfile.displayName,
		})
		.from(message)
		.leftJoin(userProfile, eq(message.senderId, userProfile.id))
		.where(and(eq(message.conversationId, conversationId), cursor ? lt(message.sequenceNumber, cursor) : undefined))
		.orderBy(desc(message.sequenceNumber))
		.limit(limit);

	const formatted = rows.map(formatMessage);

	// Batch-fetch delivered/seen counts for all messages in a single query (no N+1)
	if (formatted.length > 0) {
		const messageIds = formatted.map((m) => m.id);
		const statusRows = await db
			.select({ messageId: messageStatus.messageId, status: messageStatus.status, cnt: count() })
			.from(messageStatus)
			.where(inArray(messageStatus.messageId, messageIds))
			.groupBy(messageStatus.messageId, messageStatus.status);

		// Group by messageId → { deliveredCount, seenCount }
		const statusMap = new Map<string, { deliveredCount: number; seenCount: number }>();
		for (const row of statusRows) {
			if (!statusMap.has(row.messageId)) {
				statusMap.set(row.messageId, { deliveredCount: 0, seenCount: 0 });
			}
			const entry = statusMap.get(row.messageId)!;
			if (row.status === 'delivered') entry.deliveredCount = row.cnt;
			if (row.status === 'seen') entry.seenCount = row.cnt;
		}

		// Attach counts to each formatted message
		for (const msg of formatted) {
			const counts = statusMap.get(msg.id);
			if (counts) {
				msg.deliveredCount = counts.deliveredCount;
				msg.seenCount = counts.seenCount;
			}
		}
	}

	// Populating Redis cache for first page load (when cursor is not provided) to optimize subsequent requests
	if (!cursor && formatted.length > 0) {
		await cacheBulkAddMessages(
			conversationId,
			formatted.map((msg) => ({
				sequenceNumber: msg.sequenceNumber,
				messageJson: JSON.stringify(msg),
			})),
			limit,
		);
	}
	return formatted;
}

/**
 * @desc Edit a message's content (only for text messages and if the requester is the sender)
 * @param messageId
 * @param senderId
 * @param messageBody
 * @returns The updated message response
 */
export async function editMessage(
	messageId: string,
	senderId: string,
	messageBody: EditMessageBody,
): Promise<MessageResponse> {
	const [existing] = await db.select().from(message).where(eq(message.id, messageId)).limit(1);

	if (!existing) {
		throw new HTTPException(404, { message: 'Message not found' });
	}
	if (existing.senderId !== senderId) {
		throw new HTTPException(403, { message: 'You can only edit your own messages' });
	}
	if (existing.isDeleted) {
		throw new HTTPException(400, { message: 'Cannot edit a deleted message' });
	}
	if (existing.type !== 'text') {
		throw new HTTPException(400, { message: 'Only text messages can be edited' });
	}

	const { content_enc: newEnc, content_iv: newIv } = encrypt(messageBody.content);
	const updated = await db.transaction(async (tx) => {
		// 3. Insert a new record into messageEditHistory to keep track of the previous content and edit timestamp
		await tx.insert(messageEditHistory).values({
			id: nanoid(),
			messageId: existing.id,
			prevContentIv: existing.contentIv,
			prevContentEnc: existing.contentEnc,
			editedAt: new Date(),
		});
		// 4. Update the message with the new content and edit timestamp
		const [row] = await tx
			.update(message)
			.set({ contentEnc: newEnc, contentIv: newIv, isEdited: true, editedAt: new Date() })
			.where(eq(message.id, messageId))
			.returning();
		return row;
	});

	if (!updated) {
		throw new HTTPException(500, { message: 'Failed to edit message' });
	}

	// 5. Decrypt the updated message
	const formatted = formatMessage(updated);

	// 6. Update Redis cache with the new content
	try {
		await cacheUpdateMessage(existing.conversationId, formatted.sequenceNumber, JSON.stringify(formatted));
	} catch {
		console.warn('Failed to update cache for edited message', {
			conversationId: existing.conversationId,
			messageId: formatted.id,
		});
	}

	try {
		await publish(existing.conversationId, {
			type: 'new_message',
			conversationId: existing.conversationId,
			message: formatted,
		});
		await publishGlobal({
			type: 'conversation_updated',
			conversationId: existing.conversationId,
			lastMessageId: formatted.id,
			updatedAt: new Date().toISOString(),
		});
	} catch {
		console.warn('Failed to publish edited message to Redis', {
			conversationId: existing.conversationId,
			messageId: formatted.id,
		});
	}

	return formatted;
}

/**
 * @desc Soft-delete a message (only for messages sent by the requester)
 * @param messageId
 * @param requestingUserId
 * @returns The deleted message response
 */
export async function softDeleteMessage(messageId: string, requestingUserId: string): Promise<MessageResponse> {
	const [existing] = await db.select().from(message).where(eq(message.id, messageId)).limit(1);

	if (!existing) {
		throw new HTTPException(404, { message: 'Message not found' });
	}
	if (existing.senderId !== requestingUserId) {
		throw new HTTPException(403, { message: 'You can only delete your own messages' });
	}
	if (existing.isDeleted) {
		throw new HTTPException(400, { message: 'Message is already deleted' });
	}

	const [deleted] = await db
		.update(message)
		.set({ isDeleted: true, deletedAt: new Date() })
		.where(eq(message.id, messageId))
		.returning();

	if (!deleted) {
		throw new HTTPException(500, { message: 'Failed to delete message' });
	}

	const formatted = formatMessage(deleted);

	// Update cache — the deleted shape has content: null
	try {
		await cacheUpdateMessage(existing.conversationId, formatted.sequenceNumber, JSON.stringify(formatted));
	} catch {
		console.warn('Failed to update cache for deleted message', {
			conversationId: existing.conversationId,
			messageId: formatted.id,
		});
	}

	// Publish to WebSocket subscribers about the deleted message and conversation update
	try {
		await publish(existing.conversationId, {
			type: 'new_message',
			conversationId: existing.conversationId,
			message: formatted,
		});
		await publishGlobal({
			type: 'conversation_updated',
			conversationId: existing.conversationId,
			lastMessageId: formatted.id,
			updatedAt: new Date().toISOString(),
		});
	} catch {
		console.warn('Failed to publish deleted message to Redis', {
			conversationId: existing.conversationId,
			messageId: formatted.id,
		});
	}

	return formatted;
}

/**
 * @desc After a message is sent, create 'delivered' status rows for all participants
 * except the sender. This runs outside the main transaction to avoid lock contention.
 * @param conversationId
 * @param messageId
 * @param senderId
 */
export async function createDeliveredStatuses(
	conversationId: string,
	messageId: string,
	senderId: string,
): Promise<void> {
	// Get all active participants except the sender
	const participants = await db
		.select({ userId: participant.userId })
		.from(participant)
		.where(
			and(eq(participant.conversationId, conversationId), isNull(participant.leftAt), ne(participant.userId, senderId)),
		);

	if (participants.length === 0) return;

	// Bulk insert delivered statuses
	await db.insert(messageStatus).values(
		participants.map((p) => ({
			messageId,
			userId: p.userId,
			status: 'delivered' as const,
			updatedAt: new Date(),
		})),
	);

	// Broadcast delivered status to the conversation so the sender's UI updates in real time
	try {
		for (const p of participants) {
			await publish(conversationId, {
				type: 'message_status_update',
				conversationId,
				messageId,
				userId: p.userId,
				status: 'delivered',
			});
		}
	} catch {
		console.warn('[createDeliveredStatuses] Failed to publish delivered status to Redis', {
			conversationId,
			messageId,
		});
	}
}

/**
 * @desc Get unread message counts per conversation for a user
 * @param userId
 * @returns Record<<conversationId, unreadCount>
 */
export async function getUnreadCounts(userId: string): Promise<Record<string, number>> {
	const rows = await db
		.select({
			conversationId: message.conversationId,
			count: count(),
		})
		.from(message)
		.innerJoin(messageStatus, eq(message.id, messageStatus.messageId))
		.where(and(eq(messageStatus.userId, userId), eq(messageStatus.status, 'delivered'), eq(message.isDeleted, false)))
		.groupBy(message.conversationId);

	const result: Record<string, number> = {};
	for (const row of rows) {
		result[row.conversationId] = row.count;
	}
	return result;
}

/**
 * @desc Get "seen by" count for a specific message (for group read receipts)
 * @param messageId
 * @returns { deliveredCount, seenCount, totalParticipants }
 */
export async function getMessageStatusCounts(messageId: string): Promise<{
	deliveredCount: number;
	seenCount: number;
	totalParticipants: number;
}> {
	const [messageRow] = await db
		.select({ conversationId: message.conversationId, senderId: message.senderId })
		.from(message)
		.where(eq(message.id, messageId))
		.limit(1);

	if (!messageRow) {
		throw new HTTPException(404, { message: 'Message not found' });
	}

	const totalParticipants = await db
		.select({ count: count() })
		.from(participant)
		.where(
			and(
				eq(participant.conversationId, messageRow.conversationId),
				isNull(participant.leftAt),
				ne(participant.userId, messageRow.senderId), // Exclude sender
			),
		);

	const statusCounts = await db
		.select({
			status: messageStatus.status,
			count: count(),
		})
		.from(messageStatus)
		.where(eq(messageStatus.messageId, messageId))
		.groupBy(messageStatus.status);

	const delivered = statusCounts.find((s) => s.status === 'delivered')?.count ?? 0;
	const seen = statusCounts.find((s) => s.status === 'seen')?.count ?? 0;

	return {
		deliveredCount: delivered,
		seenCount: seen,
		totalParticipants: totalParticipants[0]?.count ?? 0,
	};
}

/**
 * @desc Bulk-upsert 'seen' status for all messages in a conversation the user didn't send.
 * Used as REST fallback when the WS message_seen event cannot fire (e.g. WS reconnecting).
 * Fire-and-forget — callers should not await this.
 */
export async function markConversationSeen(conversationId: string, userId: string): Promise<void> {
	// Get IDs of all non-deleted messages in the conversation not sent by this user
	const rows = await db
		.select({ id: message.id })
		.from(message)
		.where(and(eq(message.conversationId, conversationId), ne(message.senderId, userId), eq(message.isDeleted, false)));

	if (rows.length === 0) return;

	const now = new Date();
	await db
		.insert(messageStatus)
		.values(rows.map((r) => ({ messageId: r.id, userId, status: 'seen' as const, updatedAt: now })))
		.onConflictDoUpdate({
			target: [messageStatus.messageId, messageStatus.userId],
			set: { status: 'seen', updatedAt: now },
		});
}
