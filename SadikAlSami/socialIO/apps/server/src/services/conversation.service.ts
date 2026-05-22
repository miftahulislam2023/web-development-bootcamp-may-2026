import { db, type TX } from '@socialIO/db';
import { conversation, message, participant, userProfile } from '@socialIO/db/schema';
import {
	conversationDetailResponseSchema,
	conversationListItemSchema,
	type ConversationDetailResponse,
	type ConversationListItemResponse,
	type ConversationResponse,
	type CreateGroupBody,
	type ParticipantResponse,
} from '@/validators';
import { and, count, desc, eq, inArray, isNull } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { nanoid } from 'nanoid';
import { decrypt } from '@socialIO/db/lib/crypto.lib';
import { getUnreadCounts } from './message.service';

/**
 * @desc Get conversation details by ID
 * @param conversationId
 * @returns
 */
export async function getConversationById(
	conversationId: string,
	txClient: TX = db,
): Promise<ConversationDetailResponse> {
	const [conv] = await txClient
		.select({
			id: conversation.id,
			type: conversation.type,
			name: conversation.name,
			avatarUrl: conversation.avatarUrl,
			lastMessageId: conversation.lastMessageId,
			createdAt: conversation.createdAt,
			updatedAt: conversation.updatedAt,
		})
		.from(conversation)
		.where(eq(conversation.id, conversationId))
		.limit(1);

	if (!conv) {
		throw new HTTPException(404, {
			message: 'Conversation not found',
		});
	}

	const participants = await txClient
		.select({
			id: participant.id,
			userId: participant.userId,
			role: participant.role,
			nickname: participant.nickname,
			joinedAt: participant.joinedAt,

			displayName: userProfile.displayName,
			avatarUrl: userProfile.avatarUrl,
		})
		.from(participant)
		.leftJoin(userProfile, eq(participant.userId, userProfile.id))
		.where(and(eq(participant.conversationId, conversationId), isNull(participant.leftAt)));

	return conversationDetailResponseSchema.parse({
		...conv,
		participants,
	});
}

/**
 * @desc Get a participant in a conversation
 * @param conversationId
 * @param userId
 * @returns
 */
export async function getParticipant(conversationId: string, userId: string): Promise<ParticipantResponse | null> {
	const [row] = await db
		.select()
		.from(participant)
		.where(
			and(eq(participant.conversationId, conversationId), eq(participant.userId, userId), isNull(participant.leftAt)),
		)
		.limit(1);

	return row ?? null;
}

/**
 * @desc Find or create a direct message conversation between two users
 * @param userAId
 * @param userBId
 * @returns
 */
export async function findOrCreateDM(userAId: string, userBId: string): Promise<ConversationResponse> {
	const sortedIds = [userAId, userBId].sort();

	const id1 = sortedIds[0]!;
	const id2 = sortedIds[1]!;

	const [existing] = await db
		.select({ id: conversation.id })
		.from(conversation)
		.innerJoin(participant, eq(conversation.id, participant.conversationId))
		.where(and(eq(conversation.type, 'dm'), inArray(participant.userId, [id1, id2]), isNull(participant.leftAt)))
		.groupBy(conversation.id)
		.having(eq(count(participant.userId), 2))
		.limit(1);

	if (existing) {
		return getConversationById(existing.id);
	}

	return db.transaction(async (tx) => {
		const conversationId = nanoid();

		await tx.insert(conversation).values({
			id: conversationId,
			type: 'dm',
		});

		await tx.insert(participant).values([
			{
				id: nanoid(),
				conversationId: conversationId,
				userId: id1,
				role: 'member',
			},
			{
				id: nanoid(),
				conversationId: conversationId,
				userId: id2,
				role: 'member',
			},
		]);

		return getConversationById(conversationId, tx);
	});
}

/**
 * @desc Create a new group conversation
 * @param body
 * @param creatorId
 * @returns
 */
export async function createGroup(body: CreateGroupBody, creatorId: string): Promise<ConversationDetailResponse> {
	const uniqueParticipantIds = [...new Set([creatorId, ...body.participantIds])];
	if (uniqueParticipantIds.length < 2) {
		throw new HTTPException(400, {
			message: 'At least 2 unique participants are required to create a group conversation',
		});
	}

	return db.transaction(async (tx) => {
		const conversationId = nanoid();

		await tx.insert(conversation).values({
			id: conversationId,
			type: 'group',
			name: body.name,
			avatarUrl: body.avatarUrl ?? null,
		});

		await tx.insert(participant).values(
			uniqueParticipantIds.map((userId) => {
				const role: 'admin' | 'member' = userId === creatorId ? 'admin' : 'member';

				return {
					id: nanoid(),
					conversationId,
					userId,
					role,
				};
			}),
		);

		return getConversationById(conversationId, tx);
	});
}

/**
 * @desc Get all conversations for a user with unread counts
 * @param userId
 * @returns
 */
export async function getUserConversations(userId: string): Promise<ConversationListItemResponse[]> {
	const [rows, unreadMap] = await Promise.all([
		db
			.select({
				id: conversation.id,
				type: conversation.type,
				name: conversation.name,
				avatarUrl: conversation.avatarUrl,
				createdAt: conversation.createdAt,
				updatedAt: conversation.updatedAt,
				lastMessageId: conversation.lastMessageId,

				msgId: message.id,
				msgContentEnc: message.contentEnc,
				msgContentIv: message.contentIv,
				msgType: message.type,
				msgIsDeleted: message.isDeleted,
				msgCreatedAt: message.createdAt,
				msgSenderId: message.senderId,
				msgSenderName: userProfile.displayName,
			})
			.from(participant)
			.innerJoin(conversation, eq(participant.conversationId, conversation.id))
			.leftJoin(message, eq(conversation.lastMessageId, message.id))
			.leftJoin(userProfile, eq(message.senderId, userProfile.id))
			.where(and(eq(participant.userId, userId), isNull(participant.leftAt)))
			.orderBy(desc(conversation.updatedAt)),
		getUnreadCounts(userId),
	]);

	if (rows.length === 0) return [];

	// Batch-fetching participants for all conversations in one query
	const convIds = rows.map((r) => r.id);
	const allParticipants = await db
		.select({
			conversationId: participant.conversationId,
			userId: participant.userId,
			displayName: userProfile.displayName,
			avatarUrl: userProfile.avatarUrl,
		})
		.from(participant)
		.leftJoin(userProfile, eq(participant.userId, userProfile.id))
		.where(and(inArray(participant.conversationId, convIds), isNull(participant.leftAt)));

	// Group participants by conversationId
	const participantMap = new Map<string, { userId: string; displayName: string | null; avatarUrl: string | null }[]>();
	for (const p of allParticipants) {
		const list = participantMap.get(p.conversationId) ?? [];
		list.push({ userId: p.userId, displayName: p.displayName, avatarUrl: p.avatarUrl });
		participantMap.set(p.conversationId, list);
	}

	return rows.map((row) => {
		const lastMessage =
			row.msgId != null ?
				{
					id: row.msgId,

					content:
						row.msgIsDeleted ? null : (
							decrypt({
								content_enc: row.msgContentEnc!,
								content_iv: row.msgContentIv!,
							})
						),

					type: row.msgType,
					isDeleted: row.msgIsDeleted,
					createdAt: row.msgCreatedAt,
					senderId: row.msgSenderId,
					senderName: row.msgSenderName,
				}
			:	null;

		return conversationListItemSchema.parse({
			id: row.id,
			type: row.type,
			name: row.name,
			avatarUrl: row.avatarUrl,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
			lastMessageId: row.lastMessageId,
			participants: participantMap.get(row.id) ?? [],
			lastMessage,
			unreadCount: unreadMap[row.id] ?? 0,
		});
	});
}
