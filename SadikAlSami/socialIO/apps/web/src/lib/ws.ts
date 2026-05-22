/** WebSocket constants and helpers — lifecycle lives in ws-provider.tsx */

export const WS_HEARTBEAT_INTERVAL = 20_000; // 20s — matches server presence TTL (30s) with 10s buffer
export const WS_RECONNECT_DELAY = 3_000; // 3s fixed delay before reconnect

/**
 * Converts an HTTP base URL to a WebSocket URL with /ws path.
 * http://localhost:3000 → ws://localhost:3000/ws
 * https://api.example.com → wss://api.example.com/ws
 */
export function getWsUrl(baseUrl: string): string {
  return baseUrl.replace(/^http/, "ws") + "/ws";
}
