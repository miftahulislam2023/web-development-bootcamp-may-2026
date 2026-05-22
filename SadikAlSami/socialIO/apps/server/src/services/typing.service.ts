import { typingClear, typingGetUsers, typingSet } from '@socialIO/db/redis/service';

export async function startTyping(conversationId: string, userId: string): Promise<void> {
	await typingSet(conversationId, userId);
}

export async function stopTyping(conversationId: string, userId: string): Promise<void> {
	await typingClear(conversationId, userId);
}

export async function getWhoIsTyping(conversationId: string): Promise<string[]> {
	return typingGetUsers(conversationId);
}