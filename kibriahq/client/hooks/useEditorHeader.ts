import { deleteDoc, updateDocName } from "@/api/doc";
import { getAllPermissions, removePermission } from "@/api/docPermission";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Permission } from "@/types/doc";
import { toast } from "sonner";

const useEditorHeader = (title: string, docId: string, permissions: Permission[]) => {
    const [isEdit, setIsEdit] = useState(false);
    const [input, setInput] = useState(title);
    const [perms, setPerms] = useState(permissions);

    const router = useRouter();

    const handleUpdateTitle = async () => {
        try {
            await updateDocName(docId, input);
            setIsEdit(false);
            toast.success("Document name updated successfully");
        } catch (error: any) {
            toast.error(error?.response.data.msg)
        }
    }

    const handleDeleteDoc = async () => {
        if (confirm('Are you sure you want to delete this document?')) {
            try {
                await deleteDoc(docId);
                router.push('/');
                toast.success("Document deleted successfully");
            } catch (error: any) {
                toast.error(error?.response.data.msg)
            }
        }
    }

    const handleRemovePermission = async (id: string,) => {
        if (confirm("Are you sure you want to remove this permission?")) {
            try {
                await removePermission(id);
                setPerms(perms.filter((p: any) => p.id !== id));
                toast.success("Permission removed successfully");
            } catch (error: any) {
                toast.error(error?.response.data.msg)
            }
        }
    }

    const handleUpdatePermissions = async () => {
        setPerms(await getAllPermissions(docId));
    }

    return {
        isEdit,
        setIsEdit,
        input,
        setInput,
        perms,
        title,
        docId,
        permissions,
        handleUpdateTitle,
        handleDeleteDoc,
        handleRemovePermission,
        handleUpdatePermissions,
    }
}

export default useEditorHeader