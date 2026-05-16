import { getUsers } from '../users/users.controller.js';
import {
  clearCache,
  getCache,
  setCache
} from '../../shared/cache.js';
import {
  createConversation as createConversationService,
  leaveConversation as leaveConversationService,
  listConversationsForUser
} from './conversations.service.js';

async function getConversations(req, res) {
  const userId = req.query.userId || req.user.id;

  if (userId !== req.user.id) {
    return res.status(403).json({ message: 'You can only access your own conversations' });
  }

  const cacheKey = `conversations:${userId}`;
  const cachedConversations = await getCache(cacheKey);

  if (cachedConversations) {
    return res.json(cachedConversations);
  }

  try {
    const conversations = await listConversationsForUser(userId);

    await setCache(cacheKey, conversations, 30000);
    res.json(conversations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Could not get conversations' });
  }
}

async function createConversation(req, res) {
  const { participantIds, name, type } = req.body;
  const creatorId = req.user.id;

  if (!creatorId || !Array.isArray(participantIds) || !type) {
    return res.status(400).json({ message: 'Conversation details are required' });
  }

  const uniqueParticipantIds = [...new Set([creatorId, ...participantIds])];

  if (type === 'direct' && uniqueParticipantIds.length !== 2) {
    return res.status(400).json({ message: 'Direct chat needs exactly two users' });
  }

  if (type === 'group' && uniqueParticipantIds.length < 3) {
    return res.status(400).json({ message: 'Group chat needs at least three users' });
  }

  if (type === 'group' && !name?.trim()) {
    return res.status(400).json({ message: 'Group name is required' });
  }

  try {
    const result = await createConversationService({
      creatorId,
      name,
      participantIds,
      type
    });

    await clearCache('conversations:');
    res.status(result.isExisting ? 200 : 201).json(result.conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Could not create conversation' });
  }
}

async function leaveConversation(req, res) {
  const { id } = req.params;
  const userId = req.body.userId || req.user.id;

  if (userId !== req.user.id) {
    return res.status(403).json({ message: 'You can only leave as yourself' });
  }

  try {
    await leaveConversationService({ conversationId: id, userId });
    await clearCache('conversations:');

    res.json({ message: 'Left group' });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Could not leave group'
    });
  }
}

export {
  createConversation,
  getConversations,
  getUsers,
  leaveConversation
};
