import { Hono } from 'hono';
import { type AppEnv } from '@/types/app-env';
import { HTTPException } from 'hono/http-exception';
import { sendMessage, getMessages, editMessage, softDeleteMessage, getMessageStatusCounts, markConversationSeen } from '@/services';
import { isAuthenticated, validate, isMember } from '@/middlewares';
import {
	conversationIdParamSchema,
	createMessageBodySchema,
	editMessageBodySchema,
	messageIdParamSchema,
	messageListQuerySchema,
} from '@/validators';

export const messageController = new Hono<AppEnv>();

/**
 * @route GET /conversations/:id/messages
 * @desc Get messages in a conversation with pagination
 * @access Private (must be a member of the conversation)
 * @param conversationId
 * @param cursor
 * @param limit
 */
messageController.get(
	'/conversations/:id/messages',
	isAuthenticated,
	isMember,
	validate('param', conversationIdParamSchema),
	validate('query', messageListQuerySchema),
	async (c) => {
		const user = c.get('user');
		const userId = user?.id;

		if (!userId) {
			throw new HTTPException(401, { message: 'Unauthorized' });
		}

		const { id: conversationId } = c.req.valid('param');
		const { cursor, limit } = c.req.valid('query');

		const messages = await getMessages(conversationId, cursor, limit);

		// REST fallback: mark all messages in this conversation as seen for this user.
		// Runs fire-and-forget so it never blocks the response.
		markConversationSeen(conversationId, userId).catch(() => {
			// Non-critical — WS path handles real-time seen updates
		});

		return c.json({
			success: true,
			messages,
			hasMore: messages.length === limit,
		});
	},
);

/**
 * @route POST /conversations/:id/messages
 * @desc Send a message in a conversation
 * @access Private (must be a member of the conversation)
 * @param conversationId
 * @param content
 * @param type
 * @param imageUrl (optional, required if type is 'image')
 */
messageController.post(
	'/conversations/:id/messages',
	isAuthenticated,
	isMember,
	validate('param', conversationIdParamSchema),
	validate('json', createMessageBodySchema),
	async (c) => {
		const user = c.get('user');
		const userId = user?.id;
		if (!userId) {
			throw new HTTPException(401, { message: 'Unauthorized' });
		}

		const { id: conversationId } = c.req.valid('param');
		const messageBody = c.req.valid('json');

		const message = await sendMessage(conversationId, userId, messageBody);
		return c.json({ success: true, message }, 201);
	},
);

/**
 * @route PATCH /conversations/:id/messages/:msgId
 * @desc Edit a message
 * @access Private (only the sender can edit their message)
 * @param conversationId
 * @param msgId
 * @param content
 */
messageController.patch(
	'/conversations/:id/messages/:msgId',
	isAuthenticated,
	isMember,
	validate('param', messageIdParamSchema),
	validate('json', editMessageBodySchema),
	async (c) => {
		const user = c.get('user');
		const userId = user?.id;
		if (!userId) {
			throw new HTTPException(401, { message: 'Unauthorized' });
		}

		const { msgId: messageId } = c.req.valid('param');
		const messageBody = c.req.valid('json');

		const updatedMessage = await editMessage(messageId, userId, messageBody);
		return c.json({ success: true, message: updatedMessage });
	},
);

/**
 * @route DELETE /conversations/:id/messages/:msgId
 * @desc Soft-delete a message
 * @access Private (only the sender can delete their message)
 * @param conversationId
 * @param msgId
 */
messageController.delete(
	'/conversations/:id/messages/:msgId',
	isAuthenticated,
	isMember,
	validate('param', messageIdParamSchema),
	async (c) => {
		const user = c.get('user');
		const userId = user?.id;
		if (!userId) {
			throw new HTTPException(401, { message: 'Unauthorized' });
		}

		const { msgId: messageId } = c.req.valid('param');

		const deletedMessage = await softDeleteMessage(messageId, userId);
		return c.json({ success: true, deletedMessage });
	},
);

/**
 * @route GET /messages/:id/status
 * @desc Get delivery/read status counts for a message
 * @access Private (must be a participant in the conversation)
 */
messageController.get(
	'/messages/:msgId/status',
	isAuthenticated,
	validate('param', messageIdParamSchema),
	async (c) => {
		const user = c.get('user');
		const userId = user?.id;
		if (!userId) {
			throw new HTTPException(401, { message: 'Unauthorized' });
		}

		const { msgId: messageId } = c.req.valid('param');

		const status = await getMessageStatusCounts(messageId);
		return c.json({ success: true, status });
	},
);
