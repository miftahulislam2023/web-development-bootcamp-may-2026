import type { Server } from 'http';
import crossws from 'crossws/adapters/node'
import type { WebSocketLike } from '@hocuspocus/server'
import hocuspocus from '../hocuspocus/index.js';

async function startServer(server: Server, PORT: number) {
    const ws = crossws({
        hooks: {
            open(peer) {
                const connection = hocuspocus.handleConnection(
                    peer.websocket as unknown as WebSocketLike,
                    peer.request as Request,
                    {
                        userId: '123',
                    },
                )

                    ; (peer as any)._hocus = connection
            },

            message(peer, message) {
                ; (peer as any)._hocus?.handleMessage(
                    message.uint8Array(),
                )
            },

            close(peer, event) {
                ; (peer as any)._hocus?.handleClose({
                    code: event.code,
                    reason: event.reason,
                })
            },

            error(peer, error) {
                console.error(error)
            },
        },
    })

    server.on('upgrade', (req, socket, head) => {
        ws.handleUpgrade(req, socket, head)
    })


    server.listen(PORT, () => {
        console.log(`🚀 Server is running on PORT ${PORT}`);
    });

}

export default startServer;