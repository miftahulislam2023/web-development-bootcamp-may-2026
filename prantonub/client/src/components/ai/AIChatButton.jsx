// client/src/components/ai/AIChatButton.jsx
// Floating action button — place this inside your Layout.jsx

import { useState } from "react";
import AIChatModal from "./AIChatModal";
import { Bot } from "lucide-react";

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {/* Floating button — fixed bottom-right corner */}
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          fixed bottom-6 right-6 z-40
          w-14 h-14 rounded-2xl
          bg-gradient-to-br from-violet-500 to-purple-600
          hover:from-violet-600 hover:to-purple-700
          text-white shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-300
          hover:scale-110 active:scale-95
          ${isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100"}
        `}
        title="Ask AI Assistant"
        aria-label="Open AI Financial Assistant"
      >
        {/* Pulse ring animation */}
        <span className="absolute inset-0 rounded-2xl bg-violet-500 animate-ping opacity-20" />
        <Bot className="w-6 h-6" />
      </button>

      {/* ✅ Fixed tooltip — uses state instead of broken group-hover */}
      {!isOpen && showTooltip && (
        <div className="fixed bottom-8 right-24 z-40 pointer-events-none">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            AI Assistant
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isOpen && <AIChatModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default AIChatButton;
