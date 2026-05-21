import { useEffect, useRef, useState, useCallback } from "react";
import MessageItem from "./MessageItem";
import { TbMessageDown } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { CiUnread } from "react-icons/ci";

export default function MessageList({ messages, onReaction, onUnsend, onReply, onEdit, isDarkMode, isLoading, chatType, chatName, chatId, isTyping, typingName, unreadCount = 0 }) {
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isInitialMount = useRef(true);
  const userHasScrolled = useRef(false);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (scrollRef.current) {
      if (behavior === "smooth") {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth"
        });
      } else {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, []);

  // Check scroll position to show/hide button
  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const hasScrollbar = scrollHeight > clientHeight + 10;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      
      setShowScrollButton(hasScrollbar && !isNearBottom);

      // If the user manually scrolled up during initial mount window, stop auto-scrolling
      if (isInitialMount.current && !isNearBottom && hasScrollbar) {
        userHasScrolled.current = true;
      }
    }
  }, []);

  // Handle scroll events
  const handleScroll = () => {
    checkScroll();
  };

  // Use ResizeObserver to detect when content height changes (e.g. images loading)
  // and auto-scroll to bottom during the initial load window
  useEffect(() => {
    if (isLoading || !scrollRef.current) return;

    // Reset flags on mount
    isInitialMount.current = true;
    userHasScrolled.current = false;

    // Immediate scroll
    scrollToBottom();

    // ResizeObserver watches for content height changes (images loading, etc.)
    const observer = new ResizeObserver(() => {
      if (isInitialMount.current && !userHasScrolled.current) {
        scrollToBottom();
      }
      checkScroll();
    });

    // Observe the scroll container's children for size changes
    if (scrollRef.current) {
      observer.observe(scrollRef.current);
      // Also observe each child for individual image loads etc.
      const children = scrollRef.current.children;
      for (let i = 0; i < children.length; i++) {
        observer.observe(children[i]);
      }
    }

    // Stop auto-scrolling after 3 seconds (layout should be settled by then)
    const stopTimer = setTimeout(() => {
      isInitialMount.current = false;
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(stopTimer);
    };
  }, [isLoading, scrollToBottom]);

  // Scroll to bottom when new messages are added (not initial load)
  useEffect(() => {
    if (!isLoading && !isInitialMount.current) {
      scrollToBottom();
      setTimeout(checkScroll, 100); // Give layout a moment to update
    }
  }, [messages.length, isLoading, scrollToBottom, checkScroll]);

  // Scroll to bottom when typing indicator appears
  useEffect(() => {
    if (isTyping) {
      scrollToBottom();
    }
  }, [isTyping, scrollToBottom]);

  return (
    <div className="flex-1 relative min-h-0">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className={`h-full overflow-y-auto px-4 md:px-6 lg:px-10 py-6 flex flex-col gap-0 custom-scrollbar transition-colors duration-300 ${
        isDarkMode ? "bg-transparent" : "bg-transparent"
      }`}>
        {!isLoading && messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className={`px-8 py-6 rounded-3xl shadow-xl flex flex-col items-center gap-4 text-center max-w-xs border transition-colors ${
                 chatId > 6
                   ? (isDarkMode ? "bg-gray-800/40 border-gray-700/30" : "bg-gray-50/90 border-gray-200 shadow-gray-200/20")
                   : (isDarkMode 
                       ? "bg-gray-800/60 border-gray-700/50 backdrop-blur-md" 
                       : "bg-white/90 border-blue-50 shadow-blue-900/5")
               }`}
             >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-1 ${
                  chatId > 6
                    ? (isDarkMode ? "bg-gray-700/50 text-gray-400" : "bg-gray-100 text-gray-400")
                    : (isDarkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600")
                }`}>
                   <TbMessageDown size={32} className="opacity-80" />
                </div>
                <h3 className={`text-lg font-bold ${
                  chatId > 6
                    ? (isDarkMode ? "text-gray-300" : "text-gray-600")
                    : (isDarkMode ? "text-white" : "text-blue-900")
                }`}>
                  {chatId > 6 ? "No Activity" : "New Conversation"}
                </h3>
                <p className={`text-xs font-medium leading-relaxed ${
                  chatId > 6
                    ? (isDarkMode ? "text-gray-500" : "text-gray-400")
                    : (isDarkMode ? "text-blue-300/70" : "text-blue-600/70")
                }`}>
                   {chatId > 6 ? "Start a new conversation!" : <>Start a new chat with <span className="font-bold underline decoration-blue-500/30">{chatName}</span></>}
                </p>
             </motion.div>
          </div>
        )}

        {isLoading && messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm border backdrop-blur-sm ${
                isDarkMode 
                  ? "bg-gray-800/40 border-gray-700/50 text-gray-300" 
                  : "bg-white/60 border-blue-50 text-blue-800/70"
              }`}
            >
              <span className="text-sm font-semibold tracking-wide">Loading your messages</span>
              <div className={`w-4 h-4 border-2 rounded-full animate-spin ${isDarkMode ? "border-blue-400/30 border-t-blue-400" : "border-blue-600/30 border-t-blue-600"}`} />
            </motion.div>
          </div>
        )}

        <div ref={contentRef}>
          {messages.map((msg, index) => {
            const prevMsg = messages[index - 1];
            const showDate = !prevMsg || prevMsg.date !== msg.date;
            const lastOutgoingId = [...messages].reverse().find(m => m.sender === 'user')?.id;
            const isLastOutgoing = msg.id === lastOutgoingId;

            // Show unread divider before the first unread message from the other person
            const unreadStartIndex = unreadCount > 0 ? messages.length - unreadCount : -1;
            const showUnreadDivider = unreadCount > 0 && index === unreadStartIndex && msg.sender !== 'user';

            return (
              <div key={msg.id} className={`w-full ${prevMsg && prevMsg.sender !== msg.sender ? "mt-5" : ""}`}>
                {showUnreadDivider && (
                  <div className="flex justify-center my-6 animate-in fade-in zoom-in duration-500">
                    <div className={`px-4 py-2 rounded-2xl shadow-lg border flex items-center gap-2.5 ${
                      isDarkMode
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                        : "bg-blue-50 border-blue-100 text-blue-600 shadow-blue-900/5"
                    }`}>
                      <div className={`p-1 rounded-lg ${isDarkMode ? "bg-blue-500/20" : "bg-white shadow-sm"}`}>
                        <CiUnread size={18} />
                      </div>
                      <span className="text-[11px] font-bold tracking-tight uppercase">
                        {unreadCount} Unread
                      </span>
                    </div>
                  </div>
                )}
                {showDate && msg.date && (
                  <div className="flex justify-center my-6">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-sm border z-10 ${
                      isDarkMode
                        ? "bg-[#1a202c] border-gray-700 text-gray-300"
                        : "bg-white border-gray-100 text-gray-400"
                    }`}>
                      {msg.date}
                    </span>
                  </div>
                )}
                <MessageItem
                  msg={msg}
                  onReaction={onReaction}
                  onUnsend={onUnsend}
                  onReply={onReply}
                  onEdit={onEdit}
                  isDarkMode={isDarkMode}
                  isLastOutgoing={isLastOutgoing}
                  chatType={chatType}
                />
              </div>
            );
          })}
        </div>

        {/* Typing Indicator - inside scroll area so it appears after messages */}
        {isTyping && (
          <div className="px-2 pt-1 pb-2 flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl rounded-tl-none text-xs shadow-sm border ${isDarkMode ? "bg-[#2d3748] border-gray-700 text-gray-400" : "bg-white border-gray-100 text-gray-500"}`}>
              <span className="font-medium">{typingName} is typing</span>
              <span className="flex gap-[3px] items-center">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? "bg-gray-400" : "bg-gray-400"} animate-bounce`}
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Scroll to Bottom Button */}      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.3, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              mass: 0.8
            }}
            onClick={() => scrollToBottom("smooth")}
            className={`absolute bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center shadow-xl z-50 active:scale-90 cursor-pointer border ${
              isDarkMode 
                ? "bg-gray-900 text-blue-400 border-gray-700 hover:bg-black" 
                : "bg-white text-blue-600 border-gray-100 hover:bg-slate-50 hover:shadow-2xl"
            }`}
          >
            <TbMessageDown size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
