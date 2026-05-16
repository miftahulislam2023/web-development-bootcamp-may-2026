import {
  clearCache,
  getCache,
  setCache
} from '../../shared/cache.js';
import {
  createMessage as createMessageService,
  listMessages
} from './messages.service.js';

async function getMessages(req, res) {
  const { conversationId } = req.query;

  if (!conversationId) {
    return res.status(400).json({ error: 'Conversation id is required' });
  }

  const cacheKey = `messages:${conversationId}`;
  const cachedMessages = await getCache(cacheKey);

  if (cachedMessages) {
    return res.json(cachedMessages);
  }

  try {
    const messages = await listMessages(conversationId);

    await setCache(cacheKey, messages, 15000);
    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not get messages' });
  }
}

async function createMessage(req, res) {
  const { conversationId, text, imageUrl } = req.body;
  const senderId = req.user.id;
  const user = req.user.name;

  if (!conversationId || !user || (!text && !imageUrl)) {
    return res.status(400).json({
      error: 'Conversation, name, and message content are required'
    });
  }

  try {
    const message = await createMessageService({
      conversationId,
      senderId,
      user,
      text,
      imageUrl
    });

    await clearMessageCache(conversationId);
    res.status(201).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not save message' });
  }
}

async function clearMessageCache(conversationId) {
  await clearCache(`messages:${conversationId}`);
}

export {
  clearMessageCache,
  createMessage,
  getMessages
};
