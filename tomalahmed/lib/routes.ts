import { DEFAULT_LOBBY_ROOM_ID } from "./chat/constants";

/** Shared app paths — keep nav/footer in sync with routes */
export const ROUTES = {
  home: "/",
  /** Dedicated features page (same marketing layout as home) */
  features: "/features",
  /** In-page anchor on home (Powerful Features block) */
  featuresSection: "/#features",
  login: "/login",
  /** Chat hub: display name, then pick Global (see `chatGlobal`) */
  chat: "/chat",
  /** Pre-seeded public group room (realtime) */
  chatGlobal: `/chat/${DEFAULT_LOBBY_ROOM_ID}`,
} as const;
