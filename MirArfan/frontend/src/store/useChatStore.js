import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create ((set, get)=>({
    allContacts:[],
    chats:[],
    messages:[],
    activeTab:"chats",
    selectedUser:null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled"))===true,

    
    toggleSound: ()=>{
        localStorage.setItem("isSoundEnabled",!get().isSoundEnabled)
        set({isSoundEnabled: !get().isSoundEnabled})
    },
    setActiveTab: (tab)=> set({activeTab: tab}),
    setSelectedUser: (selectedUser)=>set({selectedUser}),

    getAllContacts: async()=>{
        set({isUsersLoading: true});
        try {
            const res= await axiosInstance.get("/message/contacts");
            //console.log("All contacts : ", res.data);
            set({allContacts: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isUsersLoading: false});
        }
    },
    getMyChatPartners: async()=>{
        set({isUsersLoading: true});
        try {
            const res= await axiosInstance.get("/message/chats");
            set({chats: res.data});

        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isUsersLoading:false});
        }
    },
    getMessagesByUserId: async (userId)=>{
        set({isMessagesLoading: true});
        try {
            const res= await axiosInstance.get(`/message/${userId}`);
            set({messages: res.data});
        } catch (error) {
             toast.error(error.response?.data?.message || "Someting went wrong");
        } finally{
            set({isMessagesLoading: false});
        }
    },
    sendMessage: async(messageData)=>{
        const {selectedUser, messages}= get();

        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages (optional)
        };

        // immidetaly update the ui by adding the message
        set({ messages: [...messages, optimisticMessage] });
    
        try {
            const res= await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages: messages.concat(res.data)});
        } catch (error) {
            set({messages: messages}) //for failure message to remove
            toast.error(error.response?.data?.message || "Someting went wrong");
        }
    },
    subscribeToMessages: ()=>{
        const {selectedUser, isSoundEnabled}= get();
        if(!selectedUser) return;

        const socket= useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage)=>{
            const isMessageSendFromSelectedUser= newMessage.senderId===selectedUser._id;
            if(!isMessageSendFromSelectedUser) return;

            
            const currentMessage= get().messages;
            set({messages: [...currentMessage, newMessage]});

            if(isSoundEnabled){
                const notificationSound= new Audio("/sounds/notification.mp3");
                notificationSound.currentTime=0;
                notificationSound.play().catch((e)=>console.log("Audio play failed:", e));
            }
        })
    },
    unsubscribeFromMessages: ()=>{
        const socket= useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}))