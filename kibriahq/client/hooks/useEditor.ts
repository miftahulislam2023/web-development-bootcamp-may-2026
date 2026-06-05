import { useEffect, useMemo, useState } from "react";
import { useEditor as useTiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useStoreState } from "easy-peasy";
import { Store } from "@/store";
import { Doc } from "@/types/doc";
import { colorObjects, ColorName } from "@/utils/colors";

const useEditor = ({ roomName, doc }: { roomName: string, doc: Doc }) => {
    const ydoc = useMemo(() => new Y.Doc(), []);
    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

    const { user } = useStoreState((state: Store) => state.auth);

    useEffect(() => {
        const hocusProvider = new HocuspocusProvider({
            url: process.env.NEXT_PUBLIC_HOCUSPOCUS_URL!,
            name: roomName,
            document: ydoc,
            onSynced() {
                // awareness is guaranteed to be ready after synced
                setProvider(hocusProvider);
            },
        });

        return () => {
            setProvider(null);
            hocusProvider.destroy();
        };
    }, [roomName, ydoc]);

    const editor = useTiptapEditor(
        {
            extensions: [
                StarterKit.configure({
                    undoRedo: false,
                }),
                Collaboration.configure({ document: ydoc }),
                ...(provider
                    ? [
                        CollaborationCursor.configure({
                            provider,
                            user: {
                                name: user.name,
                                color: colorObjects[user.color as ColorName] || colorObjects.blue,
                            },
                        }),
                    ]
                    : []),
                Highlight.configure({ multicolor: true }),
                TaskItem.configure({ nested: true }),
                TaskList,
                Table.configure({ resizable: true }),
                TableRow,
                TableCell,
                TableHeader,
                TextAlign.configure({ types: ["heading", "paragraph"] }),
                // Underline,
                Color,
                TextStyle,
                // Link.configure({ openOnClick: false }),
                Image,
            ],
            content: "",
            immediatelyRender: false,
        },
        [provider]
    );
    return {
        editor,
        provider,
        ydoc,
        doc,
        user,
    }
}

export default useEditor