"use client";

import { useState, useRef, useEffect } from "react";
import { Smile, Send, Plus, Image as ImageIcon, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useOutsideClick from "@/hooks/useOutsideClick";
import { X, Loader2, Pencil } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

export default function ChatInput({ onSend, onTyping, isDarkMode, isLoading, replyingTo, onCancelReply, editingMsg, onCancelEdit, onEditSubmit, chatId }) {
  const [inputText, setInputText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  // const audioInputRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef(null);
  const emojiRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("messageFile", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res?.[0]) {
        const file = res[0];
        // v7 uses ufsUrl, fallback to url for older versions
        const url = file.ufsUrl || file.url || file.appUrl;
        const isImage = file.name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || file.type?.startsWith("image/");
        onSend(url, isImage ? "image" : "file");
      }
    },
    onUploadError: (error) => {
      setIsUploading(false);
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  useOutsideClick(optionsRef, () => {
    if (showOptions) setShowOptions(false);
  });

  useOutsideClick(emojiRef, () => {
    if (showEmojiPicker) setShowEmojiPicker(false);
  });

  // Auto focus input when loading finishes or chat changes
  useEffect(() => {
    if (!isLoading && inputRef.current && !editingMsg) {
      inputRef.current.focus();
    }
  }, [isLoading, chatId, editingMsg]);

  // Set input text when editing a message
  useEffect(() => {
    if (editingMsg) {
      setInputText(editingMsg.content);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setInputText("");
    }
  }, [editingMsg]);

  // Auto-resize textarea when text changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const commonEmojis = ["😊", "😂", "❤️", "😍", "👍", "🙏", "😮", "😢", "🔥", "✨", "💯", "🎉", "🤝", "🙌", "😎", "🤔"];

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    if (editingMsg) {
      onEditSubmit && onEditSubmit(inputText);
    } else {
      onSend(inputText);
    }
    
    setInputText("");
    setShowEmojiPicker(false);
    onTyping && onTyping(false);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        await startUpload(files);
    }
  };

  const options = [
    { icon: <ImageIcon size={16} />, label: "Image", color: "bg-purple-500", onClick: handleGalleryClick },
    { icon: <FileText size={16} />, label: "Document", color: "bg-blue-500", onClick: () => docInputRef.current?.click() },
  ];

  return (
    <div className={`px-2 md:px-4 py-3 z-40 md:z-50 transition-colors duration-300 border-t backdrop-blur-md relative ${isDarkMode ? "bg-[#1a202c]/80 border-gray-700" : "bg-white/80 border-gray-200"}`}>
      
      {/* Options Tooltip/Menu */}
      <AnimatePresence>
        {showOptions && (
          <motion.div 
            ref={optionsRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute bottom-20 left-4 w-40 z-[60] rounded-2xl shadow-2xl p-1.5 border ${
              isDarkMode ? "bg-[#2d3748] border-gray-700" : "bg-white border-gray-100"
            }`}
          >
            {options.map((option, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  option.onClick();
                  setShowOptions(false);
                }}
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${option.color}`}>
                  {option.icon}
                </div>
                <span className={`text-[13px] font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker Popup */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div 
            ref={emojiRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute bottom-20 left-10 w-64 z-30 rounded-2xl shadow-2xl p-3 border ${
              isDarkMode ? "bg-[#2d3748] border-gray-700" : "bg-white border-gray-100"
            }`}
          >
            <div className="grid grid-cols-4 gap-2">
              {commonEmojis.map((emoji, idx) => (
                <button 
                  key={idx}
                  onClick={() => addEmoji(emoji)}
                  className={`text-2xl p-2 rounded-xl transition-transform hover:scale-125 active:scale-95 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {replyingTo && !editingMsg && (
        <div className={`mb-2 px-3 py-2 rounded-xl flex items-center justify-between border-l-4 border-blue-500 ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-blue-50 text-gray-700"}`}>
          <div className="flex flex-col text-sm truncate pr-4">
            <span className="font-semibold text-blue-500 text-xs">Replying to {replyingTo.senderName || replyingTo.sender}</span>
            <span className="truncate">{replyingTo.content}</span>
          </div>
          <button onClick={onCancelReply} className={`p-1 rounded-full transition-colors ${isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-500"}`}>
            <X size={16} />
          </button>
        </div>
      )}

      {editingMsg && (
        <div className={`mb-2 px-3 py-2 rounded-xl flex items-center justify-between border-l-4 border-yellow-500 ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-yellow-50 text-gray-700"}`}>
          <div className="flex flex-col text-sm truncate pr-4">
            <span className="font-semibold text-yellow-600 text-xs flex items-center gap-1"><Pencil size={12}/> Editing message</span>
            <span className="truncate opacity-70">{editingMsg.content}</span>
          </div>
          <button onClick={onCancelEdit} className={`p-1 rounded-full transition-colors ${isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-500"}`}>
            <X size={16} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        {/* Plus and Gallery Buttons */}
        <div className="flex items-center">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className={`p-2 rounded-full transition-all duration-300 ${
              showOptions ? "rotate-45" : ""
            } ${isDarkMode ? "text-[#8ac3ef] hover:bg-gray-800" : "text-[#36649f] hover:bg-gray-100"}`}
          >
            <Plus size={24} />
          </button>
          
          <button 
            onClick={handleGalleryClick}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? "text-gray-500 hover:text-[#8ac3ef] hover:bg-gray-800" : "text-gray-400 hover:text-[#36649f] hover:bg-gray-100"
            }`}
          >
            <ImageIcon size={22} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
          <input 
            type="file" 
            ref={docInputRef} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
          />
        </div>

        {/* Input Wrapper */}
        <div className={`flex-1 min-w-0 flex items-center gap-2 px-3 md:px-4 py-2 rounded-2xl transition-colors border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"}`}>
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-1 flex-shrink-0 rounded-full transition-colors ${
              showEmojiPicker ? "text-blue-500" : (isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700")
            }`}
          >
            <Smile size={20} />
          </button>
          
          <textarea 
            ref={inputRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              onTyping && onTyping(e.target.value.length > 0);
            }}
            onKeyDown={(e) => {
              if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className={`flex-1 bg-transparent border-none outline-none resize-none max-h-[120px] py-1 text-sm placeholder-gray-400 custom-scrollbar ${isDarkMode ? "text-white" : "text-gray-900"}`}
            rows={1}
            style={{ minHeight: '28px' }}
          />
        </div>

        {/* Action Button: Send only */}
        <div className="flex items-center gap-1 shrink-0">
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isUploading}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
              inputText.trim() 
                ? "bg-[#36649f] text-white shadow-md hover:bg-blue-600" 
                : (isDarkMode ? "text-gray-600 cursor-not-allowed" : "text-gray-300 cursor-not-allowed")
            }`}
          >
            {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
