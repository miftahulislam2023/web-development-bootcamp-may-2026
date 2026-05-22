import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { conversationTypeEnum, messageStatusEnum, messageTypeEnum, participantRoleEnum } from "./enums";

export const conversation = pgTable("conversation", {
  id: text("id").primaryKey(),
  type: conversationTypeEnum("type").notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  lastMessageId: text("last_message_id").references((): AnyPgColumn => message.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const participant = pgTable(
  "participant",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversation.id),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    role: participantRoleEnum("role").notNull().default("member"),
    nickname: text("nickname"),
    leftAt: timestamp("left_at"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("participant_conv_user_uq").on(table.conversationId, table.userId),
    index("participant_convId_idx").on(table.conversationId),
    index("participant_userId_idx").on(table.userId),
  ],
);

export const message = pgTable(
  "message",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversation.id),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id),
    sequenceNumber: integer("sequence_number").notNull(),
    contentIv: text("content_iv").notNull(),
    contentEnc: text("content_enc").notNull(),
    type: messageTypeEnum("type").notNull().default("text"),
    imageUrl: text("image_url"),
    replyToId: text("reply_to_id").references((): AnyPgColumn => message.id),
    isEdited: boolean("is_edited").notNull().default(false),
    editedAt: timestamp("edited_at"),
    isDeleted: boolean("is_deleted").notNull().default(false),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("message_conv_seq_uq").on(table.conversationId, table.sequenceNumber),
    index("message_senderId_idx").on(table.senderId),
  ],
);

export const messageEditHistory = pgTable(
  "message_edit_history",
  {
    id: text("id").primaryKey(),
    messageId: text("message_id")
      .notNull()
      .references(() => message.id),
    prevContentIv: text("prev_content_iv").notNull(),
    prevContentEnc: text("prev_content_enc").notNull(),
    editedAt: timestamp("edited_at").defaultNow().notNull(),
  },
  (table) => [index("edit_history_msgId_idx").on(table.messageId)],
);

export const messageStatus = pgTable(
  "message_status",
  {
    messageId: text("message_id")
      .notNull()
      .references(() => message.id),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    status: messageStatusEnum("status").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.messageId, table.userId] }),
    index("msg_status_msgId_idx").on(table.messageId),
    index("msg_status_userId_idx").on(table.userId),
  ],
);

export const messageReaction = pgTable(
  "message_reaction",
  {
    id: text("id").primaryKey(),
    messageId: text("message_id")
      .notNull()
      .references(() => message.id),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    emoji: text("emoji").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("reaction_uq").on(table.messageId, table.userId, table.emoji),
    index("reaction_msgId_idx").on(table.messageId),
  ],
);

