import { CheckCheck, Star } from "lucide-react";
import Image from "next/image";
interface MessageRowData {
  item: MessageItem;
  conversationParticipantId: string;
}

interface MessageItem {
  id: string;
  text: string | null;
  attachments: string[];
  updatedAt: string;
  senderId: string;
  markAsStar: boolean;
}

const Message = ({ item, conversationParticipantId }: MessageRowData) => {
  const messageType = getMessageType(item);
  const isReceiver = conversationParticipantId === item.senderId;

  if (messageType === "TextOnly")
    return (
      <div className={`flex ${isReceiver ? "justify-start" : "justify-end"}`}>
        <div
          className={`rounded-lg shadow-sm p-2 max-w-[85%] sm:max-w-[60%] relative group ${isReceiver ? "rounded-tl-none bg-[#ffffff]" : "rounded-tr-none bg-[#d9fdd3]"}`}
        >
          <p className="text-sm text-gray-800 leading-relaxed px-1">
            {item.text}
          </p>
          <div
            className={`flex justify-end gap-1 mt-1 ${isReceiver ? "" : "items-center"}`}
          >
            {item.markAsStar && (
              <Star className="w-3 h-3 fill-gray-500 text-gray-500" />
            )}
            <span className="text-[10px] text-gray-500">{item.updatedAt}</span>

            {!isReceiver && (
              <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
            )}
          </div>
        </div>
      </div>
    );

  if (messageType === "SingleImageOnly")
    return (
      <div className={`flex ${isReceiver ? "justify-start" : "justify-end"}`}>
        <div
          className={`rounded-lg shadow-sm p-1 max-w-[85%] sm:max-w-82.5 relative group ${isReceiver ? "rounded-tl-none bg-[#ffffff]" : "rounded-tr-none bg-[#d9fdd3]"}`}
        >
          <div className="rounded-lg overflow-hidden relative">
            <div className="flex justify-center">
              <div className="w-full max-w-75 sm:max-w-100 h-auto rounded-lg overflow-hidden">
                <Image
                  src={item.attachments[0]}
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

            {/* <!-- Gradient overlay for time --> */}
            <div className="absolute bottom-0 w-full h-12 bg-linear-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 text-white/90">
              <span className="text-[10px] font-medium">{item.updatedAt}</span>
              {!isReceiver && (
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  if (messageType === "TextAndSingleImage")
    return (
      <div className={`flex ${isReceiver ? "justify-start" : "justify-end"}`}>
        <div
          className={`rounded-lg shadow-sm p-1 max-w-[85%] sm:max-w-82.5 relative group ${isReceiver ? "rounded-tl-none bg-[#ffffff]" : "rounded-tr-none bg-[#d9fdd3]"}`}
        >
          <div className="flex justify-center">
            <div className="w-full max-w-75 sm:max-w-100 h-auto rounded-lg overflow-hidden">
              <Image
                src={item.attachments[0]}
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
          <p className="text-sm text-gray-800 px-2 pb-1 pt-2">{item.text}</p>
          <div className="flex justify-end gap-1 mr-1 mb-0.5">
            <span className="text-[10px] text-gray-500">{item.updatedAt}</span>
          </div>
        </div>
      </div>
    );
  if (messageType === "TwoImagesAndText")
    return (
      <div className={`flex ${isReceiver ? "justify-start" : "justify-end"}`}>
        <div
          className={`rounded-lg shadow-sm p-1 max-w-[85%] sm:max-w-82.5 relative group ${isReceiver ? "rounded-tl-none bg-[#ffffff]" : "rounded-tr-none bg-[#d9fdd3]"}`}
        >
          <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden mb-1">
            <div className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={item.attachments[0]}
                alt="attachments-image"
                width={300} // intrinsic width
                height={200} // intrinsic height
                style={{ width: "100%", height: "100%" }} // fill parent div
              />
            </div>
            <div className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={item.attachments[1]}
                alt="attachments-image"
                width={300}
                height={200}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
          {item.text && (
            <p className="text-sm text-gray-800 px-2 pb-1 pt-2">{item.text}</p>
          )}
          <div className="flex justify-end gap-1 items-center px-1">
            <span className="text-[10px] text-gray-500">{item.updatedAt}</span>
            {!isReceiver && (
              <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
            )}
          </div>
        </div>
      </div>
    );

  if (messageType === "ThreeImagesAndText")
    return (
      <div className={`flex ${isReceiver ? "justify-start" : "justify-end"}`}>
        <div
          className={`rounded-lg shadow-sm p-1 max-w-[85%] sm:max-w-82.5 relative group ${isReceiver ? "rounded-tl-none bg-[#ffffff]" : "rounded-tr-none bg-[#d9fdd3]"}`}
        >
          <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
            {/* Top 2 images */}
            {[item.attachments[1], item.attachments[2]].map((src, i) => (
              <div
                key={i}
                className="relative w-full h-24 bg-gray-200 rounded-lg overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`attachment-${i}`}
                  width={300}
                  height={200}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            ))}

            {/* Bottom image full width */}
            <div className="col-span-2 relative w-full h-36 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={item.attachments[0]}
                alt="attachment-2"
                width={600}
                height={400}
                style={{ width: "100%", height: "100%" }}
              />

              {/* Gradient overlay for time */}
              <div className="absolute bottom-0 w-full h-10 bg-linear-to-t from-black/60 to-transparent"></div>

              {/* Timestamp */}
              {!item.text && (
                <div className="absolute bottom-1.5 right-2">
                  <span className="text-[10px] text-white/90 shadow-sm font-medium">
                    {item.updatedAt}
                  </span>
                </div>
              )}
            </div>
          </div>
          {item.text && (
            <>
              <p className="text-sm text-gray-800 px-2 pb-1 pt-2">
                {item.text}
              </p>

              <div className="flex justify-end gap-1 items-center px-1">
                <span className="text-[10px] text-gray-500">
                  {item.updatedAt}
                </span>
                {!isReceiver && (
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
};

export default Message;

function getMessageType(item: MessageItem) {
  const { text, attachments } = item;

  if (text && attachments.length === 0) return "TextOnly";
  else if (!text && attachments.length === 1) return "SingleImageOnly";
  else if (text && attachments.length === 1) return "TextAndSingleImage";
  else if (attachments.length === 2) return "TwoImagesAndText";
  else if (attachments.length === 3) return "ThreeImagesAndText";
  else return "Other";
}
