import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { conversationKeys } from '@/lib/query-keys';
import type { CreateConversationBody } from '@/types/api';

/**
 * @description
 * Creates a DM or group conversation via POST /api/conversations.
 * Body is a discriminated union — { type: 'dm', participantId } or { type: 'group', name, participantIds }.
 * Invalidates conversations list on success.
 */
export function useCreateConversation() {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateConversationBody) => api.post('/api/conversations', data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: conversationKeys.all });
		},
	});
}
