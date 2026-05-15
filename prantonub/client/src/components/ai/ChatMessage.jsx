// client/src/components/ai/ChatMessage.jsx

/**
 * Renders a single chat message bubble.
 * Supports user messages (right-aligned) and AI messages (left-aligned).
 * Parses markdown: **bold**, bullet points, numbered lists, headers, line breaks.
 * ✅ XSS-safe: no dangerouslySetInnerHTML — uses React elements instead.
 */

// ✅ Safely parse bold **text** without dangerouslySetInnerHTML
const parseBold = (text) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
};

const formatText = (text) => {
  const lines = text.split("\n");

  return lines.map((line, i) => {
    const trimmed = line.trim();

    // Empty line → small spacer
    if (trimmed === "") return <div key={i} className="h-2" />;

    // Bullet point — starts with - or •
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      const content = trimmed.slice(2);
      return (
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="text-violet-400 mt-0.5 flex-shrink-0 font-bold">
            •
          </span>
          <span>{parseBold(content)}</span>
        </div>
      );
    }

    // Numbered list — starts with 1. 2. etc
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      return (
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="text-violet-400 mt-0.5 flex-shrink-0 font-semibold min-w-[16px]">
            {numberedMatch[1]}.
          </span>
          <span>{parseBold(numberedMatch[2])}</span>
        </div>
      );
    }

    // Header — starts with ### or ##
    if (trimmed.startsWith("### ")) {
      return (
        <div
          key={i}
          className="font-bold text-gray-900 dark:text-white mt-2 mb-1"
        >
          {parseBold(trimmed.slice(4))}
        </div>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <div
          key={i}
          className="font-bold text-gray-900 dark:text-white mt-2 mb-1 text-base"
        >
          {parseBold(trimmed.slice(3))}
        </div>
      );
    }

    // Normal line
    return (
      <div key={i} className="leading-relaxed">
        {parseBold(line)}
      </div>
    );
  });
};

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex items-end gap-2 max-w-[80%]">
          <div className="bg-violet-600 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm">
            {message.content}
          </div>
          {/* User avatar */}
          <div className="w-7 h-7 rounded-full bg-violet-200 dark:bg-violet-900 flex items-center justify-center text-violet-700 dark:text-violet-300 text-xs font-bold flex-shrink-0">
            U
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-end gap-2 max-w-[85%]">
        {/* AI avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
          AI
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-gray-800 dark:text-gray-200 leading-relaxed shadow-sm">
          {formatText(message.content)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
