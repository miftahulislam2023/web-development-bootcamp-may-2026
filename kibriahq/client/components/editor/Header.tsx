"use client"

import AddUser from "./AddUser";
import Avatars from "./ui/Avatars";
import useEditorHeader from "@/hooks/useEditorHeader";
import { DocAuthor, Permission } from "@/types/doc";
import Title from "./ui/Title";


function Header({ title, docId, permissions, isAuthor, author }: { title: string, docId: string, permissions: Permission[], isAuthor: boolean, author: DocAuthor }) {
    const {
        isEdit,
        setIsEdit,
        input,
        setInput,
        perms,
        handleUpdateTitle,
        handleDeleteDoc,
        handleRemovePermission,
        handleUpdatePermissions,
    } = useEditorHeader(title, docId, permissions);

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start">
            <Title
                isAuthor={isAuthor}
                isEdit={isEdit}
                input={input}
                setInput={setInput}
                setIsEdit={setIsEdit}
                handleUpdateTitle={handleUpdateTitle}
                handleDeleteDoc={handleDeleteDoc}
            />

            <div className="flex items-center gap-2">
                <Avatars
                    permissions={perms}
                    handleRemovePermission={handleRemovePermission}
                    isAuthor={isAuthor}
                    author={author}
                />

                {isAuthor && (
                    <AddUser docId={docId} handleUpdatePermissions={handleUpdatePermissions} />
                )}
            </div>
        </div >
    )
}

export default Header