/** Keep in sync with `supabase/migrations/*_chat_rooms_messages.sql` CHECK constraints. */
/** Seeded in `supabase/migrations/*_seed_public_lobby.sql` — shared group chat for all visitors. */
export const DEFAULT_LOBBY_ROOM_ID = "00000000-0000-4000-a000-000000000001" as const;

/** Display name for the seeded room (must match DB `rooms.title` after migrations). */
export const GLOBAL_ROOM_NAME = "Global" as const;

export const CHAT_DISPLAY_NAME_MAX = 40;
export const CHAT_MESSAGE_MAX = 2000;
export const CHAT_ROOM_TITLE_MAX = 200;

export const CHAT_DISPLAY_NAME_STORAGE_KEY = "crimson-chat-display-name";
