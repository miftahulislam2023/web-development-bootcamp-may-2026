import prisma from '../../shared/db.js';
import { sendMessageNotification } from '../notifications/notifications.service.js';

async function listMessages(conversationId) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: 100
  });
}

async function createMessage({
  conversationId,
  imageUrl,
  senderId,
  text,
  user
}) {
  const message = await prisma.message.create({
    data: { conversationId, senderId, user, text, imageUrl }
  });

  console.log(`Checking notification recipients for conversation ${conversationId}`);
  sendMessageNotification({
    conversationId,
    imageUrl,
    senderId,
    senderName: user,
    text
  }).catch((error) => {
    console.log('Notification send failed:', error.message);
  });

  return message;
}

export {
  createMessage,
  listMessages
};
