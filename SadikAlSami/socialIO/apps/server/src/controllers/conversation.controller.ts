import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { AppEnv } from '@/types/app-env';

import { isAuthenticated, isMember, validate } from '@/middlewares';

import { conversationIdParamSchema, createConversationBodySchema } from '@/validators';

import { createGroup, findOrCreateDM, getConversationById, getUnreadCounts, getUserConversations } from '@/services';

export const conversationController = new Hono<AppEnv>();

/**
 * @route GET /conversations
 * @desc Get all conversations for the authenticated user with unread message counts
 * @access Private
 */
conversationController.get('/', isAuthenticated, async (c) => {
	const user = c.get('user');
	const userId = user?.id;
	if (!userId) {
		throw new HTTPException(401, {
			message: 'Unauthorized',
		});
	}

	const conversations = await getUserConversations(userId);

	return c.json({ success: true, conversations });
});

/**
 * @route GET /conversations/unread
 * @desc Get unread message counts per conversation
 * @access Private
 */
conversationController.get('/unread', isAuthenticated, async (c) => {
	const user = c.get('user');
	const userId = user?.id;
	if (!userId) {
		throw new HTTPException(401, { message: 'Unauthorized' });
	}

	const counts = await getUnreadCounts(userId);
	return c.json({ success: true, counts });
});

/**
 * @route POST /conversations
 * @desc Create a new conversation (DM or Group)
 * @access Private
 */
conversationController.post('/', isAuthenticated, validate('json', createConversationBodySchema), async (c) => {
	const user = c.get('user');
	const userId = user?.id;
	if (!userId) {
		throw new HTTPException(401, {
			message: 'Unauthorized',
		});
	}

	const body = c.req.valid('json');

	if (body.type === 'dm') {
		if (body.participantId === userId) {
			throw new HTTPException(400, {
				message: 'You cannot DM yourself',
			});
		}

		const conversation = await findOrCreateDM(userId, body.participantId);

		return c.json(
			{
				success: true,
				conversation,
			},
			201,
		);
	}

	const conversation = await createGroup(
		{
			name: body.name,
			participantIds: body.participantIds,
			avatarUrl: body.avatarUrl ?? undefined,
		},
		userId,
	);

	return c.json(
		{
			success: true,
			conversation,
		},
		201,
	);
});

/**
 * @route GET /conversations/:id
 * @desc Get conversation details by ID
 * @access Private (must be a participant)
 */
conversationController.get(
	'/:id',
	isAuthenticated,
	isMember,
	validate('param', conversationIdParamSchema),
	async (c) => {
		const conversationId = c.req.param('id');
		const conversation = await getConversationById(conversationId);

		if (!conversation) {
			throw new HTTPException(404, {
				message: 'Conversation not found',
			});
		}

		return c.json({ success: true, conversation });
	},
);
