"use client";
import addMessage from "@/actions/addMessage";
import { useSocket } from "@/providers/SocketProvider";
import { Loader2, Plus, SendHorizontal, Smile, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import TypingIndicator from "./TypingIndicator";

const ChatInput = ({
  receiverId,
  conversationId,
  isLoading,
  data,
}: {
  receiverId: string;
  conversationId: string;
  isLoading: boolean;

  data: {
    isBlocked: boolean;
    blockedByMe: boolean;
    blockerName: string;
  };
}) => {
  const socket = useSocket();
  const [message, setMessage] = useState<string>("");
  const [attachments, setAttachments] = useState<
    { id: string; file: File; fileUrl: string; hasError: boolean }[]
  >([]);
  const [fileError, setFileError] = useState<{
    allowedType: string;
    maxSize: string;
  }>({ allowedType: "", maxSize: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleAddMessage = async () => {
    setLoading(true);
    const finalAttachments = attachments.map((atc) => atc.file);
    const result = await addMessage(
      receiverId,
      conversationId,
      message,
      finalAttachments,
    );

    if (result.success) {
      // emit the new message
      socket?.emit("add-message", {
        conversationId,
        newMessage: result.newMessage,
      });

      setLoading(false);
      setMessage("");
      attachments.forEach((atc) => {
        URL.revokeObjectURL(atc.fileUrl);
      });
      setAttachments([]);
    } else {
      setLoading(false);
      toast.error(result.message, {
        className:
          "bg-[#C53030] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const MAX_FILE_SIZE = 0.1 * 1024 * 1024; // 100kb
    const allowed_types = ["image/png", "image/jpeg", "image/jpg"];
    let isAllowedType: boolean = true;
    let isMaxFileSize: boolean = false;

    const newAttachments = Array.from(e.target.files).map((file) => {
      let hasError: boolean = false;

      if (!allowed_types.includes(file.type)) {
        hasError = true;
        isAllowedType = false;
      }

      if (file.size > MAX_FILE_SIZE) {
        hasError = true;
        isMaxFileSize = true;
      }

      const imageUrl = URL.createObjectURL(file);

      return {
        id: `${new Date().getTime()}${Math.random()}`,
        file,
        fileUrl: imageUrl,
        hasError,
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);

    setFileError((prev) => ({
      ...prev,
      ...(!isAllowedType
        ? { allowedType: "Only JPG, JPEG, and PNG image files are allowed." }
        : {}),

      ...(isMaxFileSize ? { maxSize: "Image must be under 100 KB." } : {}),
    }));

    e.target.value = "";
  };

  const handleRemoveFile = (id: string) => {
    let hasError: boolean = false;

    const newAttachments = attachments.filter((atc) => {
      if (atc.id === id) {
        URL.revokeObjectURL(atc.fileUrl);
        return false;
      }

      if (atc.hasError) {
        hasError = true;
      }

      return true;
    });
    setAttachments(newAttachments);
    if (!hasError) {
      setFileError({ allowedType: "", maxSize: "" });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;

    // reset height first (important)
    el.style.height = "auto";

    // set new height based on content
    el.style.height = el.scrollHeight + "px";

    setMessage(el.value);

    if (!isTyping) socket?.emit("start-typing", conversationId);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket?.emit("stop-typing", conversationId);
    }, 300);

    setMessage(e.target.value);
  };

  useEffect(() => {
    if (!socket) return;

    const handleStartTyping = () => {
      setIsTyping(true);
    };
    socket.on("start-typing", handleStartTyping);

    const handleStopTyping = () => {
      setIsTyping(false);
    };
    socket.on("stop-typing", handleStopTyping);

    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      socket.off("start-typing", handleStartTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [socket]);

  return (
    <>
      {isLoading || data === undefined ? (
        <div className="flex justify-center items-center w-full rounded-lg bg-gray-200 animate-pulse px-4 py-3 h-12 sm:h-14" />
      ) : data.isBlocked ? (
        <div className="flex flex-col justify-center items-center w-full rounded-lg bg-red-100 px-4 py-3 text-center text-sm text-red-700 font-medium sm:text-base">
          <span>
            {data?.blockedByMe ? "You" : data?.blockerName} blocked this
            contact. Messaging is disabled.
          </span>
          {data?.blockedByMe && (
            <span className="mt-1 text-xs text-red-600 sm:text-sm">
              To unblock, go to <span className="font-semibold">Settings</span>.
            </span>
          )}
        </div>
      ) : (
        <>
          {isTyping && <TypingIndicator />}
          {attachments.length > 0 && (
            <div
              id="preview-container"
              className="flex w-full px-4 pt-4 pb-2 gap-4 overflow-x-auto custom-scrollbar border-t border-gray-200 bg-[#f0f2f5]"
            >
              {attachments.map((atc) => (
                <div
                  key={atc.id}
                  className="flex flex-col items-center shrink-0 relative group"
                >
                  <div
                    className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 ${atc.hasError ? "border-red-500 bg-red-50" : "border-transparent bg-gray-100"}`}
                  >
                    <Image
                      src={atc.fileUrl}
                      className="h-full w-full object-cover"
                      alt="attachments-image"
                      height={80}
                      width={80}
                    />
                    {/*  Remove Button  */}
                    <button
                      className="absolute top-0.5 right-0.5 bg-gray-800/60 hover:bg-gray-800 text-white rounded-full p-0.5 transition-colors cursor-pointer z-10"
                      onClick={() => {
                        handleRemoveFile(atc.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/*  Error Message  */}
          {(fileError.allowedType ||
            fileError.maxSize ||
            attachments.length > 3) && (
            <span className="text-[12px] text-red-500 font-medium  px-4 bg-[#f0f2f5]">
              {fileError.allowedType && fileError.allowedType}{" "}
              {fileError.maxSize && fileError.maxSize}{" "}
              {attachments.length > 3 &&
                "You can upload up to 3 files at a time."}
            </span>
          )}
          <footer className="z-10 flex min-h-15 w-full items-center gap-4 bg-[#f0f2f5] px-4 py-2">
            {/* Attachment Menu Wrapper  */}

            <label
              htmlFor="file-input"
              className="text-[#54656f] hover:text-[#111b21] transition-transform duration-200 cursor-pointer"
            >
              <Plus className="h-6 w-6" />
            </label>

            {/* Hidden File Input  */}
            <input
              type="file"
              id="file-input"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e)}
            />

            <div className="flex flex-1 items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
              {/* <button className="text-[#54656f]">
                <Smile className="h-5 w-5" />
              </button> */}

              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => handleTextChange(e)}
                placeholder="Type a message"
                rows={1}
                className="max-h-50 min-h-6 h-auto flex-1 resize-none border-none bg-transparent py-1 text-sm outline-none placeholder-[#667781] custom-scrollbar leading-6"
              ></textarea>
            </div>
            {(message.trim() ||
              (attachments.length > 0 && attachments.length < 4)) &&
              !fileError.allowedType &&
              !fileError.maxSize && (
                <button
                  disabled={loading}
                  onClick={handleAddMessage}
                  className={`text-[#54656f] hover:text-[#111b21] ${
                    loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-[#00a884]" />
                  ) : (
                    <SendHorizontal className="h-6 w-6 text-[#00a884]" />
                  )}
                </button>
              )}
          </footer>{" "}
        </>
      )}
    </>
  );
};

export default ChatInput;
