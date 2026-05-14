import { toast } from "sonner";
import axiosSecure from "../axios/axioshelper.js";

export const fetchUserData = async (currentUser) => {
    try {
        if(!currentUser)
            return null;

        const res= await axiosSecure.get("/users/me");

        if(res.data.success)
            return res.data.data;
        else{
            toast.error(res.data.message);
            return null;
        }
    } catch (error) {
        return null;
    }
};