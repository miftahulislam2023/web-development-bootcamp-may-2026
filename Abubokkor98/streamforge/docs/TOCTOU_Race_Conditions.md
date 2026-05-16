# TOCTOU Race Conditions in StreamForge Backend

> **Status:** Deferred — documented for future hardening  
> **Priority:** Low (single-host MVP) → High (multi-user production)  
> **Affects:** `streams.service.ts`, `rooms.service.ts`

---

## What is TOCTOU?

**Time of Check, Time of Use (TOCTOU)** is a class of race condition where:

1. A value is **checked** (e.g., `room.status === OFFLINE`)
2. An action is **taken** based on that check (e.g., `update room → LIVE`)
3. Between steps 1 and 2, another concurrent request **changes the value**

Both requests pass the check, and both execute the action — violating the intended business invariant.

### Why Prisma's Batched `$transaction([...])` Doesn't Help

```typescript
// Current pattern — batched transaction
const room = await getOwnedRoomOrThrow(roomKey, hostId); // ← CHECK (outside tx)

if (room.status === RoomStatus.LIVE) {                    // ← CHECK (outside tx)
  throw ApiError.badRequest('Room is already live');
}

const [session] = await prisma.$transaction([              // ← USE (inside tx)
  prisma.streamSession.create({ data: { room_id: room.id } }),
  prisma.room.update({ where: { room_key: roomKey }, data: { status: RoomStatus.LIVE } }),
]);
```

The batched `$transaction([...])` guarantees that the **create + update execute atomically** (both succeed or both roll back). But the **status check happens BEFORE the transaction starts**. There is no row lock between the check and the write.

### Visual Timeline of the Race

```
Time    Request A                           Request B
────    ─────────                           ─────────
t0      getOwnedRoomOrThrow()
        → status: OFFLINE ✅
t1                                          getOwnedRoomOrThrow()
                                            → status: OFFLINE ✅  (still OFFLINE)
t2      $transaction([
          create StreamSession #1,
          update room → LIVE
        ]) ✅
t3                                          $transaction([
                                              create StreamSession #2,  ← DUPLICATE
                                              update room → LIVE        ← redundant
                                            ]) ✅
```

**Result:** Two active `StreamSession` records exist for the same room. When `endStream` runs `findFirst({ ended_at: null })`, it only closes one. The other is orphaned forever.

---

## All Affected Operations

### 1. `startStream` — `streams.service.ts`

**Invariant:** Only one active `StreamSession` per room at any time.

**Current code:**
```typescript
const room = await getOwnedRoomOrThrow(roomKey, hostId);
if (room.status === RoomStatus.LIVE) {
  throw ApiError.badRequest('Room is already live');
}
// ... $transaction creates session + sets LIVE
```

**Race window:** Between the status check and the transaction, another request can also read `OFFLINE` and proceed.

**Impact:** Duplicate active sessions, orphaned session records.

**Fix pattern:**
```typescript
const session = await prisma.$transaction(async (tx) => {
  const room = await tx.room.findUnique({ where: { room_key: roomKey } });
  if (!room) throw ApiError.notFound('Room not found');
  if (room.host_id !== hostId) throw ApiError.forbidden('You do not own this room');

  // Atomic conditional update — PostgreSQL locks the row
  const transition = await tx.room.updateMany({
    where: { room_key: roomKey, status: { not: RoomStatus.LIVE } },
    data: { status: RoomStatus.LIVE },
  });
  if (transition.count === 0) throw ApiError.badRequest('Room is already live');

  return tx.streamSession.create({ data: { room_id: room.id } });
});
```

---

### 2. `endStream` — `streams.service.ts`

**Invariant:** A stream can only be ended once.

**Current code:**
```typescript
const room = await getOwnedRoomOrThrow(roomKey, hostId);
if (room.status !== RoomStatus.LIVE) {
  throw ApiError.badRequest('Room is not currently live');
}
const activeSession = await prisma.streamSession.findFirst({
  where: { room_id: room.id, ended_at: null },
});
// ... $transaction updates session + sets ENDED
```

**Race window:** Two concurrent "End Stream" clicks. Both read `LIVE`, both find the same active session, both try to close it.

**Impact:** The second request either double-updates the session (incorrect duration) or crashes on a stale reference.

**Fix pattern:**
```typescript
const updatedSession = await prisma.$transaction(async (tx) => {
  const transition = await tx.room.updateMany({
    where: { room_key: roomKey, status: RoomStatus.LIVE },
    data: { status: RoomStatus.ENDED },
  });
  if (transition.count === 0) throw ApiError.badRequest('Room is not currently live');

  const room = await tx.room.findUnique({ where: { room_key: roomKey } });
  if (!room) throw ApiError.notFound('Room not found');
  if (room.host_id !== hostId) throw ApiError.forbidden('You do not own this room');

  const activeSession = await tx.streamSession.findFirst({
    where: { room_id: room.id, ended_at: null },
    orderBy: { started_at: 'desc' },
  });
  if (!activeSession) throw ApiError.notFound('No active stream session found');

  const now = new Date();
  const durationSeconds = Math.floor((now.getTime() - activeSession.started_at.getTime()) / 1000);

  return tx.streamSession.update({
    where: { id: activeSession.id },
    data: { ended_at: now, duration_seconds: durationSeconds },
  });
});
```

---

### 3. `deleteRoom` — `rooms.service.ts`

**Invariant:** Cannot delete a room that is `LIVE`.

**Current code:**
```typescript
const room = await getOwnedRoomOrThrow(roomKey, hostId);
if (room.status === RoomStatus.LIVE) {
  throw ApiError.badRequest('Cannot delete a room that is currently live');
}
await prisma.room.delete({ where: { room_key: roomKey } });
```

**Race window:** Host checks status as `OFFLINE`, but between the check and delete, another tab/process sets the room to `LIVE` via `startStream`.

**Impact:** A `LIVE` room gets deleted, disconnecting all active viewers and orphaning the LiveKit session.

**Fix pattern:**
```typescript
await prisma.$transaction(async (tx) => {
  const room = await tx.room.findUnique({ where: { room_key: roomKey } });
  if (!room) throw ApiError.notFound('Room not found');
  if (room.host_id !== hostId) throw ApiError.forbidden('You do not own this room');
  if (room.status === RoomStatus.LIVE) {
    throw ApiError.badRequest('Cannot delete a room that is currently live');
  }
  await tx.room.delete({ where: { room_key: roomKey } });
});
```

---

### 4. `updateRoom` — `rooms.service.ts`

**Invariant:** Room metadata should not be silently overwritten during a live stream (lower risk).

**Current code:**
```typescript
await getOwnedRoomOrThrow(roomKey, hostId);
const updated = await prisma.room.update({ ... });
```

**Race window:** Minimal — updating title/description during a live stream is unlikely to cause data corruption. This is the **lowest priority** of all four.

**Impact:** Cosmetic — viewers might see stale metadata. No data integrity violation.

**Recommendation:** No fix needed. If desired, add a `status !== LIVE` guard for certain fields.

---

## Recommended Implementation Strategy

### When to Implement
- **Phase 5 (Optimization & Hardening)** or before production deployment

### Approach: Interactive Transactions Consistently

Replace all state-dependent operations with interactive transactions (`$transaction(async (tx) => {...})`):

```typescript
// Pattern: Atomic conditional update + action
await prisma.$transaction(async (tx) => {
  // 1. Conditional update (acquires row lock, returns count)
  const result = await tx.room.updateMany({
    where: { room_key: roomKey, status: expectedStatus },
    data: { status: newStatus },
  });
  
  // 2. Check if the transition succeeded
  if (result.count === 0) throw ApiError.badRequest('Invalid state transition');
  
  // 3. Perform dependent writes
  return tx.streamSession.create({ ... });
});
```

### Key Principle: `updateMany` with a `WHERE` Clause

The `updateMany` with a conditional `WHERE` is the critical technique. At the PostgreSQL level, this acquires a **row-level lock** during the update. Only one transaction can modify the row. The loser gets `count: 0` and knows to abort.

This is more reliable than `SELECT ... FOR UPDATE` (which Prisma doesn't expose directly) and works within Prisma's API surface.

### Refactoring `getOwnedRoomOrThrow`

The shared helper needs to accept a transaction client:

```typescript
// Before — only works outside transactions
async function getOwnedRoomOrThrow(roomKey: string, hostId: number) {
  const room = await prisma.room.findUnique({ where: { room_key: roomKey } });
  // ...
}

// After — works with any Prisma client (regular or transactional)
import type { PrismaClient } from '@prisma/client';

type TransactionClient = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

async function getOwnedRoomOrThrow(
  client: TransactionClient | PrismaClient,
  roomKey: string,
  hostId: number,
) {
  const room = await client.room.findUnique({ where: { room_key: roomKey } });
  // ...
}
```

This preserves code reuse while supporting both regular and transactional contexts.

---

## MVP Mitigation (Current)

Until the interactive transaction pattern is implemented:

1. **UI-side debounce:** Disable the "Go Live" and "End Stream" buttons immediately on click (handled by `useFormStatus` / `isPending` state)
2. **Single-host design:** Only one person has access to the broadcast controls, making concurrent requests extremely unlikely
3. **Idempotency tolerance:** Even if a duplicate session is created, `endStream` closes the most recent one. The orphaned session has no functional impact beyond a stale DB row

These mitigations are sufficient for MVP. The interactive transaction hardening should be applied before scaling to production.

---

## Priority Matrix

| Operation | Risk Level | Practical Likelihood | Fix Priority |
|-----------|-----------|---------------------|-------------|
| `startStream` | 🔴 High (duplicate sessions) | Low (single host) | P2 |
| `endStream` | 🟡 Medium (double-close) | Low (single host) | P2 |
| `deleteRoom` | 🟡 Medium (delete while LIVE) | Very low (different UI flows) | P3 |
| `updateRoom` | 🟢 Low (cosmetic only) | Very low | P4 |
