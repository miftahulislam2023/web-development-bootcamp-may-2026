"use client";
import "./Editor.css";
import useEditor from "@/hooks/useEditor";
import { EditorContent } from "@tiptap/react";
import Controls from "./Controls";
import Header from "./Header";
import { Doc } from "@/types/doc";
import Loader from "../ui/Loader";


export default function Editor({ roomName, doc }: { roomName: string, doc: Doc }) {

    const { editor, provider } = useEditor({ roomName, doc });

    if (!provider || !editor) return <Loader />;

    return (
        <div className="editor-container lg:mx-0 mx-4 mt-5 mb-2 px-1 md:px-0">
            <Header title={doc?.name!} docId={roomName} permissions={doc?.permissions!} isAuthor={doc?.isAuthor!} author={doc?.author!} />
            <Controls editor={editor} />
            <div className="h-[calc(100vh-180px)] overflow-y-auto editor-content-wrapper">
                <EditorContent editor={editor} className="editor-content" />
            </div>
        </div>
    );
}