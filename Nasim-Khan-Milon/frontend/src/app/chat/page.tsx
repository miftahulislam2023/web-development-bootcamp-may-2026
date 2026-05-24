"use client"

import Loading from '@/components/Loading';
import { chat_service, useAppData, User } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';
import ChatSidebar from '@/components/ChatSidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatMessages from '@/components/ChatMessages';
import MessageInput from '@/components/MessageInput';
import { SocketData } from '@/context/SocketContext';



export interface Message {
  id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string,
    publicId: string
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string;
  createdAt: string
}

const Page = () => {

  const { isAuth, loading, logOutUser, chats, user: loggedInUser, users, fetchChats, setChats } = useAppData();
  const { onlineUsers, socket } = SocketData();

  console.log(onlineUsers);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();



  useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/login");
    }
  }, [isAuth, loading, router])

  const handleLogout = () => logOutUser();

  const fetchChat = async () => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(`${chat_service}/api/chat/messages/${selectedUser}`, { headers: { Authorization: `Bearer ${token}` } });

      setMessages(data.messages)
      setUser(data.user.user);
      await fetchChats();
    } catch (error) {
      toast.error("Failed to load message");
      console.log(error);
    }
  }

  const moveChatToTop = (
    chatId: string,
    newMessage: any,
    updatedUnseenCount = true
  ) => {
    setChats((prev) => {
      if (!prev) return null;

      const updatedChats = [...prev];

      const chatIndex = updatedChats.findIndex(
        (chat) => chat.chat.id === chatId
      );

      if (chatIndex === -1) return updatedChats;

      const [movedChat] = updatedChats.splice(chatIndex, 1);

      const latestMessageText =
        newMessage.messageType === "image"
          ? "📷 Image"
          : newMessage.text || "";

      const updatedChat = {
        ...movedChat,
        chat: {
          ...movedChat.chat,
          latestMessage: {
            text: latestMessageText,
            sender: newMessage.sender,
          },
          updatedAt: new Date().toISOString(),
          unseenCount:
            updatedUnseenCount &&
              newMessage.sender !== loggedInUser?.id
              ? (movedChat.chat.unseenCount || 0) + 1
              : movedChat.chat.unseenCount || 0,
        },
      };

      updatedChats.unshift(updatedChat);

      return updatedChats;
    });
  };

  const resetUnseenCount = (chatId: string) => {
    setChats((prev) => {
      if (!prev) return null;

      return prev.map((chat) => {
        if (chat.chat.id === chatId) {
          return {
            ...chat,
            chat: {
              ...chat.chat,
              unseenCount: 0
            }
          }
        }
        return chat
      })
    })
  };

  const createChat = async (u: User) => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(`${chat_service}/api/chat/new`, { userId: loggedInUser?.id, otherUserId: u.id }, { headers: { Authorization: `Bearer ${token}` } });

      setSelectedUser(data.chatId);
      setShowAllUser(false);
      await fetchChats();
    } catch (error) {
      toast.error("Failed to start chat");
      console.log(error);
    }
  }

  const handleMessageSend = async (e: any, imageFile?: File | null) => {
    e.preventDefault();

    if (!message.trim() && !imageFile) return;
    if (!selectedUser) return;

    //socket work
    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
      setTypingTimeOut(null);
    }

    socket?.emit("stopTyping", {
      userId: loggedInUser?.id,
      chatId: selectedUser
    });

    const token = Cookies.get("token");

    try {
      const formData = new FormData();

      formData.append("chatId", selectedUser);

      if (message.trim()) {
        formData.append("text", message);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await axios.post(`${chat_service}/api/chat/message`, formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });

      setMessages((prev) => {
        const currentMessages = prev || [];
        const messageExists = currentMessages.some((msg) => msg.id === data.message.id);
        if (!messageExists) {
          return [...currentMessages, data.message];
        }
        return currentMessages;
      });

      setMessage("");

      const displayText = imageFile ? "Image sent" : message;
      // toast.success(displayText);
      moveChatToTop(
        selectedUser,
        { text: displayText, sender: data.sender },
        false
      )

    } catch (error: any) {
      if (error.response?.status === 400) {
        setSelectedUser(error.response.data.ChatId);
        setShowAllUser(false);
        return;
      }

      toast.error("Failed to start chat");
    }

  }

  const handleTyping = (value: string) => {
    setMessage(value)

    if (!selectedUser || !socket) return;

    //socket setup

    socket?.emit("typing", {
      userId: loggedInUser?.id,
      chatId: selectedUser
    });



    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
    }
    const timeout = setTimeout(() => {
      socket?.emit("stopTyping", {
        userId: loggedInUser?.id,
        chatId: selectedUser
      });
    }, 2000);
    setTypingTimeOut(timeout)
  }

  useEffect(() => {

    socket?.on("newMessage", (newMessage: any) => {
      console.log("received new message", newMessage);

      if (newMessage.chatId === selectedUser) {
        console.log("selectedUser", selectedUser);
        console.log("newMessage.chatId", newMessage.chatId);
        setMessages((prev) => {
          const currentMessages = prev || [];

          if (!newMessage?.id) {
            return currentMessages;
          }

          const messageExists = currentMessages.some(
            (msg) => msg?.id === newMessage.id
          );

          if (messageExists) {
            return currentMessages;
          }

          return [...currentMessages, newMessage];
        });

        if(newMessage.sender !== user?.id) {
          socket.emit(
                "markMessagesSeen",
                {
                    chatId:
                        newMessage.chatId,

                    userId: user?.id
                }
            );
        }

        moveChatToTop(newMessage.chatId, newMessage, false);
      } else {
        moveChatToTop(newMessage.chatId, newMessage, true);
      }


    });

    socket?.on("messagesSeen", (data: any) => {

    console.log("received messages seen", data);

    setMessages((prev) => {

        if (!prev) return prev;

        return prev.map((message) => {

            const shouldUpdate =
                data.messageIds?.includes(message.id);

            if (!shouldUpdate) {
                return message;
            }

            return {
                ...message,
                seen: true,
                seenAt: new Date().toISOString(),
            };
        });
    });
});

    socket?.on("typing", (data: any) => {
      console.log("received user typing", data);
      if (data.userId !== loggedInUser?.id && data.chatId === selectedUser) {
        setIsTyping(true);
      }
    });

    socket?.on("userStoppedTyping", (data: any) => {
      console.log("received user stopped typing", data);
      if (data.userId !== loggedInUser?.id && data.chatId === selectedUser) {
        setIsTyping(false);
      }
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("messagesSeen");
      socket?.off("typing");
      socket?.off("userStoppedTyping");
    }
  }, [socket, selectedUser, loggedInUser?.id, setChats]);

  useEffect(() => {
    if (selectedUser) {
      fetchChat();
      setIsTyping(false);

      resetUnseenCount(selectedUser);

      socket?.emit("joinChat", selectedUser);

      return () => {

        setMessages(null);
      }
    }
  }, [selectedUser]);

  useEffect(() => {
    return () => {
      if (typingTimeOut) {
        clearTimeout(typingTimeOut);
      }
    };
  }, [typingTimeOut]);

  if (loading) return <Loading />;

  return (
    <div className='min-h-screen flex bg-gray-900 text-white relative overflow-hidden'>
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showAllUsers={showAllUser}
        setShowAllUsers={setShowAllUser}
        users={users}
        loggedInUser={loggedInUser}
        chats={chats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleLogout={handleLogout}
        createChat={createChat}
        onlineUsers={onlineUsers}
      />

      <div className='flex-1 flex flex-col h-screen overflow-hidden justify-between p-4 backdrop-blur-xl bg-white/5 border border-white/10'>
        <ChatHeader user={user} setSidebarOpen={setSidebarOpen} isTyping={isTyping} onlineUsers={onlineUsers} />

        <ChatMessages selectedUser={selectedUser} messages={messages} loggedInUser={loggedInUser} />

        <MessageInput selectedUser={selectedUser} message={message} setMessage={handleTyping} handleMessageSend={handleMessageSend} />
      </div>
    </div>
  )
}

export default Page