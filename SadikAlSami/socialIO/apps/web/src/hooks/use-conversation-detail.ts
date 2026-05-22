import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { conversationKeys } from '@/lib/query-keys';
import { conversationDetailResponseSchema } from '@/types/api';

/**
 * @description
 * Fetches conversation details (with participants) via GET /api/conversations/:id.
 * Used for the group info panel.
 */
export function useConversationDetail(conversationId: string) {
	return useQuery({
		queryKey: conversationKeys.detail(conversationId),
		queryFn: async () => {
			const res = await api.get(`/api/conversations/${conversationId}`);
			return conversationDetailResponseSchema.parse(res.data.conversation);
		},
		enabled: !!conversationId,
	});
}
