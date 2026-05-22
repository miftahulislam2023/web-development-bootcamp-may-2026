import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { messageKeys } from '@/lib/query-keys';

/**
 * @description
 * Soft-deletes a message via DELETE /api/conversations/:id/messages/:msgId.
 * Invalidates the message list on success.
 */
export function useDeleteMessage() {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: ({
			conversationId,
			messageId,
		}: {
			conversationId: string;
			messageId: string;
		}) => api.delete(`/api/conversations/${conversationId}/messages/${messageId}`),

		onSuccess: (_res, { conversationId }) => {
			qc.invalidateQueries({ queryKey: messageKeys.list(conversationId) });
		},
	});
}
