import { auth } from '@socialIO/auth';
import type { MiddlewareHandler } from 'hono';
import type { AppEnv } from '../types/app-env';
import { participant } from '@socialIO/db/schema/chat';
import { db } from '@socialIO/db';
import { and, eq, isNull } from 'drizzle-orm';

const unauthorizedResponse = {
	success: false,
	message: 'Unauthorized',
	error: 'No Valid session found',
} as const;

export const isAuthenticated: MiddlewareHandler<AppEnv> = async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session || !session.user) {
		return c.json(unauthorizedResponse, 401);
	}

	c.set('user', session.user);
	c.set('session', session.session);

	await next();
};

export const isMember: MiddlewareHandler<AppEnv> = async (c, next) => {
	const conversationId = c.req.param('id');
	if (!conversationId) {
		return c.json(
			{
				success: false,
				message: 'Conversation ID is required',
			},
			400,
		);
	}

	const user = c.get('user');
	if (!user) {
		return c.json(unauthorizedResponse, 401);
	}

	const userId = user.id;

	// isNull(participant.leftAt) means they're still an active member
	// If leftAt is set, they were kicked or left — treat as non-member
	const [membership] = await db
		.select({ id: participant.id, role: participant.role })
		.from(participant)
		.where(
			and(
				eq(participant.conversationId, conversationId),
				eq(participant.userId, userId),
				isNull(participant.leftAt), // must still be active
			),
		)
		.limit(1);

	if (!membership) {
		return c.json({ error: 'You are not a participant in this conversation' }, 403);
	}

	// Attach role to context so route handlers can check it
	// without making another DB query
	// Usage: const role = c.get("participantRole") → "admin" | "member"
	c.set('participantRole', membership.role);

	await next();
};
