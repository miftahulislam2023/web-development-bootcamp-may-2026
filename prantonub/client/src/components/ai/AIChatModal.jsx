// client/src/components/ai/AIChatModal.jsx

import { useState, useRef, useEffect } from "react";
import api from "../../api/axios";
import ChatMessage from "./ChatMessage";
import { Bot } from "lucide-react";

const QUICK_PROMPTS = [
  { icon: "📊", text: "Analyze my spending this month" },
  { icon: "💡", text: "Give me saving advice" },
  { icon: "🏆", text: "Which category am I spending most on?" },
  { icon: "📅", text: "Compare this month vs last month" },
  { icon: "⚠️", text: "Show my unusual expenses" },
  { icon: "📉", text: "How can I reduce my expenses?" },
];

const TypingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        AI
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  </div>
);

const AIChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const sendMessage = async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || loading) return;

    setInput("");
    setError("");

    const userMsg = { role: "user", content: messageText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const { data } = await api.post("/ai/chat", {
        message: messageText,
        history: messages,
      });

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.response },
      ]);
    } catch (err) {
      const errMsg =
        err.response?.data?.error || "Something went wrong. Please try again.";
      setError(errMsg);
      setMessages(messages);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
    inputRef.current?.focus();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full sm:w-[420px] h-[92vh] sm:h-[620px] bg-gray-50 dark:bg-gray-950 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm leading-none">
                FinanceHub AI
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                {/* ✅ Changed: Gemini → Groq */}
                <p className="text-xs text-gray-400">
                  Online · Powered by Groq
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Messages area ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                FinanceHub AI
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Ask me anything about your finances. I'll analyze your real data
                and give you personalized insights.
              </p>
              <div className="grid grid-cols-1 gap-2 w-full">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.text}
                    onClick={() => sendMessage(prompt.text)}
                    className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-gray-100 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 transition-all text-left group"
                  >
                    <span className="text-lg flex-shrink-0">{prompt.icon}</span>
                    <span className="group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                      {prompt.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isEmpty && (
            <div className="space-y-0">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {loading && <TypingIndicator />}
              {error && (
                <div className="flex justify-center mb-4">
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl text-sm max-w-[90%]">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Input area ── */}
        <div className="flex-shrink-0 px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          {!isEmpty && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_PROMPTS.slice(0, 3).map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => sendMessage(prompt.text)}
                  disabled={loading}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-gray-200 dark:border-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-300 hover:border-violet-200 dark:hover:border-violet-700 transition-all disabled:opacity-40 whitespace-nowrap"
                >
                  <span>{prompt.icon}</span>
                  <span>{prompt.text.split(" ").slice(0, 3).join(" ")}...</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your finances..."
              rows={1}
              disabled={loading}
              className="flex-1 resize-none border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent disabled:opacity-60 max-h-32 leading-relaxed transition-all"
              style={{ minHeight: "46px" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-11 h-11 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white disabled:text-gray-400 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 shadow-sm hover:shadow-md disabled:shadow-none"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* ✅ Changed: Gemini → Groq + Llama */}
          <p className="text-center text-xs text-gray-300 dark:text-gray-600 mt-2">
            Powered by Groq · Llama 3.3 · Analyzes your real transaction data
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatModal;
