import prisma from '../../shared/db.js';

const conversationInclude = {
  members: {
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  }
};

function getParticipants(conversation) {
  return conversation.members.map((member) => ({
    id: member.user.id,
    name: member.user.name,
    email: member.user.email
  }));
}

function normalizeConversation(conversation, currentUserId) {
  const participants = getParticipants(conversation);
  let name = conversation.name;

  if (conversation.type === 'direct') {
    const otherUser = participants.find(
      (participant) => participant.id !== currentUserId
    );
    name = otherUser ? otherUser.name : 'Direct chat';
  }

  return {
    id: conversation.id,
    name,
    type: conversation.type,
    participants,
    createdAt: conversation.createdAt
  };
}

async function listConversationsForUser(userId) {
  const conversations = await prisma.conversation.findMany({
    where: {
      members: {
        some: { userId }
      }
    },
    include: conversationInclude,
    orderBy: { updatedAt: 'desc' }
  });

  return conversations.map((conversation) => (
    normalizeConversation(conversation, userId)
  ));
}

async function findExistingDirectConversation(userIds) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      type: 'direct',
      members: {
        every: { userId: { in: userIds } }
      },
      AND: userIds.map((userId) => ({
        members: { some: { userId } }
      }))
    },
    include: conversationInclude
  });

  if (!conversation || conversation.members.length !== 2) {
    return null;
  }

  return conversation;
}

async function createConversation({
  creatorId,
  name,
  participantIds,
  type
}) {
  const uniqueParticipantIds = [...new Set([creatorId, ...participantIds])];

  if (type === 'direct') {
    const oldConversation = await findExistingDirectConversation(uniqueParticipantIds);

    if (oldConversation) {
      return {
        conversation: normalizeConversation(oldConversation, creatorId),
        isExisting: true
      };
    }
  }

  const conversation = await prisma.conversation.create({
    data: {
      name: type === 'group' ? name.trim() : '',
      type,
      createdById: creatorId,
      members: {
        create: uniqueParticipantIds.map((userId) => ({
          user: { connect: { id: userId } }
        }))
      }
    },
    include: conversationInclude
  });

  return {
    conversation: normalizeConversation(conversation, creatorId),
    isExisting: false
  };
}

async function leaveConversation({ conversationId, userId }) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      members: {
        select: { id: true, userId: true }
      }
    }
  });

  if (!conversation) {
    const error = new Error('Conversation not found');
    error.statusCode = 404;
    throw error;
  }

  if (conversation.type !== 'group') {
    const error = new Error('Only group chats can be left');
    error.statusCode = 400;
    throw error;
  }

  const membership = conversation.members.find((member) => member.userId === userId);

  if (!membership) {
    const error = new Error('You are not in this group');
    error.statusCode = 400;
    throw error;
  }

  if (conversation.members.length === 1) {
    await prisma.conversation.delete({ where: { id: conversationId } });
    return;
  }

  await prisma.conversationMember.delete({
    where: { id: membership.id }
  });
}

export {
  createConversation,
  leaveConversation,
  listConversationsForUser
};
