import { toast } from "sonner";
import axiosSecure from "../axios/axioshelper";

export const handleGoogleLogin = async (signInWithGoogle, setUserData, navigate) => {
    try {
        const res = await signInWithGoogle();

        if(!res)
            return;

        const user = res.user;
        const email = user.email;

        const token = await user.getIdToken(true);
        localStorage.setItem("access-token", token);

        const payload = {
            name: user.displayName,
            email,
            photoURL: user.photoURL,
            currency: "BDT"
        };

        try {
            const response = await axiosSecure.post("/users", payload);

            if (response.data.success)
                setUserData(response.data.data);
        } catch (error) {
            const message = error?.response?.data?.message;

            if (message === "User already exists") {
                const existingUser = await axiosSecure.get("/users/me");

            if (existingUser.data.success) 
                setUserData(existingUser.data.data);
        } 
        else 
            throw error;
        }

        toast.success("Logged in with Google");

        navigate("/dashboard");

    } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
    }
}