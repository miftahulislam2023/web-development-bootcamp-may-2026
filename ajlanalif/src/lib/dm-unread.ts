const UNREAD_STORAGE_KEY = "realtime-unread-counts-v1";
const LEGACY_DM_UNREAD_STORAGE_KEY = "dm-unread-counts-v1";
export type UnreadCounts = Record<string, number>;
export type RealtimeUnreadState = {
  dm: UnreadCounts;
  rooms: UnreadCounts;
};
function sanitizeCounts(value: unknown): UnreadCounts {
  if (!value || typeof value !== "object") return {};
  const next: UnreadCounts = {};
  for (const [entryId, entryValue] of Object.entries(value as Record<string, unknown>)) {
    const count = Number(entryValue);
    if (Number.isFinite(count) && count > 0) next[entryId] = Math.trunc(count);
  }
  return next;
}
function readStoredUnreadState(): RealtimeUnreadState {
  if (typeof window === "undefined") return { dm: {}, rooms: {} };
  const raw = window.localStorage.getItem(UNREAD_STORAGE_KEY);
  if (!raw) {
    const legacyRaw = window.localStorage.getItem(LEGACY_DM_UNREAD_STORAGE_KEY);
    if (!legacyRaw) return { dm: {}, rooms: {} };
    try {
      return { dm: sanitizeCounts(JSON.parse(legacyRaw)), rooms: {} };
    } catch { return { dm: {}, rooms: {} }; }
  }
  try {
    const parsed = JSON.parse(raw) as Partial<RealtimeUnreadState>;
    return { dm: sanitizeCounts(parsed.dm), rooms: sanitizeCounts(parsed.rooms) };
  } catch { return { dm: {}, rooms: {} }; }
}
export function readRealtimeUnreadState(): RealtimeUnreadState { return readStoredUnreadState(); }
function writeStoredUnreadState(state: RealtimeUnreadState) {
  if (typeof window !== "undefined") window.localStorage.setItem(UNREAD_STORAGE_KEY, JSON.stringify(state));
}
export function writeRealtimeUnreadState(state: RealtimeUnreadState) { writeStoredUnreadState(state); }
export function readDmUnreadCounts(): UnreadCounts { return readStoredUnreadState().dm; }
export function readRoomUnreadCounts(): UnreadCounts { return readStoredUnreadState().rooms; }
export function writeDmUnreadCounts(counts: UnreadCounts) { writeStoredUnreadState({ ...readStoredUnreadState(), dm: counts }); }
export function writeRoomUnreadCounts(counts: UnreadCounts) { writeStoredUnreadState({ ...readStoredUnreadState(), rooms: counts }); }
function bumpUnreadCount(key: "dm" | "rooms", entryId: string): UnreadCounts {
  const state = readStoredUnreadState();
  const next = { ...state[key], [entryId]: (state[key][entryId] ?? 0) + 1 };
  writeStoredUnreadState({ ...state, [key]: next });

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("Unread incremented", key, entryId, next[entryId]);
  }

  return next;
}
function clearUnreadCount(key: "dm" | "rooms", entryId: string): UnreadCounts {
  const state = readStoredUnreadState();
  if (!(entryId in state[key])) return state[key];
  const { [entryId]: _removed, ...next } = state[key];
  writeStoredUnreadState({ ...state, [key]: next });
  return next;
}
export function bumpDmUnreadCount(id: string) { return bumpUnreadCount("dm", id); }
export function clearDmUnreadCount(id: string) { return clearUnreadCount("dm", id); }
export function bumpRoomUnreadCount(id: string) { return bumpUnreadCount("rooms", id); }
export function clearRoomUnreadCount(id: string) { return clearUnreadCount("rooms", id); }
export function getTotalUnreadCount(state = readRealtimeUnreadState()) {
  return Object.values(state.dm).reduce((a, b) => a + b, 0) + Object.values(state.rooms).reduce((a, b) => a + b, 0);
}
