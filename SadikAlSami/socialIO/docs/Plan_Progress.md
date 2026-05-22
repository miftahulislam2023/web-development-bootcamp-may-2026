# Real-Time Chat Application - Plan & Progress

> Stack target: Next.js, Hono, Better Auth, Drizzle ORM, PostgreSQL, Redis, Cloudinary, WebSockets
> Snapshot date: May 16, 2026

---

## 1. Purpose of this Document

This document tracks the current execution state of the social.io platform, separating what is already present in the repository from what remains to be implemented for the full chat system.

---

## 2. Current Repository Architecture

### Monorepo shape
- `apps/web` - Next.js frontend
- `apps/server` - Hono API & WebSocket server
- `packages/auth` - Better Auth integration
- `packages/db` - Database schema, migrations, Redis client, and encryption
- `packages/env` - Type-safe environment variables
- `packages/ui` - Shadcn UI components and design system
- `packages/config` - Shared ESLint, TS, and Prettier configs

### Current State
- **Server:** Fully functional Hono server with Better Auth, comprehensive chat REST routes, WebSocket upgrade/fan-out, DB operations, and Redis caching.
- **Web:** Auth pages, profile onboarding (`/profile/onboarding`), and full chat UI (sidebar conversation list, real-time message thread, composer, user search modal). A cohesive "Warm Precision" design system is implemented.
- **Data/Infra:** PostgreSQL (Drizzle ORM) and Redis. Local Docker infra is fully operational.

---

## 3. Target Architecture (Mostly Implemented)

- `apps/server`: API gateway + realtime node.
  - Auth routes, REST routes for conversations/messages/profiles.
  - WebSocket handling for presence, typing, new messages, and read receipts.
  - End-to-end request/response validation with Zod + Hono `zValidator`.
- `apps/web`: Chat client.
  - Real-time conversation list and thread view.
  - State managed via TanStack Query and Zustand.
- **Redis:**
  - Pub/sub for multi-instance WS fan-out.
  - Ephemeral typing keys with TTL.
  - Presence tracking.
  - Hot-conversation cache (ZSET containing decrypted message JSON).
- **PostgreSQL:** Durable chat state with sequence-based ordering and AES-256-GCM encryption at rest for message content.

---

## 4. API and Realtime Surfaces

### REST endpoints (Implemented)
- `GET /api/profile/me`, `POST /api/profile`, `PATCH /api/profile`, `PATCH /api/profile/avatar`, `GET /api/profile/search`
- `GET /api/conversations`, `POST /api/conversations`, `GET /api/conversations/:id`
- `GET /api/conversations/:id/messages`, `POST /api/conversations/:id/messages`
- `PATCH /api/messages/:id`, `DELETE /api/messages/:id`

### REST endpoints (Pending)
- `POST /api/conversations/:id/members`, `DELETE /api/conversations/:id/members/:userId`, `PATCH /api/conversations/:id/members/me`
- `POST /api/messages/:id/reactions`, `DELETE /api/messages/:id/reactions/:emoji`
- `POST /api/upload/sign`, `DELETE /api/upload/image`

### Realtime events (Implemented)
- **Client -> server:** `join_conversation`, `send_message`, `typing_start`, `typing_stop`, `message_seen`
- **Server -> client:** `new_message`, `typing_update`, `message_status_update`, `conversation_updated`

### Realtime events (Pending)
- **Server -> client:** `member_added`, `member_removed`, `reaction_update`

---

## 5. Encryption and Cache Design

- **Encryption:** AES-256-GCM runs entirely on the server. The client always receives plaintext. Ciphertext (`content_enc`, `content_iv`) is an internal DB concern and never appears in API responses, WS payloads, or Redis.
- **Cache:** To avoid repetitive decryption, formatted (plaintext) messages are cached in Redis ZSETs scored by `sequence_number`.
- **Invalidation:** Sending, editing, or deleting a message updates the DB and immediately updates the Redis ZSET via a pipeline.

---

## 6. Feature Status (Truthful)

### Foundation
- [x] Monorepo scaffold (`apps/*`, `packages/*`)
- [x] Better Auth baseline integration
- [x] Basic Hono server bootstrapped
- [x] Local Postgres + Redis infra setup in `packages/db`
- [x] Chat domain Drizzle schema implementation
- [x] Chat HTTP APIs
- [x] Realtime WebSocket flow

### Product features
- [x] DM and group conversation creation
- [x] Cursor-based message pagination
- [x] Typing indicators
- [x] Message delivered/seen lifecycle + realtime UI ticks
- [x] Redis hot cache and pub/sub fan-out
- [x] Encryption at rest for message content
- [x] Cache invalidation on new message, edit, and delete
- [x] UI Design System Rework ("Warm Precision")
- [ ] Group membership admin flows (Basic DB layer exists, UI pending)
- [ ] Emoji reactions
- [ ] Image message flow (Cloudinary signed upload)

---

## 7. Execution Plan (Adjusted to Current Baseline)

### Day 1 - Baseline Alignment + Schema Bring-Up
- [x] Implement full chat/domain schema in Drizzle
- [x] Generate/push migrations
- [x] Add schema-level enums/validation contracts

### Day 2 — Schema Update + Profile + Search + Chat Core HTTP
- [x] Shared schemas + typed context
- [x] Schema changes (Unique display name, trigram index)
- [x] Crypto utils
- [x] Profile, User, Conversation, Message services
- [x] Controllers, routes, and middleware
- [x] Frontend profile setup (`/profile/onboarding`) and chat shell

### Day 3 - Realtime + Redis Integration
- [x] WebSocket upgrade and connection lifecycle
- [x] Redis pub/sub fan-out
- [x] Typing key TTL and presence
- [x] Redis ZSET cache populate and read path
- [x] Frontend WebSocket integration

### Day 4 - Message Status + Chat List Fidelity
- [x] Delivered/seen persistence and broadcast
- [x] Conversation list fetch by `last_message_id`
- [x] Read-receipt behavior for DM and group contexts
- [x] Status ticks and read receipts on messages
- [x] Chat list preview

### Day 5 - Groups, Roles, Reactions
- [ ] Group role authorization gates
- [ ] Member add/remove + nickname updates
- [ ] Reaction mutation + realtime sync
- [ ] Group member management UI
- [ ] Reaction picker and reaction list display

### Day 6 - Upload + Edit + Cache Hardening
- [x] Message edit path and cache invalidation
- [x] Display `is_deleted` messages
- [ ] Signed upload endpoint (`POST /api/upload/sign`)
- [ ] Image delete endpoint (`DELETE /api/upload/image`)
- [ ] Image message send path and UI

### Day 7 - Hardening + Deploy Readiness
- [ ] Error handling and rate-limit guardrails
- [ ] Deployment wiring (Vercel, Railway)
- [ ] Verify WSS works on production
- [ ] Error/empty/loading UX hardening
- [ ] Failed send retry state
- [ ] Connection lost banner (WS disconnect detection)

---

## 8. Frontend Functional Plan (Pages + Modules)

**Routes:**
- `/login`: sign-in/sign-up UI (Done)
- `/profile/onboarding`: Profile creation step (Done)
- `/chat`: chat shell with conversation list + thread view (Done)
- `/settings`: profile edits, notification toggles (Pending)

**Core UI modules:**
- Conversation list: preview, unread counts, last message (Done)
- Thread view: message list with infinite scroll, typing indicator, status ticks (Done)
- Composer: text input, send button, auto-resize, pill design (Done)

---

## 9. Risks and Mitigations

| Risk | Likelihood | Mitigation |
| ---- | ---------- | ---------- |
| Cache serving stale content after edit | Low | `ZREMRANGEBYSCORE` + `ZADD` at same score on every edit updates cache correctly. |
| Cache serving stale content after send | Low | Pipeline `ZADD` + `ZREMRANGEBYRANK` + `EXPIRE` after every insert keeps cache fresh. |
| Redis unavailable at runtime | Low | All cache paths fall through to DB silently. |
| Write throughput exceeds DB capacity | Very Low | Direct per-message transaction is correct now; write buffer documented as known scaling path. |
