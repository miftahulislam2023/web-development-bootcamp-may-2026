import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { messageKeys } from '@/lib/query-keys';
import type { MessageStatusCounts } from '@/types/api';

/**
 * @description
 * Fetches delivery/read status counts for a message via GET /api/messages/:msgId/status.
 * Returns { deliveredCount, seenCount, totalParticipants } for "Seen by X of Y" tooltip.
 */
export function useMessageStatus(messageId: string) {
	return useQuery({
		queryKey: messageKeys.status(messageId),
		queryFn: async (): Promise<MessageStatusCounts> => {
			const res = await api.get(`/api/messages/${messageId}/status`);
			return res.data.status as MessageStatusCounts;
		},
		enabled: !!messageId,
	});
}
