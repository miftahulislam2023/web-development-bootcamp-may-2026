/**
 * @description
 * Centralized query key factory for TanStack Query.
 * Hierarchical structure enables targeted invalidation.
 */

export const profileKeys = {
	all: ['profile'] as const,
	me: () => [...profileKeys.all, 'me'] as const,
	search: (q: string) => [...profileKeys.all, 'search', q] as const,
};

export const conversationKeys = {
	all: ['conversations'] as const,
	list: () => [...conversationKeys.all, 'list'] as const,
	detail: (id: string) => [...conversationKeys.all, 'detail', id] as const,
	unread: () => [...conversationKeys.all, 'unread'] as const,
};

export const messageKeys = {
	all: ['messages'] as const,
	list: (convId: string) => [...messageKeys.all, convId] as const,
	status: (msgId: string) => [...messageKeys.all, 'status', msgId] as const,
};
