import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { conversationKeys } from '@/lib/query-keys';

/**
 * @description
 * Polls unread counts per conversation via GET /api/conversations/unread.
 * Returns Record<conversationId, unreadCount>.
 * Polls every 30s as a fallback when WS is unavailable.
 */
export function useUnreadCounts() {
	return useQuery({
		queryKey: conversationKeys.unread(),
		queryFn: async () => {
			const res = await api.get('/api/conversations/unread');
			return res.data.counts as Record<string, number>;
		},
		refetchInterval: 30_000,
	});
}
