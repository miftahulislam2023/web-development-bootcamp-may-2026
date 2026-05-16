import prisma from '../../shared/db.js';
import { getMessaging } from '../../shared/firebase.js';

async function saveNotificationToken({ token, userId }) {
  return prisma.notificationToken.upsert({
    where: { token },
    update: { userId },
    create: { token, userId }
  });
}

async function getConversationRecipientTokens({ conversationId, senderId }) {
  return prisma.notificationToken.findMany({
    where: {
      userId: { not: senderId },
      user: {
        memberships: {
          some: { conversationId }
        }
      }
    },
    select: { token: true }
  });
}

async function deleteNotificationTokens(tokens) {
  if (tokens.length === 0) {
    return;
  }

  await prisma.notificationToken.deleteMany({
    where: { token: { in: tokens } }
  });
}

async function sendMessageNotification({
  conversationId,
  imageUrl,
  senderId,
  senderName,
  text
}) {
  const messaging = getMessaging();

  if (!messaging) {
    console.log('Firebase notifications skipped: Firebase is not configured');
    return;
  }

  const recipientTokens = await getConversationRecipientTokens({
    conversationId,
    senderId
  });
  const tokens = recipientTokens.map((item) => item.token);

  if (tokens.length === 0) {
    console.log(`No notification tokens found for conversation ${conversationId}`);
    return;
  }

  const response = await messaging.sendEachForMulticast({
    tokens,
    notification: {
      title: senderName,
      body: text || 'Sent an image'
    },
    data: {
      conversationId,
      imageUrl: imageUrl || '',
      senderId,
      type: 'message.created'
    },
    webpush: {
      notification: {
        title: senderName,
        body: text || 'Sent an image',
        icon: '/favicon.svg'
      },
      fcmOptions: {
        link: process.env.CLIENT_URL || 'http://localhost:5173'
      }
    }
  });

  response.responses.forEach((result, index) => {
    if (!result.success) {
      console.log('Firebase notification failed:', {
        token: tokens[index],
        code: result.error?.code,
        message: result.error?.message
      });
    }
  });

  const failedTokens = response.responses
    .map((result, index) => (result.success ? null : tokens[index]))
    .filter(Boolean);

  console.log(
    `Firebase notifications sent: ${response.successCount}, failed: ${response.failureCount}`
  );

  await deleteNotificationTokens(failedTokens);
}

export {
  saveNotificationToken,
  sendMessageNotification
};
