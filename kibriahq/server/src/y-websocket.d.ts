declare module 'y-websocket/bin/utils' {
  import { WebSocket, IncomingMessage } from 'ws'
  export function setupWSConnection(
    ws: WebSocket,
    req: IncomingMessage,
    options?: {
      docName?: string
      gc?: boolean
    }
  ): void
}