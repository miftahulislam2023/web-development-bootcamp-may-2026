import { useInfiniteQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api';
import { messageKeys } from '@/lib/query-keys';
import { messageResponseSchema } from '@/types/api';
import type { MessagePage } from '@/types/api';

/**
 * @description
 * Fetches messages with cursor-based pagination (sequenceNumber cursor).
 * Server returns { messages, hasMore } — hasMore drives getNextPageParam.
 */
export function useMessages(conversationId: string) {
	return useInfiniteQuery<MessagePage>({
		queryKey: messageKeys.list(conversationId),
		queryFn: async ({ pageParam }): Promise<MessagePage> => {
			const res = await api.get(`/api/conversations/${conversationId}/messages`, {
				params: { cursor: pageParam, limit: 30 },
			});
			const messages = z.array(messageResponseSchema).parse(res.data.messages);
			return { messages, hasMore: Boolean(res.data.hasMore) };
		},
		getNextPageParam: (lastPage) => {
			if (!lastPage.hasMore) return undefined;
			const last = lastPage.messages[lastPage.messages.length - 1];
			return last?.sequenceNumber;
		},
		initialPageParam: undefined as number | undefined,
		enabled: !!conversationId,
	});
}
