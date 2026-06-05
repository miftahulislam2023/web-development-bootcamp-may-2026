import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { getProfile, updateProfile } from "@/api/user"
import { toast } from "sonner"
import { useStoreActions } from "easy-peasy"
import { useRouter } from 'next/navigation'
import { removeToken } from "@/utils/token"
import type { Profile } from "@/types/user";

const useProfile = () => {
    const [profile, setProfile] = useState<Profile>({ name: "", email: "", color: "" })
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const logout = useStoreActions((state: any) => state.auth.logout);
    const router = useRouter();

    const { register, handleSubmit, watch, reset, setError, formState: { errors } } = useForm<Profile>({ defaultValues: profile });

    const color = watch("color");

    const { setUser } = useStoreActions((state: any) => state.auth);

    useEffect(() => {
        setProfile((prev) => ({
            name: watch("name") || prev.name,
            email: watch("email") || prev.email,
            color,
            currentPassword: watch("currentPassword") || prev.currentPassword,
            newPassword: watch("newPassword") || prev.newPassword,
            confirmNewPassword: watch("confirmNewPassword") || prev.confirmNewPassword
        }));
    }, [color]);



    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setProfile({
                    name: data.name || "",
                    email: data.email || "",
                    color: data.color || "amber",
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: ""
                });
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        reset(profile);
    }, [profile]);

    const submitProfile: SubmitHandler<Profile> = async (data) => {
        setIsSaving(true);
        
        try {
            await updateProfile(data);
            setProfile(data);
            toast.success("Profile updated successfully!")
            setIsEditing(false)
            setUser(data);
        } catch (error: any) {
            const serverErrors = error?.response?.data?.errors;
            if (serverErrors) {
                Object.entries(serverErrors).forEach(([path, value]: [string, any]) => {
                    setError(path as keyof Profile, {
                        type: "server",
                        message: value.msg
                    })
                })
            }
        } finally {
            setIsSaving(false)
        }
    }


    const handleLogout = () => {
        logout();
        removeToken();
        toast.success("Logout successful");
        router.push('/login');
    }
    return {
        profile,
        isEditing,
        isSaving,
        register,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: { errors },
        submitProfile,
        handleLogout,
        setIsEditing
    }
}

export default useProfile