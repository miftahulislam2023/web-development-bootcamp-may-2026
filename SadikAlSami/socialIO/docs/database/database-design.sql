CREATE TYPE "conversation_type" AS ENUM ('dm', 'group');

CREATE TYPE "participant_role" AS ENUM ('admin', 'member');

CREATE TYPE "message_type" AS ENUM ('text', 'image', 'system');

CREATE TYPE "message_delivery_status" AS ENUM ('delivered', 'seen');

CREATE TABLE "user" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "email_verified" boolean NOT NULL DEFAULT false,
  "image" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "session" (
  "id" text PRIMARY KEY,
  "expires_at" timestamp NOT NULL,
  "token" text UNIQUE NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "ip_address" text,
  "user_agent" text,
  "user_id" text NOT NULL
);

CREATE TABLE "account" (
  "id" text PRIMARY KEY,
  "account_id" text NOT NULL,
  "provider_id" text NOT NULL,
  "user_id" text NOT NULL,
  "access_token" text,
  "refresh_token" text,
  "id_token" text,
  "access_token_expires_at" timestamp,
  "refresh_token_expires_at" timestamp,
  "scope" text,
  "password" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "verification" (
  "id" text PRIMARY KEY,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "user_profile" (
  "id" text PRIMARY KEY,
  "display_name" text NOT NULL,
  "avatar_url" text,
  "bio" text,
  "last_seen_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "conversation" (
  "id" text PRIMARY KEY,
  "type" "conversation_type" NOT NULL,
  "name" text,
  "avatar_url" text,
  "last_message_id" text,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "participant" (
  "id" text PRIMARY KEY,
  "conversation_id" text NOT NULL,
  "user_id" text NOT NULL,
  "role" "participant_role" NOT NULL DEFAULT 'member',
  "nickname" text,
  "left_at" timestamp,
  "joined_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "message" (
  "id" text PRIMARY KEY,
  "conversation_id" text NOT NULL,
  "sender_id" text NOT NULL,
  "sequence_number" integer NOT NULL,
  "content_iv" text NOT NULL,
  "content_enc" text NOT NULL,
  "type" "message_type" NOT NULL DEFAULT 'text',
  "image_url" text,
  "reply_to_id" text,
  "is_edited" boolean NOT NULL DEFAULT false,
  "edited_at" timestamp,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "message_edit_history" (
  "id" text PRIMARY KEY,
  "message_id" text NOT NULL,
  "prev_content_iv" text NOT NULL,
  "prev_content_enc" text NOT NULL,
  "edited_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "message_status" (
  "message_id" text NOT NULL,
  "user_id" text NOT NULL,
  "status" "message_delivery_status" NOT NULL,
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY ("message_id", "user_id")
);

CREATE TABLE "message_reaction" (
  "id" text PRIMARY KEY,
  "message_id" text NOT NULL,
  "user_id" text NOT NULL,
  "emoji" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE INDEX "session_userId_idx" ON "session" ("user_id");

CREATE INDEX "account_userId_idx" ON "account" ("user_id");

CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");

CREATE UNIQUE INDEX "participant_conv_user_uq" ON "participant" ("conversation_id", "user_id");

CREATE INDEX "participant_convId_idx" ON "participant" ("conversation_id");

CREATE INDEX "participant_userId_idx" ON "participant" ("user_id");

CREATE UNIQUE INDEX "message_conv_seq_uq" ON "message" ("conversation_id", "sequence_number");

CREATE INDEX "message_senderId_idx" ON "message" ("sender_id");

CREATE INDEX "edit_history_msgId_idx" ON "message_edit_history" ("message_id");

CREATE INDEX "msg_status_msgId_idx" ON "message_status" ("message_id");

CREATE INDEX "msg_status_userId_idx" ON "message_status" ("user_id");

CREATE UNIQUE INDEX "reaction_uq" ON "message_reaction" ("message_id", "user_id", "emoji");

CREATE INDEX "reaction_msgId_idx" ON "message_reaction" ("message_id");

COMMENT ON TABLE "user" IS 'Core identity table managed by better-auth. Never add app-domain columns here — extend via user_profile instead.';

COMMENT ON COLUMN "user"."id" IS 'better-auth nanoid';

COMMENT ON COLUMN "user"."image" IS 'library default avatar — superseded by user_profile.avatar_url';

COMMENT ON COLUMN "account"."provider_id" IS '"credential" | "google" | "github" ...';

COMMENT ON COLUMN "account"."password" IS 'bcrypt hash — only set when provider_id = "credential"';

COMMENT ON COLUMN "verification"."identifier" IS 'email or phone being verified';

COMMENT ON COLUMN "verification"."value" IS 'hashed OTP / token';

COMMENT ON TABLE "user_profile" IS 'Create this row inside your better-auth onUserCreate hook or a DB trigger.';

COMMENT ON COLUMN "user_profile"."id" IS 'same value as user.id — 1-to-1 enforced by shared PK';

COMMENT ON COLUMN "user_profile"."display_name" IS 'user-chosen name; initialised from user.name on signup';

COMMENT ON COLUMN "user_profile"."avatar_url" IS 'Cloudinary URL — app reads this, not user.image';

COMMENT ON COLUMN "user_profile"."last_seen_at" IS 'updated on WS disconnect; drives the online/offline dot';

COMMENT ON TABLE "conversation" IS 'For DMs, enforce uniqueness at the app layer: sort both user IDs and reject duplicates before insert.';

COMMENT ON COLUMN "conversation"."id" IS 'nanoid';

COMMENT ON COLUMN "conversation"."type" IS '"dm" | "group"';

COMMENT ON COLUMN "conversation"."name" IS 'null for DMs; required for groups';

COMMENT ON COLUMN "conversation"."avatar_url" IS 'group Cloudinary URL; null for DMs';

COMMENT ON COLUMN "conversation"."last_message_id" IS 'denormalized FK to message.id; updated in same txn as INSERT message; enables O(1) chat-list load';

COMMENT ON TABLE "participant" IS 'Many-to-many join between user and conversation. Role enforced at API layer — only admin can add/remove members.';

COMMENT ON COLUMN "participant"."role" IS '"admin" | "member" — only meaningful for groups';

COMMENT ON COLUMN "participant"."nickname" IS 'per-conversation override of display_name; null = fall back to user_profile.display_name';

COMMENT ON COLUMN "participant"."left_at" IS 'null = active member; set on leave/kick — soft-remove keeps message FK integrity';

COMMENT ON TABLE "message" IS 'Cursor pagination: WHERE conversation_id = $x AND sequence_number < $cursor ORDER BY sequence_number DESC LIMIT 30';

COMMENT ON COLUMN "message"."id" IS 'nanoid';

COMMENT ON COLUMN "message"."sequence_number" IS 'monotonically increasing per conversation; source of truth for ordering and cursor pagination — generated inside SELECT MAX(seq)+1 FOR UPDATE transaction';

COMMENT ON COLUMN "message"."content_iv" IS 'AES-GCM 12-byte IV, base64-encoded';

COMMENT ON COLUMN "message"."content_enc" IS 'AES-256-GCM ciphertext, base64-encoded — raw DB dump reveals nothing';

COMMENT ON COLUMN "message"."type" IS '"text" | "image" | "system"';

COMMENT ON COLUMN "message"."image_url" IS 'Cloudinary URL — only set when type = "image"';

COMMENT ON COLUMN "message"."reply_to_id" IS 'self-ref to message.id; null = top-level message';

COMMENT ON COLUMN "message"."is_edited" IS 'flips to true on first edit; client renders "Edited" label under the bubble';

COMMENT ON COLUMN "message"."edited_at" IS 'timestamp of most recent edit; null if never edited';

COMMENT ON COLUMN "message"."deleted_at" IS 'null unless soft-deleted; client renders "This message was deleted"';

COMMENT ON TABLE "message_edit_history" IS 'Append-only audit log. Edit flow: 1) insert old ciphertext here  2) update message row with new ciphertext + set is_edited=true + set edited_at. Never UPDATE or DELETE rows here.';

COMMENT ON COLUMN "message_edit_history"."prev_content_iv" IS 'IV of the content version that was replaced';

COMMENT ON COLUMN "message_edit_history"."prev_content_enc" IS 'ciphertext of the content version that was replaced';

COMMENT ON COLUMN "message_edit_history"."edited_at" IS 'when this version was superseded';

COMMENT ON TABLE "message_status" IS 'Upsert: INSERT ON CONFLICT (message_id, user_id) DO UPDATE SET status, updated_at. Group seen-by-all: COUNT rows WHERE status="seen" and compare to active participant count.';

COMMENT ON COLUMN "message_status"."status" IS '"delivered" | "seen" — only ever moves forward, never backwards';

COMMENT ON COLUMN "message_reaction"."emoji" IS 'single emoji e.g. "thumbsup" — stored as text shortcode';

ALTER TABLE "session" ADD CONSTRAINT "session_user" FOREIGN KEY ("user_id") REFERENCES "user" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "account" ADD CONSTRAINT "account_user" FOREIGN KEY ("user_id") REFERENCES "user" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "user_profile" ADD CONSTRAINT "profile_user" FOREIGN KEY ("id") REFERENCES "user" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "conversation" ADD CONSTRAINT "conv_last_msg" FOREIGN KEY ("last_message_id") REFERENCES "message" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "participant" ADD CONSTRAINT "part_conv" FOREIGN KEY ("conversation_id") REFERENCES "conversation" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "participant" ADD CONSTRAINT "part_user" FOREIGN KEY ("user_id") REFERENCES "user" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "message" ADD CONSTRAINT "msg_conv" FOREIGN KEY ("conversation_id") REFERENCES "conversation" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "message" ADD CONSTRAINT "msg_sender" FOREIGN KEY ("sender_id") REFERENCES "user" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "message" ADD CONSTRAINT "msg_reply" FOREIGN KEY ("reply_to_id") REFERENCES "message" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "message_edit_history" ADD CONSTRAINT "edit_msg" FOREIGN KEY ("message_id") REFERENCES "message" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "message_status" ADD CONSTRAINT "status_msg" FOREIGN KEY ("message_id") REFERENCES "message" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "message_status" ADD CONSTRAINT "status_user" FOREIGN KEY ("user_id") REFERENCES "user" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "message_reaction" ADD CONSTRAINT "reaction_msg" FOREIGN KEY ("message_id") REFERENCES "message" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "message_reaction" ADD CONSTRAINT "reaction_user" FOREIGN KEY ("user_id") REFERENCES "user" ("id") DEFERRABLE INITIALLY IMMEDIATE;
