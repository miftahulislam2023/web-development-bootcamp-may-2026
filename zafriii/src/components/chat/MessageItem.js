"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Play, CheckCheck, Copy, Star, Trash2, MoreHorizontal, X, SmilePlus, File as FileIcon, Download, Pencil } from "lucide-react";
import { BiSolidMessageRoundedCheck, BiSolidMessageRoundedMinus } from "react-icons/bi";
import { RiDropdownList } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { BsCheck2All } from "react-icons/bs";
import { createPortal } from "react-dom";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export default function MessageItem({ msg, onReaction, onUnsend, onReply, onEdit, isDarkMode, isLastOutgoing, chatType }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [showUnsendConfirm, setShowUnsendConfirm] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [unsendModalPos, setUnsendModalPos] = useState(null);
  const messageRef = useRef(null);
  const isUser = msg.sender === "user";

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setShowActions(false);
        setShowReactionPicker(false);
        setShowUnsendConfirm(false);
      }
    };

    if (showActions || showReactionPicker) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showActions, showReactionPicker]);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
  };

  const handleUnsendClick = (e) => {
    e.stopPropagation();
    if (showUnsendConfirm) {
      setShowUnsendConfirm(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const isNearTop = rect.top < 250;
    
    setUnsendModalPos({
      top: isNearTop ? rect.bottom + 8 : undefined,
      bottom: !isNearTop ? window.innerHeight - rect.top + 8 : undefined,
      right: isUser ? window.innerWidth - rect.right : undefined,
      left: !isUser ? rect.left : undefined,
    });
    setShowUnsendConfirm(true);
  };

  const getSenderName = () => {
    if (isUser) return "Me";
    return msg.senderName || msg.sender;
  };

  const getSenderColor = () => {
    if (isUser) return "text-blue-400";
    // Simple color mapping based on sender name
    const colors = ["text-amber-400", "text-blue-400", "text-purple-400", "text-emerald-400", "text-pink-400"];
    const name = getSenderName();
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={`flex w-full relative ${msg.reactions?.length > 0 ? (isUser ? "mb-8" : "mb-5") : "mb-[3px]"} ${isUser ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={messageRef}
        className={`relative max-w-[90%] md:max-w-[85%] min-w-0 flex flex-col ${isUser ? "items-end" : "items-start"}`}
      >
        {chatType === "group" && (
          <div className={`px-2 py-0.5 rounded-md mb-1 border shadow-sm ${isDarkMode ? "bg-gray-800/80 border-gray-700/50" : "bg-white/80 border-gray-100/50"}`}>
            <span className={`text-[10px] font-bold ${getSenderColor()}`}>
              {getSenderName()}
            </span>
          </div>
        )}

        {/* Message Actions Trigger Button */}
        {isHovered && (
          <button
            onClick={() => setShowActions(!showActions)}
            className={`absolute top-2 p-1.5 rounded-full shadow-md z-10 transition-all transform hover:scale-110 cursor-pointer ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-500"
              } ${isUser ? "-left-8 md:-left-10" : "-right-8 md:-right-10"}`}
          >
            <RiDropdownList size={16} />
          </button>
        )}

        {/* Message Content Bubble */}
        <div
          onClick={() => setShowActions(!showActions)}
          className={`relative transition-all duration-300 shadow-sm border min-w-0 ${isUser
            ? "bg-[#3d8bd8] text-white rounded-2xl rounded-tr-none border-[#3d8bd8]"
            : (isDarkMode ? "bg-[#2d3748] text-white rounded-2xl rounded-tl-none border-gray-600" : "bg-white text-gray-900 rounded-2xl rounded-tl-none border-gray-100")
            } ${showActions ? "pb-2" : ""}`}
        >
          <div className={`${msg.type === "image" ? "p-1" : "px-3 pt-1.5 pb-1.5"} relative min-w-[85px] max-w-full`}>
            {msg.type === "text" && (
              <div className="flex-1 relative">
                {msg.replyTo && (
                  <div className={`text-xs p-2 mb-1 rounded-lg border-l-4 opacity-80 ${isUser ? "bg-white/10 border-white text-white" : (isDarkMode ? "bg-gray-700 border-blue-400 text-gray-200" : "bg-blue-50 border-blue-500 text-gray-700")}`}>
                    <span className="font-semibold">{msg.replyTo.senderName || msg.replyTo.sender}:</span> {msg.replyTo.content}
                  </div>
                )}
                <div className="text-[14.5px] leading-[1.35] whitespace-pre-wrap break-words [word-break:break-word]">
                  {msg.content}
                  <span className={`inline-block h-[10px] ${msg.isEdited ? 'w-[85px]' : 'w-[45px]'}`}></span>
                </div>
              </div>
            )}

            {msg.type === "image" && (
              <>
                <div 
                  className="relative overflow-hidden rounded-xl cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setShowImageModal(true); }}
                >
                  <img src={msg.content} alt="Media" className="w-[280px] h-auto max-h-[400px] object-cover" />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/30 backdrop-blur-sm flex items-center border border-white/10 pointer-events-none">
                    <span className="text-[9px] font-medium text-white/90 tracking-tighter">{msg.time}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {showImageModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                      onClick={(e) => { e.stopPropagation(); setShowImageModal(false); }}
                    >
                      <button 
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-[101]"
                        onClick={(e) => { e.stopPropagation(); setShowImageModal(false); }}
                      >
                        <X size={24} />
                      </button>
                      <motion.img 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        src={msg.content} 
                        alt="Media Fullscreen" 
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {msg.type === "voice" && (
              <div className="flex items-center gap-3 min-w-[200px] py-1">
                <button className={`w-9 h-9 rounded-full flex justify-center items-center flex-shrink-0 transition-transform hover:scale-105 ${isUser ? "bg-white/20" : (isDarkMode ? "bg-gray-600" : "bg-[#daf1ff]")}`}>
                  <Play size={14} fill="currentColor" className={isUser ? "text-white" : "text-[#36649f]"} />
                </button>
                <div className="flex-1 flex items-center gap-[3px]">
                  {[...Array(18)].map((_, i) => (
                    <div key={i} className={`w-[3px] rounded-full opacity-60 ${isUser ? "bg-white" : (isDarkMode ? "bg-gray-400" : "bg-[#36649f]")}`} style={{ height: `${Math.random() * 18 + 4}px` }}></div>
                  ))}
                </div>
                <span className="text-xs font-bold opacity-80">{msg.content}</span>
              </div>
            )}

            {msg.type === "file" && (
                <div className="flex items-center gap-3 min-w-[180px] max-w-full py-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isUser ? "bg-white/20" : (isDarkMode ? "bg-gray-700" : "bg-blue-50")}`}>
                        <FileIcon size={20} className={isUser ? "text-white" : "text-blue-500"} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${isUser ? "text-white" : (isDarkMode ? "text-gray-200" : "text-gray-800")}`}>
                            {msg.content.split('/').pop()}
                        </p>
                        <p className={`text-[10px] opacity-70 ${isUser ? "text-white/80" : (isDarkMode ? "text-gray-400" : "text-gray-500")}`}>
                            Document
                        </p>
                    </div>
                    <a 
                        href={msg.content} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-2 rounded-full transition-colors ${isUser ? "hover:bg-white/20 text-white" : "hover:bg-gray-100 text-blue-500"}`}
                    >
                        <Download size={16} />
                    </a>
                </div>
            )}

            {/* Time and Status Indicator (Hidden for image type) */}
            {msg.type !== "image" && (
              <div className="absolute bottom-1 right-2 flex items-center gap-1 z-0">
                <span className={`text-[9.5px] font-medium tracking-tighter ${isUser ? "text-white/60" : "text-amber-500/70"
                  }`}>
                  {msg.time}
                </span>
                {msg.isEdited && (
                  <span className={`text-[9.5px] italic ml-0.5 ${isUser ? "text-white/60" : "text-gray-500/70"}`}>
                    (edited)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Integrated Actions Toolbar (shown inside the bubble) */}
          {showActions && (
            <div className="relative animate-in fade-in slide-in-from-top-2 duration-300 z-10">
              <div className="px-4 py-1">
                <div className={`h-[1px] w-full ${isUser ? "bg-white/20" : "bg-gray-200/20 dark:bg-gray-600/20"}`} />
              </div>
              <div className="px-4 py-1.5 flex gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${isUser ? "bg-white/20 text-white" : "bg-[#daf1ff] text-[#36649f]"}`}
                  title="Copy"
                >
                  <Copy size={14} />
                </button>
                
                <button
                  onClick={(e) => { e.stopPropagation(); onReply && onReply(msg); setShowActions(false); }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${isUser ? "bg-white/20 text-white" : "bg-[#daf1ff] text-[#36649f]"}`}
                  title="Reply"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                </button>

                {isUser && msg.type === "text" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit && onEdit(msg); setShowActions(false); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer bg-white/20 text-white`}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                )}

                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowReactionPicker(!showReactionPicker); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${isUser ? "bg-white/20 text-white" : "bg-[#daf1ff] text-[#36649f]"}`}
                    title="React"
                  >
                    <SmilePlus size={14} />
                  </button>
                  <AnimatePresence>
                    {showReactionPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className={`absolute bottom-full mb-2 ${isUser ? "right-0" : "left-0"} px-2 py-1.5 rounded-full flex gap-1.5 shadow-xl z-50 border whitespace-nowrap ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                      >
                        {REACTION_EMOJIS.map(emoji => (
                          <div
                            key={emoji}
                            onClick={(e) => {
                              e.stopPropagation();
                              onReaction(msg.id, emoji);
                              setShowReactionPicker(false);
                              setShowActions(false);
                            }}
                            className={`hover:scale-125 transition-all text-lg p-1.5 cursor-pointer rounded-full flex items-center justify-center ${msg.reactions?.includes(emoji)
                              ? (isDarkMode ? "bg-yellow-500/20 text-yellow-200" : "bg-yellow-100")
                              : ""
                              }`}
                          >
                            {emoji}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsStarred(!isStarred); }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${isUser
                    ? (isStarred ? "bg-yellow-400 text-white" : "bg-white/20 text-white")
                    : (isStarred ? "bg-yellow-100 text-yellow-600" : "bg-[#daf1ff] text-[#36649f]")
                    }`}
                  title="Star"
                >
                  <Star size={14} fill={isStarred ? "currentColor" : "none"} />
                </button>
                {isUser && (
                  <div className="relative">
                    <button
                      onClick={handleUnsendClick}
                      className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                      title="Unsend"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                {!isUser && (
                  <div className="relative">
                    <button
                      onClick={handleUnsendClick}
                      className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reactions Container (INSIDE bubble relative context) */}
          {msg.reactions && msg.reactions.length > 0 && (
            <div className={`absolute flex flex-col items-center z-20 ${isUser ? "-bottom-[15px] right-2" : "-bottom-[15px] left-2"}`}>
              <div className="flex -space-x-1">
                {msg.reactions.map((r, i) => (
                  <div key={i} className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] shadow-md border border-gray-200/50 dark:border-gray-700/50 animate-in zoom-in duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                    {r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status icon for LAST outgoing message only */}
          {isUser && isLastOutgoing && (
            <div className={`absolute flex items-center z-20 right-2 ${msg.reactions?.length > 0 ? "-bottom-[32px]" : "-bottom-[20px]"}`}>
              {(msg.id === 16 || msg.status === 'seen') ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#f08805" stroke="#f08805" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3" fill="white"></circle></svg>
              ) : (
                <BiSolidMessageRoundedCheck size={14} className="text-[#f08805]" />
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Unsend Modal Portal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showUnsendConfirm && unsendModalPos && (
            <div className="fixed inset-0 z-[9999]" onClick={(e) => { e.stopPropagation(); setShowUnsendConfirm(false); }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: unsendModalPos.top ? -10 : 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: unsendModalPos.top ? -10 : 10 }}
                style={{
                  position: "absolute",
                  top: unsendModalPos.top,
                  bottom: unsendModalPos.bottom,
                  right: unsendModalPos.right,
                  left: unsendModalPos.left,
                }}
                className={`p-2 rounded-2xl shadow-2xl border flex flex-col gap-1 min-w-[180px] ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                onClick={(e) => e.stopPropagation()}
              >
                {isUser ? (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); onUnsend(msg.id, "everyone"); setShowUnsendConfirm(false); setShowActions(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${isDarkMode ? "hover:bg-gray-700 text-red-400" : "hover:bg-red-50 text-red-600"}`}
                    >
                      <span className="text-[11px] font-semibold">Unsend for everyone</span>
                      <BiSolidMessageRoundedMinus size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onUnsend(msg.id, "self"); setShowUnsendConfirm(false); setShowActions(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                      <span className="text-[11px] font-semibold">Remove for me</span>
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); onUnsend(msg.id, "self"); setShowUnsendConfirm(false); setShowActions(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${isDarkMode ? "hover:bg-gray-700 text-red-400" : "hover:bg-red-50 text-red-600"}`}
                  >
                    <span className="text-[11px] font-semibold">Delete for me</span>
                    <Trash2 size={16} />
                  </button>
                )}
                <div className={`h-[1px] w-full my-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`} />
                <button
                  onClick={(e) => { e.stopPropagation(); setShowUnsendConfirm(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${isDarkMode ? "hover:bg-gray-700 text-gray-500" : "hover:bg-gray-100 text-gray-500"}`}
                >
                  <span className="text-[11px] font-semibold">Cancel</span>
                  <X size={16} />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
