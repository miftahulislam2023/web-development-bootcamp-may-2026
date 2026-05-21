import { useEffect, useRef } from "react";

const MessageList = ({ messages, typingUser }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUser]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#eef1f6]">
      {messages.map((msg, index) => {
        const senderId = msg.senderId?._id || msg.senderId;

        const isMyMessage = senderId === (currentUser?._id || currentUser?.id);

        return (
          <div
            key={index}
            className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}
          >
            <div
              className={`
                chat-bubble
                wrap-break-words
                max-w-[75%]
                shadow-sm
                ${
                  isMyMessage
                    ? "bg-[#5b34f2] text-white"
                    : "bg-white text-black"
                }
              `}
            >
              <p className="leading-relaxed">{msg.text}</p>

              <div className="flex items-center justify-between gap-2 mt-2">
                <span className="text-[10px] opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {isMyMessage && msg.seen && (
                  <span className="text-[10px] text-green-200">Seen</span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* TYPING INDICATOR */}
      {typingUser && (
        <div className="chat chat-start">
          <div className="chat-bubble bg-white shadow-sm">
            <span className="loading loading-dots loading-sm"></span>
          </div>
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>
  );
};

export default MessageList;
