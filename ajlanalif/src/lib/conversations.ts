export function normalizeConversationUserIds(userAId: string, userBId: string) {
  return userAId < userBId ? [userAId, userBId] as const : [userBId, userAId] as const;
}

export function getConversationPeer<ConversationType extends { userAId: string; userBId: string; userA: unknown; userB: unknown }>(
  conversation: ConversationType,
  currentUserId: string
) {
  return conversation.userAId === currentUserId ? conversation.userB : conversation.userA;
}
