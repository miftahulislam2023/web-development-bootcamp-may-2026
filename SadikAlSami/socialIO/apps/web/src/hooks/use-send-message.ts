import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { messageKeys } from '@/lib/query-keys';
import type { MessagePage, MessageResponse } from '@/types/api';

/**
 * @description
 * Sends a message via POST and optimistically prepends it to the InfiniteData cache.
 * On error, rolls back. On success, WS new_message replaces the temp entry.
 */
export function useSendMessage() {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
			api.post(`/api/conversations/${conversationId}/messages`, { content, type: 'text' }),

		onMutate: async ({ conversationId, content }) => {
			await qc.cancelQueries({ queryKey: messageKeys.list(conversationId) });

			const previous = qc.getQueryData<InfiniteData<MessagePage>>(messageKeys.list(conversationId));

			const tempId = `temp-${Date.now()}`;
			const optimistic: MessageResponse = {
				id: tempId,
				conversationId,
				senderId: 'me',
				sequenceNumber: -1,
				content,
				type: 'text',
				imageUrl: null,
				replyToId: null,
				isEdited: false,
				editedAt: null,
				isDeleted: false,
				deletedAt: null,
				createdAt: new Date().toISOString(),
				deliveredCount: 0,
				seenCount: 0,
			};

			qc.setQueryData<InfiniteData<MessagePage>>(messageKeys.list(conversationId), (old) => {
				if (!old) return old;
				const newPages = [...old.pages];
				newPages[0] = {
					...newPages[0],
					messages: [optimistic, ...newPages[0].messages],
				};
				return { ...old, pages: newPages };
			});

			return { previous, tempId };
		},

		onSuccess: (res, variables, context) => {
			if (!context) return;
			const { tempId } = context;
			const realMessage = res.data.message;

			qc.setQueryData<InfiniteData<MessagePage>>(messageKeys.list(variables.conversationId), (old) => {
				if (!old) return old;
				const newPages = [...old.pages];

				// Check if WS already inserted the real message
				let hasRealMessage = false;
				for (const page of newPages) {
					if (page.messages.some((m) => m.id === realMessage.id)) {
						hasRealMessage = true;
						break;
					}
				}

				// Find and replace/remove the temp message
				for (let i = 0; i < newPages.length; i++) {
					const tempIdx = newPages[i].messages.findIndex((m) => m.id === tempId);
					if (tempIdx !== -1) {
						const newMessages = [...newPages[i].messages];
						if (hasRealMessage) {
							// Remove temp, real is already there
							newMessages.splice(tempIdx, 1);
						} else {
							// Replace temp with real
							newMessages[tempIdx] = realMessage;
							hasRealMessage = true;
						}
						newPages[i] = { ...newPages[i], messages: newMessages };
					}
				}

				return { ...old, pages: newPages };
			});
		},

		onError: (_err, { conversationId }, context) => {
			if (context?.previous) {
				qc.setQueryData(messageKeys.list(conversationId), context.previous);
			}
		},

		// No onSettled invalidation — WS new_message replaces the temp entry with real data.
	});
}
