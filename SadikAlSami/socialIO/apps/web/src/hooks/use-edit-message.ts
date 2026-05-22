import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { messageKeys } from '@/lib/query-keys';
import type { EditMessageBody } from '@/types/api';

/**
 * @description
 * Edits a message via PATCH /api/conversations/:id/messages/:msgId.
 * Invalidates the message list on success.
 */
export function useEditMessage() {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: ({
			conversationId,
			messageId,
			data,
		}: {
			conversationId: string;
			messageId: string;
			data: EditMessageBody;
		}) => api.patch(`/api/conversations/${conversationId}/messages/${messageId}`, data),

		onSuccess: (_res, { conversationId }) => {
			qc.invalidateQueries({ queryKey: messageKeys.list(conversationId) });
		},
	});
}
