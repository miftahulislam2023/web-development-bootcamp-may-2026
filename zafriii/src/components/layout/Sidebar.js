"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { LuMessageCirclePlus } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidMessageRoundedCheck, BiSolidMessageRoundedAdd } from "react-icons/bi";

export default function Sidebar({ onSelectChat, selectedChatId, onProfileClick, isDarkMode, conversations = [], currentUserId, token, unreadCounts = {} }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewChatTooltip, setShowNewChatTooltip] = useState(false);
  const searchTimer = useRef(null);

  // Fetch suggested users on mount
  useEffect(() => {
    if (!token) return;
    fetch("/api/users/suggested", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { if (data.users) setSuggestedUsers(data.users); })
      .catch(() => {});
  }, [token]);

  // Search users from DB
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSearchResults(data.users || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, [searchQuery, token]);

  // Format conversations for display
  const formattedConvos = conversations.map((c) => {
    const lastMsg = c.lastMessage;
    const isMyMsg = lastMsg?.senderId === currentUserId;
    return {
      id: c.id,
      name: c.other.name,
      avatar: c.other.avatar,
      isOnline: c.other.isOnline,
      type: "person",
      other: c.other,
      lastMsg: lastMsg
        ? isMyMsg
          ? `Me: ${lastMsg.content}`
          : lastMsg.content
        : "",
      time: lastMsg
        ? (() => {
            const d = new Date(lastMsg.createdAt);
            const today = new Date();
            if (d.toDateString() === today.toDateString())
              return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
            return d.toLocaleDateString("en-US", { weekday: "short" });
          })()
        : "",
      lastMsgStatus: isMyMsg ? "sent" : null,
      unread: unreadCounts[c.id] || 0,
    };
  });

  const filteredConvos = formattedConvos.filter((c) => {
    if (activeFilter !== "all" && c.type !== activeFilter) return false;
    return true;
  });

  const showSearch = searchQuery.trim().length > 0;

  return (
    <div className={`w-full md:w-[300px] lg:w-[360px] h-full flex flex-col border-r transition-colors duration-300 ${isDarkMode ? "bg-[#1a202c] border-gray-700 text-white" : "bg-slate-50 border-gray-200 text-gray-900"}`}>
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-tight">ArikoChats</h1>
        <div className="flex gap-2 relative">
          <button
            onMouseEnter={() => setShowNewChatTooltip(true)}
            onMouseLeave={() => setShowNewChatTooltip(false)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            <BiSolidMessageRoundedAdd size={24} />
          </button>
          <AnimatePresence>
            {showNewChatTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className={`absolute top-11 right-0 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide shadow-xl whitespace-nowrap z-50 pointer-events-none border ${isDarkMode ? "bg-[#2d2a1e] border-yellow-700/30 text-[#ffde80]" : "bg-[#fffbeb] border-yellow-200 text-yellow-900"}`}
              >
                Search to start a new chat
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-colors ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search people"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 ${isDarkMode ? "text-white" : "text-gray-900"}`}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className={`flex-shrink-0 p-1 rounded-full transition-colors ${isDarkMode ? "hover:bg-gray-700 text-gray-400 hover:text-white" : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"}`}
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 flex gap-3">
        {[
          { id: "all", label: "All" },
          { id: "person", label: "Persons" },
          { id: "group", label: "Groups" },
        ].map((filter) => (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 700,
              damping: 25,
              mass: 0.5,
              delay: 0
            }}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-5 py-2 rounded-[14px] text-[11px] font-black uppercase tracking-wider ${activeFilter === filter.id
              ? "bg-gradient-to-br from-[#ffb800] to-[#ff9100] text-white shadow-[0_4px_15px_rgba(255,184,0,0.4)]"
              : (isDarkMode ? "bg-gray-800/80 text-gray-400 hover:text-gray-200 border border-gray-700/50" : "bg-white text-gray-500 hover:text-gray-700 border border-gray-200 shadow-sm")
              }`}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* Inbox List */}
      <div className="flex-1 overflow-y-auto mt-2 pb-20 md:pb-0 custom-scrollbar">
        {/* Search Results */}
        {showSearch && (
          <div className="px-4 mb-4">
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Search Results
            </h3>
            {isSearching ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : searchResults.length === 0 ? (
              <p className={`text-sm text-center py-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                No users found
              </p>
            ) : (
              searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSelectChat({ userId: user.id, ...user })}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-blue-50"}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 ${user.avatar ? "border-transparent" : (isDarkMode ? "bg-gray-800 border-gray-700 text-blue-400" : "bg-blue-100 border-blue-200 text-blue-600")}`}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold">{user.name[0]}</span>
                      )}
                    </div>
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user.name}</p>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>@{user.username}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* Suggested Users */}
        {!showSearch && suggestedUsers.length > 0 && (
          <div className="px-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-yellow-500" />
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Suggested
              </h3>
            </div>
            {suggestedUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => onSelectChat({ userId: user.id, ...user })}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl mb-1 transition-all ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-blue-50"}`}
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${user.avatar ? "" : (isDarkMode ? "bg-gray-800 text-blue-400" : "bg-blue-100 text-blue-600")}`}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold">{user.name[0]}</span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-semibold text-xs ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user.name}</p>
                  <p className={`text-[10px] ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>@{user.username}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Conversations */}
        {!showSearch && (
          <>
            {filteredConvos.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-20 text-center px-4">
                <span className={`text-[15px] font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No conversations yet
                </span>
                <span className={`text-[12px] mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Search for people to start chatting
                </span>
              </div>
            ) : (
              filteredConvos.map((inbox) => (
                <button
                  key={inbox.id}
                  onClick={() => onSelectChat(inbox)}
                  className={`w-full flex items-center gap-4 px-4 py-3 transition-all duration-300 ease-in-out ${selectedChatId === inbox.id
                    ? (isDarkMode ? "bg-gray-800/90" : "bg-[#e8f2ff]")
                    : (isDarkMode ? "hover:bg-gray-700/40" : "hover:bg-[#f0f7ff]")
                    }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center border-2 ${inbox.avatar
                      ? "border-transparent"
                      : (isDarkMode ? "bg-gray-800 border-gray-700 text-[#8ac3ef]" : "bg-white border-blue-50 text-[#36649f]")
                      }`}>
                      {inbox.avatar ? (
                        <img src={inbox.avatar} alt={inbox.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold">{inbox.name[0]}</span>
                      )}
                    </div>
                    {inbox.unread > 0 && (
                      <div className="absolute -top-1 -left-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#ffb800] text-white text-[10px] font-black flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                        {inbox.unread}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col items-start overflow-hidden w-full">
                    <div className="w-full flex justify-between items-center mb-0.5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`text-[0.95rem] truncate ${inbox.unread > 0 ? "font-bold " + (isDarkMode ? "text-white" : "text-gray-900") : "font-medium " + (isDarkMode ? "text-gray-300" : "text-gray-700")}`}>
                          {inbox.name}
                        </span>
                        {inbox.isOnline && (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] flex-shrink-0"></div>
                        )}
                      </div>
                      <span className={`text-[0.65rem] font-medium tracking-wider uppercase flex-shrink-0 ml-2 ${inbox.unread > 0 ? "text-[#ffb800]" : (isDarkMode ? "text-gray-500" : "text-gray-400")}`}>
                        {inbox.time}
                      </span>
                    </div>

                    <div className="w-full flex items-center gap-1.5 overflow-hidden pr-2">
                      {inbox.lastMsg ? (
                        <div className="flex items-center gap-1 w-full overflow-hidden">
                          {inbox.lastMsg.startsWith("Me:") && (
                            <BiSolidMessageRoundedCheck className="flex-shrink-0 text-[#f08805]" size={14} />
                          )}
                          <span className={`text-[13px] truncate flex-1 text-left ${inbox.unread > 0 ? "font-semibold " + (isDarkMode ? "text-white/90" : "text-gray-800") : (isDarkMode ? "text-gray-400" : "text-gray-500")}`}>
                            {inbox.lastMsg}
                          </span>
                        </div>
                      ) : (
                        <span className={`text-[13px] ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>
                          Start a new conversation!
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
