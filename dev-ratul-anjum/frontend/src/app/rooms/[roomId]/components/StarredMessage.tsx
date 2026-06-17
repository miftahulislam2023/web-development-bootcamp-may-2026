import { Star, User } from "lucide-react";
import Image from "next/image";

const StarredMessage = ({ item, currentUserId }: StarredMessageRowData) => {
  const msg = item;
  const isSentByMe = msg.sender.id === currentUserId;

  const imageAttachments = msg.attachments;
  return (
    <li
      key={msg.id}
      className="group hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
    >
      <article className="flex items-start p-3 sm:p-4 gap-3">
        {/* Avatar Area */}
        <aside className="shrink-0 mt-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {msg.sender.photo ? (
              <Image
                src={msg.sender.photo}
                alt={msg.sender.name}
                className="w-full h-full object-cover"
                width={40}
                height={40}
              />
            ) : (
              <User className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current" />
            )}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Header: Sender > Receiver + Date */}
          <div className="flex justify-between items-baseline mb-1">
            <h2 className="text-sm sm:text-base font-normal text-gray-800 truncate pr-2">
              <span className={isSentByMe ? "font-medium" : ""}>
                {msg.sender.name}
              </span>
              <span className="text-gray-500 mx-1">▸</span>
              <span className={!isSentByMe ? "font-medium" : ""}>
                {msg.receiver.name}
              </span>
            </h2>
            <time className="text-xs text-gray-500 whitespace-nowrap shrink-0">
              {formatDateLabel(msg.updatedAt)}
            </time>
          </div>

          {/* Message Bubble + Chevron Container */}
          <div className="flex items-center justify-between gap-2">
            {/* Message Bubble */}
            <div
              className={`relative px-5 py-2 rounded-lg text-sm sm:text-[15px] leading-snug shadow-sm max-w-[85%] sm:max-w-[80%] ${isSentByMe ? "bg-[#d9fdd3]" : "bg-white border border-gray-100"}`}
            >
              {/* --- Image Grid Rendering --- */}
              {imageAttachments.length > 0 && (
                <div
                  className={`grid gap-1 rounded-lg overflow-hidden mb-5 shrink-0 ${imageAttachments.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
                >
                  {imageAttachments.map((url, idx) => (
                    <div className="flex justify-center" key={idx}>
                      <div className="w-full max-w-75 sm:max-w-100 h-auto rounded-lg overflow-hidden">
                        <Image
                          src={url}
                          alt="user-attachments"
                          width={400} // intrinsic width
                          height={300} // intrinsic height
                          style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "scale-down",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Text */}
              {msg.text && (
                <p className="text-gray-900 pb-4 wrap-break-word whitespace-pre-wrap">
                  {msg.text}
                </p>
              )}

              {/* Metadata: Star, Time */}
              <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[11px] text-gray-500 select-none">
                <Star className="w-3 h-3 fill-gray-500 text-gray-500" />
                <time>{formatTime(msg.updatedAt)}</time>
              </div>

              {/* Speech Bubble Arrow */}
              <div
                className={`absolute top-0 w-0 h-0 border-[6px] border-transparent ${isSentByMe ? "-right-1.5 border-l-[#d9fdd3] border-t-[#d9fdd3]" : "-left-1.5 border-r-white border-t-white"} `}
              />
            </div>
          </div>
        </div>
      </article>
    </li>
  );
};

export default StarredMessage;

// Helper to format time from updatedAt
const formatTime = (dateStr: string | Date) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// Helper to format date label
const formatDateLabel = (dateStr: string | Date) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString([], { weekday: "long" });
};

interface StarredMessageRowData {
  item: StarredMessageItem;
  currentUserId: string;
}

export interface StarredMessageItem {
  id: string;
  text: string | null;
  attachments: string[];
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    photo: string | null;
  };

  receiver: {
    id: string;
    name: string;
  };
}
