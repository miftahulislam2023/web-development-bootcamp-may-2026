"use client"

import { useAppData, User } from '@/context/AppContext'
import { useRouter } from 'next/dist/client/components/navigation';
import React, { useEffect } from 'react'
import { useState } from 'react';
import ChatSidebar from '@/components/ChatSidebar';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';
import { chat_service } from '@/context/AppContext';
import ChatHeader from '@/components/ChatHeader';
import ChatMessages from '@/components/ChatMessages';
import MessageInput from '@/components/MessageInput';
import Loading from '@/components/Loading';
import { SocketData } from '@/context/SocketContext';


export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  file?: {
    url: string;
    publicId: string;
    name: string;
    size: number;
    type: string;
  };
  messageType: 'text' | 'image' | 'file';
  seen: boolean;
  seenAt?: string;
  deleted?: boolean;
  edited?: boolean;
  reactions?: { userId: string; emoji: string }[];
  createdAt: string;
}


const ChatApp = () => {

  const { loading, isAuth, logoutUser, chats, user: loggedInUser,
    users, fetchChats, setChats } = useAppData();

  const { onlineUsers, typingUsers, socket, newMessage, seenData, deletedMessage, editedMessage, reactedMessage } = SocketData()

  console.log(onlineUsers);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messageCache, setMessageCache] = useState<Record<string, Message[]>>({});
  const [userCache, setUserCache] = useState<Record<string, User>>({});
  const messages = selectedUser ? (messageCache[selectedUser] ?? null) : null;
  const [user, setUser] = useState<User | null>(null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  const isTyping = typingUsers.includes(user?._id ?? "");

  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuth) {
      router.push('/login')
    }
  }, [isAuth, loading, router]);

  useEffect(() => {
    if (!selectedUser) return;
    fetchChat();
    markAsSeen();
    setChats(prev =>
      prev ? prev.map(c => c.chat._id === selectedUser ? { ...c, chat: { ...c.chat, unseenCount: 0 } } : c) : prev
    );
  }, [selectedUser]);

  useEffect(() => {
    if (!newMessage) return;

    if (newMessage.chatId === selectedUser) {
      setMessageCache(prev => {
        const current = prev[newMessage.chatId] || [];
        const exists = current.some(msg => msg._id === newMessage._id);
        return exists ? prev : { ...prev, [newMessage.chatId]: [...current, newMessage] };
      });
      // Both users are in the same chat — trigger seen immediately
      markAsSeen();
    }

    setChats(prev => {
      if (!prev) return prev;
      return prev.map(c => {
        if (c.chat._id !== newMessage.chatId) return c;
        const isOpen = newMessage.chatId === selectedUser;
        return {
          ...c,
          chat: {
            ...c.chat,
            latestMessage: { text: newMessage.text || "Sent an image", sender: newMessage.sender },
            unseenCount: isOpen ? 0 : (c.chat.unseenCount || 0) + 1,
          },
        };
      });
    });
  }, [newMessage]);

  useEffect(() => {
    if (!seenData) return;
    if (seenData.chatId !== selectedUser) return;
    setMessageCache(prev => {
      const current = prev[seenData.chatId] || [];
      return { ...prev, [seenData.chatId]: current.map(msg => ({ ...msg, seen: true, seenAt: msg.seenAt ?? new Date().toISOString() })) };
    });
  }, [seenData]);

  useEffect(() => {
    if (!deletedMessage) return;
    if (deletedMessage.chatId.toString() !== selectedUser) return;
    setMessageCache(prev => {
      const current = prev[deletedMessage.chatId] || [];
      return { ...prev, [deletedMessage.chatId]: current.map(msg => msg._id === deletedMessage.messageId ? { ...msg, deleted: true } : msg) };
    });
  }, [deletedMessage]);

  useEffect(() => {
    if (!editedMessage) return;
    if (editedMessage.chatId.toString() !== selectedUser) return;
    setMessageCache(prev => {
      const current = prev[editedMessage.chatId] || [];
      return { ...prev, [editedMessage.chatId]: current.map(msg => msg._id === editedMessage.messageId ? { ...msg, text: editedMessage.text, edited: true } : msg) };
    });
  }, [editedMessage]);

  useEffect(() => {
    if (!reactedMessage) return;
    if (reactedMessage.chatId.toString() !== selectedUser) return;
    setMessageCache(prev => {
      const current = prev[reactedMessage.chatId] || [];
      return { ...prev, [reactedMessage.chatId]: current.map(msg => msg._id === reactedMessage.messageId ? { ...msg, reactions: reactedMessage.reactions } : msg) };
    });
  }, [reactedMessage]);

  const handleReactToMessage = async (messageId: string, emoji: string) => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.patch(`${chat_service}/api/v1/message/${messageId}/react`, { emoji }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessageCache(prev => {
        if (!selectedUser) return prev;
        return { ...prev, [selectedUser]: (prev[selectedUser] || []).map(msg => msg._id === messageId ? { ...msg, reactions: data.reactions } : msg) };
      });
    } catch {
      toast.error("Failed to react to message");
    }
  };

  const handleDeleteMessage = async (messageId: string, deleteFor: "me" | "everyone") => {
    const token = Cookies.get("token");
    try {
      await axios.delete(`${chat_service}/api/v1/message/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { deleteFor },
      });
      if (deleteFor === "me") {
        setMessageCache(prev => {
          if (!selectedUser) return prev;
          return { ...prev, [selectedUser]: (prev[selectedUser] || []).filter(msg => msg._id !== messageId) };
        });
      } else {
        setMessageCache(prev => {
          if (!selectedUser) return prev;
          return { ...prev, [selectedUser]: (prev[selectedUser] || []).map(msg => msg._id === messageId ? { ...msg, deleted: true } : msg) };
        });
      }
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleEditMessage = async (messageId: string, text: string) => {
    const token = Cookies.get("token");
    try {
      await axios.patch(`${chat_service}/api/v1/message/${messageId}`, { text }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessageCache(prev => {
        if (!selectedUser) return prev;
        return { ...prev, [selectedUser]: (prev[selectedUser] || []).map(msg => msg._id === messageId ? { ...msg, text, edited: true } : msg) };
      });
    } catch (error) {
      toast.error("Failed to edit message");
    }
  };

  const handleEditStart = (msg: Message) => {
    setEditingMessage(msg);
    setMessage(msg.text || "");
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessage("");
  };

  if (loading) return <Loading />

  const handleLogOut = () => {
    logoutUser();
    router.push('/login');
  }

  async function markAsSeen() {
    if (!selectedUser) return;
    const token = Cookies.get("token");
    try {
      await axios.get(`${chat_service}/api/v1/message/${selectedUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchChat() {
    if (!selectedUser) return;
    if (messageCache[selectedUser]) {
      setUser(userCache[selectedUser] ?? null);
      return;
    }
    const token = Cookies.get("token")
    try {
      const { data } = await axios.get(`${chat_service}/api/v1/message/${selectedUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessageCache(prev => ({ ...prev, [selectedUser]: data.messages }));
      setUserCache(prev => ({ ...prev, [selectedUser]: data.user }));
      setUser(data.user);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load messages");
    }
  }

  const handleMessageSend = async (e: any, imageFile?: File | null) => {
    e.preventDefault()
    if (!message.trim() && !imageFile) return;
    if (!selectedUser) return;

    const token = Cookies.get("token")

    // Edit mode
    if (editingMessage) {
      try {
        await axios.patch(`${chat_service}/api/v1/message/${editingMessage._id}`, { text: message.trim() }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessageCache(prev => {
          const current = prev[selectedUser] || [];
          return { ...prev, [selectedUser]: current.map(msg => msg._id === editingMessage._id ? { ...msg, text: message.trim(), edited: true } : msg) };
        });
        setEditingMessage(null);
        setMessage("");
      } catch (error) {
        toast.error("Failed to edit message");
      }
      return;
    }

    try {
      const formData = new FormData()
      formData.append("chatId", selectedUser)
      if (message.trim()) formData.append("text", message)
      if (imageFile) formData.append("image", imageFile)

      const { data } = await axios.post(`${chat_service}/api/v1/message`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessageCache(prev => {
        const current = prev[selectedUser] || [];
        const exists = current.some(msg => msg._id === data.message._id);
        return exists ? prev : { ...prev, [selectedUser]: [...current, data.message] };
      });

      setMessage("");
      await fetchChats();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  }

  async function createChat(u: User) {
    try {
      const token = Cookies.get("token")
      const { data } = await axios.post(`${chat_service}/api/v1/chat/new`,
        { userId: loggedInUser?._id, otherUserId: u._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedUser(data.chatId);
      setShowAllUser(false);
      await fetchChats();
    } catch (error: any) {
      const existingChatId = error?.response?.data?.chatId;
      if (existingChatId) {
        setSelectedUser(existingChatId);
        setShowAllUser(false);
      } else {
        toast.error("Failed to start chat");
      }
    }
  }

  async function handleDeleteChat(chatId: string) {
    const token = Cookies.get("token");
    try {
      await axios.delete(`${chat_service}/api/v1/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(prev => prev ? prev.filter(chat => chat.chat._id !== chatId) : null);
      setSelectedUser(null);
      setMessageCache(prev => {
        const newCache = { ...prev };
        delete newCache[chatId];
        return newCache;
      });
      setUserCache(prev => {
        const newCache = { ...prev };
        delete newCache[chatId];
        return newCache;
      });
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete chat");
    }
  }

  return (
    <div className='h-dvh flex bg-slate-950 text-white overflow-hidden'>
      {/* Mobile + Tablet: sidebar shown when no user selected */}
      <div className={`lg:hidden fixed inset-0 z-20 bg-slate-900 transition-transform duration-300 ${selectedUser ? '-translate-x-full' : 'translate-x-0'}`}>
        <ChatSidebar
          sidebarOpen={true}
          setSidebarOpen={() => {}}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setShowAllUser={setShowAllUser}
          showAllUser={showAllUser}
          users={users}
          chats={chats}
          loggedInUser={loggedInUser}
          handleLogOut={handleLogOut}
          createChat={createChat}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <ChatSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setShowAllUser={setShowAllUser}
          showAllUser={showAllUser}
          users={users}
          chats={chats}
          loggedInUser={loggedInUser}
          handleLogOut={handleLogOut}
          createChat={createChat}
          onlineUsers={onlineUsers}
        />
      </div>

      <div className={`lg:ml-80 flex-1 flex flex-col h-dvh overflow-hidden bg-slate-950 ${!selectedUser ? 'hidden lg:flex' : 'flex'}`}>
        {selectedUser ? (
          <>
            <ChatHeader selectedUser={selectedUser} user={user} setSidebarOpen={setSidebarOpen} isTyping={isTyping} onlineUsers={onlineUsers} onBack={() => setSelectedUser(null)} onDeleteChat={handleDeleteChat} />
            <ChatMessages selectedUser={selectedUser} messages={messages} loggedInUser={loggedInUser} onDeleteMessage={handleDeleteMessage} onEditStart={handleEditStart} onReact={handleReactToMessage} />
            <MessageInput selectedUser={selectedUser} message={message} setMessage={setMessage} handleMessageSend={handleMessageSend}
              onTyping={() => socket?.emit("typing", user?._id)}
              onStopTyping={() => socket?.emit("stopTyping", user?._id)}
              editingMessage={editingMessage}
              onCancelEdit={handleCancelEdit}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
            <div className="p-5 bg-slate-800/50 rounded-2xl border border-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Welcome to Alapon</h2>
              <p className="text-sm text-slate-500">Select a conversation or start a new chat.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatApp
