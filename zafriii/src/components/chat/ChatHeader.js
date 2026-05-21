"use client";

import { useState, useRef } from "react";
import { Phone, Video, MoreHorizontal, BellOff, UserX, ImageIcon, ChevronLeft, Info, Clock, X, ShieldOff, FileText, Link2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useOutsideClick from "@/hooks/useOutsideClick";

export default function ChatHeader({ chat, messages = [], onCallClick, onBack, isDarkMode, isBlocked, onBlock, onUnblock }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaTab, setMediaTab] = useState("media");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => {
    if (showDropdown) setShowDropdown(false);
  });

  if (!chat) return null;

  const mediaMessages = messages.filter((m) => m.type === "image");
  const docMessages = messages.filter((m) => m.type === "file" || m.type === "document");
  const linkMessages = messages.filter((m) => m.type === "text" && m.content && m.content.match(/https?:\/\/[^\s]+/g));

  return (
    <>
      <header className={`h-18 px-4 flex justify-between items-center z-50 border-b transition-colors duration-300 sticky top-0 backdrop-blur-md ${isDarkMode ? "bg-[#1a202c]/80 border-gray-700" : "bg-white/80 border-gray-200"}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 ${isDarkMode ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-[#36649f]"}`}
          >
            <ChevronLeft size={24} />
          </button>

          <button onClick={() => setShowProfile(true)} className="flex items-center gap-3 cursor-pointer">
            <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${chat.avatar ? "" : (isDarkMode ? "bg-gray-700" : "bg-[#36649f] text-white")}`}>
              {chat.avatar ? (
                <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold">{chat.name[0]}</span>
              )}
            </div>
            <div className="flex flex-col">
              <h2 className={`text-base font-bold leading-none ${isDarkMode ? "text-white" : "text-gray-900"}`}>{chat.name}</h2>
              <div className="flex items-center gap-1.5 mt-1.5">
                {isBlocked ? (
                  <span className="text-[10px] font-bold tracking-tight uppercase text-red-500">Blocked</span>
                ) : chat.type === "group" ? (
                  <span className={`text-[10px] font-medium tracking-tight ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>5 members</span>
                ) : chat.isOnline !== false ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                    <span className={`text-[10px] font-bold tracking-tight uppercase ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>Available</span>
                  </>
                ) : (
                  <>
                    <Clock size={10} className={isDarkMode ? "text-amber-400/80" : "text-amber-600/80"} />
                    <span className={`text-[10px] font-normal tracking-tight ${isDarkMode ? "text-amber-400/80" : "text-amber-600/80"}`}>
                      {chat.statusText || "Faded some time ago"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1 relative">
          {/* Removed Call and Video buttons */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? "text-[#8ac3ef] hover:bg-gray-800" : "text-[#36649f] hover:bg-gray-100"}`}
          >
            <MoreHorizontal size={20} />
          </button>

          {showDropdown && (
            <div ref={dropdownRef} className={`absolute top-12 right-0 w-56 z-40 rounded-xl shadow-2xl overflow-hidden border p-1 animate-in fade-in zoom-in-95 duration-200 ${isDarkMode ? "bg-[#2d3748] border-gray-700 text-white" : "bg-white border-gray-100 text-gray-900"}`}>
              <button
                onClick={() => { setShowProfile(true); setShowDropdown(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-lg flex items-center gap-3 transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
              >
                <Info size={16} className="text-blue-500" />
                View Info
              </button>
              {/* Removed Mute Notifications option */}
              <div className="my-1 px-4"><div className={`h-px w-full ${isDarkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`} /></div>
              {isBlocked ? (
                <button
                  onClick={() => { onUnblock && onUnblock(); setShowDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm rounded-lg flex items-center gap-3 transition-colors ${isDarkMode ? "hover:bg-gray-700 text-emerald-400" : "hover:bg-gray-50 text-emerald-600"}`}
                >
                  <ShieldOff size={16} />
                  Unblock Contact
                </button>
              ) : (
                <button
                  onClick={() => { onBlock && onBlock(); setShowDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm rounded-lg flex items-center gap-3 transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
                >
                  <UserX size={16} className="text-red-500" />
                  Block Contact
                </button>
              )}
              <div className="my-1 px-4"><div className={`h-px w-full ${isDarkMode ? "bg-gray-700/50" : "bg-gray-200/50"}`} /></div>
              <button 
                onClick={() => { setShowMediaModal(true); setShowDropdown(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-lg flex items-center gap-3 transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                <ImageIcon size={16} className="text-gray-400" />
                Media, Links, Docs
              </button>
            </div>
          )}
        </div>
      </header>

      {/* View Info — slide-in profile panel */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className={`fixed right-0 top-0 h-full w-full max-w-sm z-70 shadow-2xl flex flex-col ${isDarkMode ? "bg-[#1a202c]" : "bg-white"}`}
            >
              {/* Panel Header */}
              <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
                <h3 className={`font-bold text-base ${isDarkMode ? "text-white" : "text-gray-900"}`}>Contact Info</h3>
                <button
                  onClick={() => setShowProfile(false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Profile Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Avatar + Name */}
                <div className={`flex flex-col items-center py-8 px-6 border-b ${isDarkMode ? "border-gray-700/50" : "border-gray-100"}`}>
                  <div
                    className={`w-24 h-24 rounded-full overflow-hidden flex items-center justify-center mb-4 shadow-lg ${chat.avatar ? "cursor-pointer" : (isDarkMode ? "bg-gray-700" : "bg-[#36649f] text-white")}`}
                    onClick={() => chat.avatar && setShowAvatarModal(true)}
                    title={chat.avatar ? "View profile picture" : undefined}
                  >
                    {chat.avatar ? (
                      <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold">{chat.name[0]}</span>
                    )}
                  </div>
                        {/* Avatar Modal */}
                        <AnimatePresence>
                          {showAvatarModal && chat.avatar && (
                            <>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowAvatarModal(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                              />
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ type: 'spring', damping: 24, stiffness: 300 }}
                                className="fixed inset-0 flex items-center justify-center z-[110]"
                              >
                                <div className={`relative bg-transparent rounded-2xl shadow-2xl flex flex-col items-center`}>
                                  <button
                                    onClick={() => setShowAvatarModal(false)}
                                    className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 text-white"
                                    title="Close"
                                  >
                                    <X size={22} />
                                  </button>
                                  <img
                                    src={chat.avatar}
                                    alt={chat.name}
                                    className="max-w-[90vw] max-h-[80vh] rounded-2xl object-contain border-4 border-white shadow-xl"
                                    style={{ background: isDarkMode ? '#1a202c' : '#fff' }}
                                  />
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                  <h2 className={`text-xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{chat.name}</h2>
                  {chat.username && (
                    <p className="text-sm text-blue-500 font-medium">@{chat.username}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    {isBlocked ? (
                      <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full">Blocked</span>
                    ) : chat.isOnline ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className={`text-xs font-semibold ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>Online</span>
                      </>
                    ) : (
                      <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{chat.statusText || "Offline"}</span>
                    )}
                  </div>
                </div>

                {/* Info rows */}
                <div className="px-5 py-4 space-y-3">
                  {chat.email && (
                    <div className={`p-3 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Email</p>
                      <p className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{chat.email}</p>
                    </div>
                  )}
                  <div className={`p-3 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Username</p>
                    <p className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>@{chat.username || chat.name.toLowerCase().replace(/\s/g, "_")}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-6 space-y-2">
                  {isBlocked ? (
                    <button
                      onClick={() => { onUnblock && onUnblock(); setShowProfile(false); }}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldOff size={16} />
                      Unblock Contact
                    </button>
                  ) : (
                    <button
                      onClick={() => { onBlock && onBlock(); setShowProfile(false); }}
                      className="w-full py-3 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <UserX size={16} />
                      Block Contact
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Media, Links, Docs Modal */}
      <AnimatePresence>
        {showMediaModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMediaModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className={`fixed right-0 top-0 h-full w-full max-w-sm z-70 shadow-2xl flex flex-col ${isDarkMode ? "bg-[#1a202c]" : "bg-white"}`}
            >
              <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
                <h3 className={`font-bold text-base ${isDarkMode ? "text-white" : "text-gray-900"}`}>Shared Content</h3>
                <button
                  onClick={() => setShowMediaModal(false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className={`flex border-b ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
                 <button onClick={() => setMediaTab('media')} className={`flex-1 py-3 text-sm font-semibold border-b-2 ${mediaTab === 'media' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}>Media</button>
                 <button onClick={() => setMediaTab('links')} className={`flex-1 py-3 text-sm font-semibold border-b-2 ${mediaTab === 'links' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}>Links</button>
                 <button onClick={() => setMediaTab('docs')} className={`flex-1 py-3 text-sm font-semibold border-b-2 ${mediaTab === 'docs' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'}`}>Docs</button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                 {mediaTab === 'media' && (
                    <div className="grid grid-cols-3 gap-2">
                       {mediaMessages.length > 0 ? mediaMessages.map((m) => (
                           <a key={m.id} href={m.content} target="_blank" rel="noopener noreferrer" className="aspect-square bg-gray-100 rounded-lg overflow-hidden block">
                              <img src={m.content} alt="Media" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                           </a>
                       )) : <p className="col-span-3 text-center text-sm text-gray-500 py-10">No media found</p>}
                    </div>
                 )}
                 {mediaTab === 'links' && (
                    <div className="space-y-3">
                       {linkMessages.length > 0 ? linkMessages.map((m, i) => {
                           const urls = m.content.match(/https?:\/\/[^\s]+/g);
                           return urls?.map((url, j) => (
                             <a key={`${m.id}-${j}`} href={url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}>
                               <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                                 <Link2 size={18} />
                               </div>
                               <div className="flex-1 overflow-hidden">
                                 <p className={`text-sm font-medium truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>{url}</p>
                               </div>
                             </a>
                           ))
                       }) : <p className="text-center text-sm text-gray-500 py-10">No links found</p>}
                    </div>
                 )}
                 {mediaTab === 'docs' && (
                    <div className="space-y-3">
                       {docMessages.length > 0 ? docMessages.map((m) => {
                           const isPdf = m.content.toLowerCase().endsWith('.pdf');
                           const fileName = m.content.split('/').pop() || 'Document';
                           return (
                             <a key={m.id} href={m.content} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}>
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isPdf ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                                 <FileText size={18} />
                               </div>
                               <div className="flex-1 overflow-hidden">
                                 <p className={`text-sm font-medium truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>{fileName}</p>
                                 <p className="text-xs text-gray-500 mt-0.5">{m.date}</p>
                               </div>
                             </a>
                           )
                       }) : <p className="text-center text-sm text-gray-500 py-10">No documents found</p>}
                    </div>
                 )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}










