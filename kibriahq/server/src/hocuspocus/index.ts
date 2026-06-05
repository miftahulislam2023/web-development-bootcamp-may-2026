import { Hocuspocus } from "@hocuspocus/server";
import * as Y from "yjs";
import { prisma } from "../lib/prisma.js";

const hocuspocus = new Hocuspocus({

    async onLoadDocument({ documentName }: { documentName: string }) {
        // load state
        const data = await prisma.doc.findUnique({
            where: {
                id: documentName
            }
        });

        // Guard: skip if null, undefined, or empty buffer
        if (!data || !data.body || data.body.length === 0) {
            return null;
        }

        const ydoc = new Y.Doc();
        Y.applyUpdate(ydoc, new Uint8Array(data.body)); // Buffer → Uint8Array
        return ydoc;
    },

    async onStoreDocument({ documentName, document }: { documentName: string, document: Y.Doc }) {
        // document is Y.Doc instance
        const state = Y.encodeStateAsUpdate(document);

        await prisma.doc.update({
            where: {
                id: documentName
            },
            data: {
                body: Buffer.from(state)
            }
        });
    },
});

export default hocuspocus;