import { relations } from "drizzle-orm";

import { account, session, user, verification } from "./auth";
import {
  conversation,
  message,
  messageEditHistory,
  messageReaction,
  messageStatus,
  participant,
} from "./chat";
import { userProfile } from "./profile";

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  profile: one(userProfile),
  participants: many(participant),
  sentMessages: many(message, { relationName: "messageSender" }),
  statuses: many(messageStatus),
  reactions: many(messageReaction),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const verificationRelations = relations(verification, () => ({}));

export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.id],
    references: [user.id],
  }),
}));

export const conversationRelations = relations(conversation, ({ many, one }) => ({
  participants: many(participant),
  messages: many(message, { relationName: "conversationMessages" }),
  lastMessage: one(message, {
    fields: [conversation.lastMessageId],
    references: [message.id],
    relationName: "conversationLastMessage",
  }),
}));

export const participantRelations = relations(participant, ({ one }) => ({
  conversation: one(conversation, {
    fields: [participant.conversationId],
    references: [conversation.id],
  }),
  user: one(user, {
    fields: [participant.userId],
    references: [user.id],
  }),
}));

export const messageRelations = relations(message, ({ many, one }) => ({
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
    relationName: "conversationMessages",
  }),
  sender: one(user, {
    fields: [message.senderId],
    references: [user.id],
    relationName: "messageSender",
  }),
  replyTo: one(message, {
    fields: [message.replyToId],
    references: [message.id],
    relationName: "messageReply",
  }),
  replies: many(message, { relationName: "messageReply" }),
  editHistory: many(messageEditHistory),
  statuses: many(messageStatus),
  reactions: many(messageReaction),
  latestForConversation: many(conversation, { relationName: "conversationLastMessage" }),
}));

export const messageEditHistoryRelations = relations(messageEditHistory, ({ one }) => ({
  message: one(message, {
    fields: [messageEditHistory.messageId],
    references: [message.id],
  }),
}));

export const messageStatusRelations = relations(messageStatus, ({ one }) => ({
  message: one(message, {
    fields: [messageStatus.messageId],
    references: [message.id],
  }),
  user: one(user, {
    fields: [messageStatus.userId],
    references: [user.id],
  }),
}));

export const messageReactionRelations = relations(messageReaction, ({ one }) => ({
  message: one(message, {
    fields: [messageReaction.messageId],
    references: [message.id],
  }),
  user: one(user, {
    fields: [messageReaction.userId],
    references: [user.id],
  }),
}));

