"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getPusherClient } from "@/lib/pusher-client";
import Sidebar from "@/components/layout/Sidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
// import CallModal from "@/components/chat/CallModal";
import SettingsDropdown from "@/components/layout/SettingsDropdown";
import Navbar from "@/components/navigation/Navbar";
import ProfileView from "@/components/profile/ProfileView";
import SplashLoader from "@/components/layout/SplashLoader";
import LogoutModal from "@/components/layout/LogoutModal";

export default function Home() {
  const { user, loading: authLoading, logout, updateUser } = useAuth();
  const router = useRouter();

  const [selectedConvo, setSelectedConvo] = useState(null); // { id, other }
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({}); // { [convoId]: [...] }
  // const [isCalling, setIsCalling] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chats");
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [blockedUsers, setBlockedUsers] = useState({}); // { [userId]: true }
  const [unreadDivider, setUnreadDivider] = useState(null); // { convoId, count } — shown until dismissed
  const typingTimers = useRef({});
  const unreadDividerTimer = useRef(null);
  const selectedConvoRef = useRef(null);

  // Keep ref in sync with state so socket handlers always see latest value
  useEffect(() => {
    selectedConvoRef.current = selectedConvo;
  }, [selectedConvo]);

  const token = typeof window !== "undefined" ? localStorage.getItem("chat_token") : null;

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("chat_theme");
    if (savedTheme) setIsDarkMode(savedTheme === "dark");
  }, []);

  // Load cached messages on mount
  useEffect(() => {
    if (user) {
      try {
        const cached = localStorage.getItem(`chat_messages_${user.id}`);
        if (cached) {
          setMessages(JSON.parse(cached));
        }
      } catch (err) {}
    }
  }, [user]);

  // Save messages to cache whenever they change
  useEffect(() => {
    if (user && Object.keys(messages).length > 0) {
      try {
        const toCache = {};
        Object.keys(messages).forEach(convoId => {
          toCache[convoId] = messages[convoId].slice(-50); // Keep last 50
        });
        localStorage.setItem(`chat_messages_${user.id}`, JSON.stringify(toCache));
      } catch (err) {}
    }
  }, [messages, user]);

  // Load blocks on mount — depends on user so it re-runs after auth resolves
  useEffect(() => {
    if (!user || !token) return;
    fetch("/api/users/block", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.blockedIds) {
          const map = {};
          data.blockedIds.forEach((id) => { map[id] = true; });
          setBlockedUsers(map);
        }
      })
      .catch(() => {});
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBlock = async (userId) => {
    setBlockedUsers((prev) => ({ ...prev, [userId]: true }));
    await fetch("/api/users/block", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId }),
    }).catch(() => {});
  };

  const handleUnblock = async (userId) => {
    setBlockedUsers((prev) => { const n = { ...prev }; delete n[userId]; return n; });

    await fetch("/api/users/block", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId }),
    }).catch(() => {});
  };

  const fetchConversations = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.conversations) setConversations(data.conversations);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  // Initial load — fetch conversations then compute unread counts from localStorage
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/conversations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.conversations) return;
        setConversations(data.conversations);

        // Read last-seen timestamps from localStorage
        // Format: { [convoId]: ISO timestamp of last message the user saw }
        const lastSeen = JSON.parse(localStorage.getItem(`last_seen_${user.id}`) || "{}");

        const counts = {};
        data.conversations.forEach((c) => {
          const lastMsg = c.lastMessage;
          if (!lastMsg) return;
          // Only count as unread if the last message was sent by the OTHER person
          if (lastMsg.senderId === user.id) return;
          const seenAt = lastSeen[c.id];
          // If we've never seen this convo, or the last message is newer than what we last saw
          if (!seenAt || new Date(lastMsg.createdAt) > new Date(seenAt)) {
            counts[c.id] = 1; // at least 1 unread — we don't store exact count offline
          }
        });
        setUnreadCounts(counts);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pusher setup
  useEffect(() => {
    if (!user) return;
    const pusher = getPusherClient();
    if (!pusher) return;

    // Global channel for user-specific events (new messages, status, etc.)
    const userChannel = pusher.subscribe(`user_${user.id}`);

    userChannel.bind("message:new", (msg) => {
      // Skip if sender is us — already added optimistically in handleSend
      if (msg.senderId === user.id) return;
      setMessages((prev) => {
        const convoMsgs = prev[msg.conversationId] || [];
        if (convoMsgs.find((m) => m.id === msg.id)) return prev;
        return { ...prev, [msg.conversationId]: [...convoMsgs, msg] };
      });
      const currentConvo = selectedConvoRef.current;
      if (!currentConvo || currentConvo.id !== msg.conversationId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.conversationId]: (prev[msg.conversationId] || 0) + 1,
        }));
      } else {
        // Chat is open — update last-seen so next login shows as read
        const key = `last_seen_${user.id}`;
        const lastSeen = JSON.parse(localStorage.getItem(key) || "{}");
        lastSeen[msg.conversationId] = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(lastSeen));
      }
      fetchConversations();
    });

    const statusChannel = pusher.subscribe("status_channel");
    statusChannel.bind("user:status", ({ userId, isOnline }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.other.id === userId ? { ...c, other: { ...c.other, isOnline } } : c
        )
      );
      setSelectedConvo((prev) =>
        prev && prev.other.id === userId ? { ...prev, other: { ...prev.other, isOnline } } : prev
      );
    });

    // Handle message:delete on personal channel
    userChannel.bind("message:delete", ({ messageId, conversationId }) => {
      setMessages((prev) => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).filter((m) => m.id !== messageId),
      }));
    });

    // Handle message:edit on personal channel
    userChannel.bind("message:edit", ({ messageId, conversationId, content, isEdited }) => {
      setMessages((prev) => {
        const convoMsgs = prev[conversationId] || [];
        const updated = convoMsgs.map((m) =>
          m.id === messageId ? { ...m, content, isEdited } : m
        );
        return { ...prev, [conversationId]: updated };
      });
      fetchConversations();
    });

    // Handle message:reaction on personal channel
    userChannel.bind("message:reaction", ({ messageId, conversationId, reactions }) => {
      setMessages((prev) => {
        const convoMsgs = prev[conversationId] || [];
        const updated = convoMsgs.map((m) =>
          m.id === messageId ? { ...m, reactions } : m
        );
        return { ...prev, [conversationId]: updated };
      });
    });

    return () => {
      pusher.unsubscribe(`user_${user.id}`);
      pusher.unsubscribe("status_channel");
    };
  }, [user, fetchConversations]);

  // Conversation-specific Pusher subscription
  useEffect(() => {
    if (!user || !selectedConvo) return;
    const pusher = getPusherClient();
    if (!pusher) return;

    const chatChannel = pusher.subscribe(`chat_${selectedConvo.id}`);

    chatChannel.bind("message:new", (msg) => {
      // Only process messages from others — sender already added it optimistically
      if (msg.senderId === user.id) return;
      setMessages((prev) => {
        const convoMsgs = prev[msg.conversationId] || [];
        if (convoMsgs.find((m) => m.id === msg.id)) return prev;
        return { ...prev, [msg.conversationId]: [...convoMsgs, msg] };
      });
      fetchConversations();
    });

    chatChannel.bind("typing:start", ({ userId }) => {
      if (userId !== user.id) {
        setTypingUsers((prev) => ({ ...prev, [selectedConvo.id]: userId }));
      }
    });

    chatChannel.bind("typing:stop", ({ userId }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[selectedConvo.id];
        return next;
      });
    });

    chatChannel.bind("message:reaction", ({ messageId, conversationId, reactions }) => {
      const convoId = conversationId || selectedConvo.id;
      setMessages((prev) => ({
        ...prev,
        [convoId]: (prev[convoId] || []).map((m) =>
          m.id === messageId ? { ...m, reactions } : m
        ),
      }));
    });

    chatChannel.bind("message:delete", ({ messageId, conversationId }) => {
      const convoId = conversationId || selectedConvo.id;
      setMessages((prev) => ({
        ...prev,
        [convoId]: (prev[convoId] || []).filter((m) => m.id !== messageId),
      }));
    });

    chatChannel.bind("message:edit", ({ messageId, conversationId, content, isEdited }) => {
      const convoId = conversationId || selectedConvo.id;
      setMessages((prev) => {
        const updated = (prev[convoId] || []).map((m) =>
          m.id === messageId ? { ...m, content, isEdited } : m
        );
        return { ...prev, [convoId]: updated };
      });
      fetchConversations();
    });

    return () => {
      pusher.unsubscribe(`chat_${selectedConvo.id}`);
    };
  }, [user, selectedConvo, fetchConversations]);

  // Load messages for selected conversation — always fetch fresh to include history
  useEffect(() => {
    if (!selectedConvo || !token) return;

    setIsFetchingMessages(true);
    fetch(`/api/conversations/${selectedConvo.id}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.messages) {
          setMessages((prev) => {
            // Merge: keep any optimistic messages not yet in DB, add all DB messages
            const existing = prev[selectedConvo.id] || [];
            const dbIds = new Set(data.messages.map((m) => m.id));
            const optimistic = existing.filter((m) => !dbIds.has(m.id));
            return { ...prev, [selectedConvo.id]: [...data.messages, ...optimistic] };
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsFetchingMessages(false));
  }, [selectedConvo?.id, token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Join/leave rooms logic removed as Pusher handles this via subscribe/unsubscribe in useEffect

  const handleSend = async (content, type = "text") => {
    if (!selectedConvo || !token) return;
    try {
      const res = await fetch(`/api/conversations/${selectedConvo.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content, type, replyToId: replyingTo?.id }),
      });
      if (res.status === 403) return; // blocked
      if (!res.ok) return; // other error — don't crash
      const text2 = await res.text();
      if (!text2) return;
      const data = JSON.parse(text2);
      if (data.message) {
        const msg = data.message;
        setMessages((prev) => ({
          ...prev,
          [selectedConvo.id]: [...(prev[selectedConvo.id] || []), msg],
        }));
        // Socket logic removed — handled by API trigger in message POST
        fetchConversations();
      }
    } catch (err) {
      console.error(err);
    }
    setReplyingTo(null);
    setUnreadDivider(null); // dismiss unread divider on send
  };

  const handleEditSubmit = async (content) => {
    if (!selectedConvo || !token || !editingMsg) return;
    try {
      const res = await fetch(`/api/conversations/${selectedConvo.id}/messages/${editingMsg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => ({
          ...prev,
          [selectedConvo.id]: (prev[selectedConvo.id] || []).map((m) =>
            m.id === editingMsg.id ? { ...m, content: data.message.content, isEdited: data.message.isEdited } : m
          ),
        }));
        fetchConversations();
      }
    } catch (err) {
      console.error(err);
    }
    setEditingMsg(null);
  };

  const handleUnsend = async (msgId, type = "everyone") => {
    if (!selectedConvo) return;
    // Always remove from local state immediately
    setMessages((prev) => ({
      ...prev,
      [selectedConvo.id]: (prev[selectedConvo.id] || []).filter((m) => m.id !== msgId),
    }));
    if (type === "everyone") {
      // Delete from DB + notify other person via Pusher (handled server-side)
      await fetch(`/api/conversations/${selectedConvo.id}/messages/${msgId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    // "self" = remove only locally, no API call
    fetchConversations();
  };

  const handleReaction = (msgId, emoji) => {
    if (!selectedConvo) return;
    setMessages((prev) => {
      const updated = (prev[selectedConvo.id] || []).map((m) => {
        if (m.id === msgId) {
          const has = m.reactions.includes(emoji);
          return { ...m, reactions: has ? m.reactions.filter((r) => r !== emoji) : [...m.reactions, emoji] };
        }
        return m;
      });
      const msg = updated.find((m) => m.id === msgId);
      
      fetch("/api/pusher/event", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          channel: `chat_${selectedConvo.id}`,
          event: "message:reaction",
          data: { conversationId: selectedConvo.id, messageId: msgId, reactions: msg?.reactions },
        }),
      }).catch(() => {});
      
      return { ...prev, [selectedConvo.id]: updated };
    });
  };

  const handleTyping = (isTyping) => {
    if (!selectedConvo || !user) return;
    
    const triggerTyping = (typing) => {
      fetch("/api/pusher/event", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          channel: `chat_${selectedConvo.id}`,
          event: typing ? "typing:start" : "typing:stop",
          data: { userId: user.id },
        }),
      }).catch(() => {});
    };

    if (isTyping) {
      triggerTyping(true);
      clearTimeout(typingTimers.current[selectedConvo.id]);
      typingTimers.current[selectedConvo.id] = setTimeout(() => {
        triggerTyping(false);
      }, 2000);
    } else {
      clearTimeout(typingTimers.current[selectedConvo.id]);
      triggerTyping(false);
    }
  };

  const selectConversation = async (convoOrUser) => {
    // If it has a `userId` prop it came from search/suggested — need to create/get convo
    if (convoOrUser.userId) {
      const targetUserId = convoOrUser.userId;
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ userId: targetUserId }),
        });
        const data = await res.json();
        if (data.conversationId) {
          const convosRes = await fetch("/api/conversations", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const convosData = await convosRes.json();
          setConversations(convosData.conversations || []);
          const found = convosData.conversations?.find((c) => c.id === data.conversationId);
          if (found) {
            setSelectedConvo(found);
            setUnreadCounts((prev) => ({ ...prev, [found.id]: 0 }));
            if (user) {
              const key = `last_seen_${user.id}`;
              const lastSeen = JSON.parse(localStorage.getItem(key) || "{}");
              lastSeen[found.id] = new Date().toISOString();
              localStorage.setItem(key, JSON.stringify(lastSeen));
            }
            setIsMobileChatOpen(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // It's already a conversation object from the sidebar list
      const unread = unreadCounts[convoOrUser.id] || 0;
      setSelectedConvo(convoOrUser);
      setUnreadCounts((prev) => ({ ...prev, [convoOrUser.id]: 0 }));
      // Show unread divider if there were unread messages
      if (unread > 0) {
        setUnreadDivider({ convoId: convoOrUser.id, count: unread });
        clearTimeout(unreadDividerTimer.current);
        unreadDividerTimer.current = setTimeout(() => setUnreadDivider(null), 2000);
      } else {
        setUnreadDivider(null);
      }
      if (user) {
        const key = `last_seen_${user.id}`;
        const lastSeen = JSON.parse(localStorage.getItem(key) || "{}");
        lastSeen[convoOrUser.id] = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(lastSeen));
      }
      setIsMobileChatOpen(true);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("chat_theme", newMode ? "dark" : "light");
  };

  const confirmLogout = async () => {
    await logout();
  };

  if (authLoading) return null;
  if (!user) return null;

  // Build chat object for ChatHeader from selectedConvo
  const selectedChat = selectedConvo
    ? {
        id: selectedConvo.id,
        name: selectedConvo.other.name,
        avatar: selectedConvo.other.avatar,
        isOnline: selectedConvo.other.isOnline,
        statusText: selectedConvo.other.isOnline ? "Available" : "Offline",
        type: "person",
      }
    : null;

  // Format messages for MessageList
  const currentMessages = (messages[selectedConvo?.id] || []).map((msg, idx, arr) => {
    const isUser = msg.senderId === user.id;
    const prevMsg = arr[idx - 1];
    const msgDate = new Date(msg.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateLabel;
    if (msgDate.toDateString() === today.toDateString()) dateLabel = "Today";
    else if (msgDate.toDateString() === yesterday.toDateString()) dateLabel = "Yesterday";
    else dateLabel = msgDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

    const prevDate = prevMsg ? new Date(prevMsg.createdAt) : null;
    const prevDateLabel = prevDate
      ? prevDate.toDateString() === today.toDateString()
        ? "Today"
        : prevDate.toDateString() === yesterday.toDateString()
        ? "Yesterday"
        : prevDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
      : null;

    return {
      id: msg.id,
      type: msg.type || "text",
      content: msg.content,
      sender: isUser ? "user" : "friend",
      senderId: msg.senderId,
      senderName: msg.sender?.name || "",
      time: msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      reactions: msg.reactions || [],
      isEdited: msg.isEdited,
      date: dateLabel,
      replyTo: msg.replyToId
        ? (() => {
            const orig = arr.find((m) => m.id === msg.replyToId);
            if (!orig) return null;
            const origIsUser = orig.senderId === user.id;
            return {
              id: orig.id,
              content: orig.content,
              sender: origIsUser ? "user" : "friend",
              senderName: orig.sender?.name || (origIsUser ? "Me" : ""),
            };
          })()
        : null,
      _showDate: dateLabel !== prevDateLabel,
    };
  });

  const isOtherTyping = selectedConvo && typingUsers[selectedConvo.id] === selectedConvo.other.id;

  return (
    <>
      <SplashLoader isLoading={isLoading} />
      <main
        className={`flex h-dvh w-full transition-colors duration-300 font-poppins overflow-hidden ${isDarkMode ? "dark bg-[#141821]" : "bg-white"}`}
        style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.4s ease" }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(54, 100, 159, 0.2); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(54, 100, 159, 0.4); }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
            .chat-bg {
              background: linear-gradient(180deg, #ffffff 0%, #d8efff 45%, #76bbf2 100%);
              position: relative;
            }
            .dark .chat-bg {
              background: linear-gradient(180deg, #141821 0%, #1a2235 50%, #1e3a5f 100%);
            }
          `
        }} />

        <div className={isMobileChatOpen ? "hidden md:block" : "block"}>
          <Navbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isDarkMode={isDarkMode}
            onLogoutClick={() => setShowLogoutModal(true)}
          />
        </div>

        {activeTab === "chats" && (
          <div className={`shrink-0 transition-all duration-300 ${isMobileChatOpen ? "hidden md:flex" : "flex w-full md:w-auto"}`}>
            <Sidebar
              selectedChatId={selectedConvo?.id}
              onSelectChat={selectConversation}
              onProfileClick={() => setIsSettingsOpen(true)}
              isDarkMode={isDarkMode}
              conversations={conversations}
              currentUserId={user.id}
              token={token}
              unreadCounts={unreadCounts}
            />
          </div>
        )}

        {activeTab === "chats" && (
          <div className={`flex-1 flex flex-col min-w-0 h-full md:h-screen lg:h-full relative transition-all duration-300 chat-bg overflow-hidden ${!isMobileChatOpen ? "hidden md:flex" : "flex w-full h-[100dvh]"}`}>
            <div className="absolute inset-0 pointer-events-none z-0">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="wavyPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                    <g fill="none" stroke={isDarkMode ? "#3d8bd8" : "#3d8bd8"} strokeWidth="1.5" strokeOpacity={isDarkMode ? "0.15" : "0.2"} strokeLinecap="round">
                      <path d="M20 40 C 40 20, 80 30, 70 60 S 20 90, 40 120 C 60 150, 120 130, 140 160" />
                      <path d="M120 30 C 140 10, 180 40, 160 70 S 100 90, 130 120 C 160 150, 190 120, 180 180" />
                      <path d="M10 140 C 30 120, 60 160, 50 180 S 10 190, 30 200" />
                      <path d="M150 100 Q 170 80, 190 100 T 210 100" />
                      <path d="M80 80 C 70 100, 100 120, 90 140 S 60 160, 80 180" />
                    </g>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#wavyPattern)" />
              </svg>
            </div>

            {selectedChat ? (
              <>
                <div className="shrink-0">
                  <ChatHeader
                    chat={{ ...selectedChat, username: selectedConvo.other.username, email: selectedConvo.other.email }}
                    messages={currentMessages}
                    // onCallClick={() => setIsCalling(true)}
                    onBack={() => setIsMobileChatOpen(false)}
                    isDarkMode={isDarkMode}
                    isBlocked={!!blockedUsers[selectedConvo.other.id]}
                    onBlock={() => handleBlock(selectedConvo.other.id)}
                    onUnblock={() => handleUnblock(selectedConvo.other.id)}
                  />
                </div>
                <MessageList
                  messages={currentMessages}
                  onReaction={handleReaction}
                  onUnsend={handleUnsend}
                  onReply={setReplyingTo}
                  onEdit={setEditingMsg}
                  isDarkMode={isDarkMode}
                  isLoading={isFetchingMessages}
                  chatType="person"
                  chatName={selectedChat.name}
                  chatId={selectedConvo.id}
                  isTyping={isOtherTyping}
                  typingName={selectedConvo.other.name}
                  unreadCount={unreadDivider?.convoId === selectedConvo.id ? unreadDivider.count : 0}
                />
                <div className="shrink-0">
                  {blockedUsers[selectedConvo.other.id] ? (
                    <div className={`px-4 py-4 border-t text-center text-sm font-medium ${isDarkMode ? "bg-[#1a202c]/80 border-gray-700 text-gray-500" : "bg-white/80 border-gray-200 text-gray-400"}`}>
                      You blocked this contact.{" "}
                      <button onClick={() => handleUnblock(selectedConvo.other.id)} className="text-blue-500 hover:underline font-semibold">Unblock</button>
                    </div>
                  ) : (
                    <ChatInput
                      onSend={handleSend}
                      onTyping={handleTyping}
                      isDarkMode={isDarkMode}
                      isLoading={false}
                      replyingTo={replyingTo}
                      onCancelReply={() => setReplyingTo(null)}
                      editingMsg={editingMsg}
                      onCancelEdit={() => setEditingMsg(null)}
                      onEditSubmit={handleEditSubmit}
                      chatId={selectedConvo.id}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className={`flex-1 flex flex-col items-center justify-center transition-colors duration-300 ${isDarkMode ? "bg-transparent text-gray-500" : "bg-transparent text-gray-400"}`}>
                <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-4">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h2 className="text-xl font-bold">Select a chat to start messaging</h2>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <ProfileView
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onLogoutClick={() => setShowLogoutModal(true)}
            user={user}
            updateUser={updateUser}
          />
        )}

        <SettingsDropdown
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        {/* <CallModal isOpen={isCalling} onClose={() => setIsCalling(false)} isDarkMode={isDarkMode} chat={selectedChat} /> */}
        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
          isDarkMode={isDarkMode}
        />
      </main>
    </>
  );
}
