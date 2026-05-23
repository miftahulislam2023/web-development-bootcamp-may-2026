"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Toaster } from 'react-hot-toast';
import toast from "react-hot-toast";



export const user_service = process.env.NEXT_PUBLIC_USER_SERVICE || "http://localhost:5000";
export const chat_service = process.env.NEXT_PUBLIC_CHAT_SERVICE || "http://localhost:5002";

export interface User{
    _id:string;
    name:string;
    email:string;
    avatar?: { url: string; publicId: string };
    isInvisible?: boolean;
}

export interface Chats{
    _id:string;
    user: User;
    chat: {
        _id:string;
        users:User[];
        latestMessage:{
            text:string;
            sender:string;
        } | null;
        createdAt: string;
        updatedAt: string;
        unseenCount?: number;
    };
}

interface AppContextType{
    user: User | null;
    loading: boolean;
    isAuth: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    logoutUser: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    fetchChats: () => Promise<void>;
    chats: Chats[] | null;
    users: User[] | null;
    setChats: React.Dispatch<React.SetStateAction<Chats[] | null>>;
    removeChat: (chatId: string) => Promise<void>;
    updateProfile: (formData: FormData) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps{
    children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
    const [user,setUser] = useState<User | null>(null);
    const [isAuth,setIsAuth] = useState(false);
    const [loading,setLoading] = useState(true);

    async function fetchUser(){
        try {
            const token = Cookies.get("token")
            if(!token) { setLoading(false); return; }

            const {data} = await axios.get(`${user_service}/api/v1/me`,{
                headers:{
                    "Authorization": `Bearer ${token}`,
                }
            });

            setUser(data);
            setIsAuth(true);
            setLoading(false);
            
        } catch (error) {
            console.log(error);
            setLoading(false);

            
        }
    }

    async function logoutUser() {
        Cookies.remove("token");
        setUser(null);
        setIsAuth(false);
        toast.success("Logged out successfully");
    }
    const [chats, setChats] = useState<Chats[] | null>(null)
    async function fetchChats(){
        const token = Cookies.get("token");
        if(!token) return;
        try {
            const {data} = await axios.get(`${chat_service}/api/v1/chats/all`,{
                headers:{
                    "Authorization": `Bearer ${token}`,
                }
            });
            setChats(data.chats);
            
        } catch (error) {
            console.log(error);
            
        }
    }


    const [users, setUsers] = useState<User[] | null>(null)

    async function fetchUsers(){
        const token = Cookies.get("token")
        if(!token) return;
        try {
            const {data} = await axios.get(`${user_service}/api/v1/user/all`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function removeChat(chatId: string) {
        const token = Cookies.get("token");
        try {
            await axios.delete(`${chat_service}/api/v1/chat/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChats(prev => prev ? prev.filter(chat => chat.chat._id !== chatId) : null);
            toast.success("Chat removed successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to remove chat");
        }
    }

    async function updateProfile(formData: FormData) {
        const token = Cookies.get("token");
        try {
            const { data } = await axios.put(`${user_service}/api/v1/user/update`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Cookies.set("token", data.token);
            setUser(data.user);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile");
        }
    }
    

    useEffect(() =>{
        fetchUser();
        fetchChats();
        fetchUsers();
    },[])

    return(
        <AppContext.Provider value={{user,loading,isAuth,setUser,setIsAuth, logoutUser, fetchChats, fetchUsers, chats, users, setChats, removeChat, updateProfile}}>
            {children}
            <Toaster/>
        </AppContext.Provider>
    )
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if(context === undefined){
        throw new Error("useAppData must be used within an AppProvider");
    }
    return context;
};