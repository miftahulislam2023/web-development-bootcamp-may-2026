import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api';
import { conversationKeys } from '@/lib/query-keys';
import { conversationListItemSchema } from '@/types/api';

/**
 * @description
 * Fetches all conversations with last message preview and unread count.
 * Stale time is high (60s) since WS invalidation handles realtime updates.
 */
export function useConversations() {
	return useQuery({
		queryKey: conversationKeys.list(),
		queryFn: async () => {
			const res = await api.get('/api/conversations');
			return z.array(conversationListItemSchema).parse(res.data.conversations);
		},
		staleTime: 60_000,
	});
}
