import { addPermission, userSearch } from "@/api/docPermission";
import { useState } from "react";
import { toast } from "sonner";

type User = {
    id: string;
    name: string;
    email: string;
    isAdded: boolean;
    permission?: object;
}

const useAddPermission = ({ docId, handleUpdatePermissions }: { docId: string, handleUpdatePermissions: () => void }) => {
    const [input, setInput] = useState("");
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);

        if (!value) return setUsers([]);
        const users = await userSearch(value, docId);
        setUsers(users);
    }

    const handleAddUser = () => {
        setIsAddUserOpen(!isAddUserOpen);
    }

    const handleAddPermission = async (userId: string) => {
        setUsers((prev) => prev.map((user: any) => {
            if (user.id === userId) {
                return { ...user, isAdded: true };
            }
            return user;
        }));
        try {
            await addPermission(docId, userId);
            handleUpdatePermissions();
            toast.success("Permission added successfully");
        } catch (error: any) {
            toast.error(error?.response.data.msg)
        }
    }

    return {
        input,
        isAddUserOpen,
        users,
        handleSearch,
        handleAddUser,
        handleAddPermission,
    }
}

export default useAddPermission