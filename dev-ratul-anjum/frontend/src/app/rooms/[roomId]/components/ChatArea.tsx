"use client";

import {
  ArrowLeft,
  Info,
  Phone,
  Search,
  UserIcon,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import Image from "next/image";
import Message from "./Message";
import ChatHeaderSkeleton from "./ChatHeaderSkeleton";
import MessageAreaSkeleton from "./MessageAreaSkeleton";
import ChatLoadingSpinner from "./ChatLoadingSpinner";
import { useSocket } from "@/providers/SocketProvider";
import { useRouter } from "next/navigation";
import useConversationMessages from "@/hooks/useConversationMessages";
import ChatActionsSidebar from "./ChatActionsSidebar";
import StarredMessages from "./StarredMessages";
import AllMedia from "./AllMedia";
import { useQuery } from "@tanstack/react-query";

const ChatArea = ({ conversationId }: { conversationId: string }) => {
  const router = useRouter();
  const socket = useSocket();
  const [newMessages, setNewMessages] = useState<MessageItem[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef(null);
  const [activeSidebarTab, setActiveSidebarTab] =
    useState<ActiveSidebarTab>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useConversationMessages(conversationId);

  const conversationParticipantId = data?.pages[0].data.participantId;

  const { data: blockInfo, isLoading: blockLoading } = useQuery({
    queryKey: ["block-info", conversationParticipantId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/v1/check-block/${conversationParticipantId}`,
        {
          credentials: "include",
        },
      );
      const result = await res.json();

      return result?.data;
    },
    enabled: !!conversationParticipantId,
  });

  useEffect(() => {
    const onIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };
    const observer = new IntersectionObserver(onIntersection);

    if (observer && loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    // cleanup
    return () => {
      if (observer) observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // join to the room
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("join-room", conversationId);

    return () => {
      socket.emit("leave-room", conversationId);
    };
  }, [socket, conversationId]);

  // listen new message
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (payload: MessageItem) => {
      setNewMessages((prev) => [payload, ...prev]);
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket]);

  const allMessages = useMemo(() => {
    const map = new Map<string, MessageItem>();
    newMessages.forEach((msg) => map.set(msg.id, msg));

    data?.pages.forEach((page) => {
      page.data.messages.forEach((msg: MessageItem) => map.set(msg.id, msg));
    });

    return Array.from(map.values());
  }, [data, newMessages]);

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center gap-6 text-center">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <X className="h-8 w-8 text-red-500" />
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            Conversation not found
          </h2>

          {/* Description */}
          <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
            This conversation may have been deleted or you don’t have access to
            it.
          </p>

          {/* Action */}
          <button
            onClick={() => router.push("/rooms")}
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
          >
            Back to conversations
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main
        id="main-chat-area"
        className={`relative z-0 flex h-full w-full flex-col bg-[#efeae2] bg-linear-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e5e7eb] 
        transition-opacity duration-300 ease-in-out ${activeSidebarTab ? "opacity-0 hidden lg:flex lg:flex-1 lg:opacity-100" : "opacity-100 flex flex-1"}`}
      >
        {/* Overlay for pattern contrast */}
        <div className="pointer-events-none absolute inset-0 z-[-1] bg-[#efeae2]/90"></div>

        {/* Chat Header */}
        {isLoading ? (
          <ChatHeaderSkeleton />
        ) : (
          <header className="z-10 flex h-15 w-full items-center justify-between border-b border-[#e9edef] bg-[#f0f2f5] px-4 py-2">
            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() => setActiveSidebarTab("contactInfo")}
            >
              {/* Back button for mobile */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/rooms");
                }}
                className="mr-1 text-[#54656f] md:hidden cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              {data?.pages[0].data.participantPhoto ? (
                <Image
                  src={data?.pages[0].data.participantPhoto}
                  alt="Current Chat"
                  className="h-10 w-10 rounded-full object-cover"
                  height={40}
                  width={40}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-white">
                  <UserIcon className="h-6 w-6" />
                </div>
              )}

              <div className="flex flex-col">
                <h2 className="text-base font-medium text-[#111b21]">
                  {data?.pages[0].data.participantName}
                </h2>
                {/* <p className="text-xs text-[#667781]">
                click here for contact info
              </p> */}
              </div>
            </div>
            <div className="flex items-center gap-5 text-[#54656f]">
              {/* <button>
                <Phone className="h-4 w-4" />
              </button>

              <button>
                <Video className="h-5 w-5" />
              </button>
              <button>
                <Search className="h-5 w-5" />
              </button> */}
              <button
                onClick={() => setActiveSidebarTab("contactInfo")}
                className="cursor-pointer"
              >
                <Info className="h-5 w-5" />
              </button>
            </div>
          </header>
        )}

        {/* Messages Area - Semantic: <section> */}
        {isLoading ? (
          <MessageAreaSkeleton />
        ) : (
          <section className="custom-scrollbar flex flex-1 flex-col-reverse gap-2 overflow-y-auto p-4 pb-0">
            <div ref={bottomRef} />
            {allMessages.map((msg: MessageItem) => (
              <Message
                key={msg.id}
                item={msg}
                conversationParticipantId={conversationParticipantId}
              />
            ))}

            {hasNextPage && <ChatLoadingSpinner ref={loaderRef} />}
          </section>
        )}

        {/* Chat Input Footer - Semantic: <footer> */}
        <ChatInput
          conversationId={conversationId}
          receiverId={conversationParticipantId}
          isLoading={blockLoading}
          data={blockInfo}
        />
      </main>

      {activeSidebarTab === "contactInfo" && (
        <ChatActionsSidebar
          activeSidebarTab={activeSidebarTab}
          setActiveSidebarTab={setActiveSidebarTab}
          conversationId={conversationId}
          data={blockInfo}
        />
      )}

      {activeSidebarTab === "starredMessages" && (
        <StarredMessages
          conversationId={conversationId}
          setActiveSidebarTab={setActiveSidebarTab}
        />
      )}

      {activeSidebarTab === "allMedia" && (
        <AllMedia
          conversationId={conversationId}
          setActiveSidebarTab={setActiveSidebarTab}
        />
      )}
    </>
  );
};

export default ChatArea;

interface MessageItem {
  id: string;
  text: string | null;
  attachments: string[];
  updatedAt: string;
  senderId: string;
  markAsStar: boolean;
}

export type ActiveSidebarTab =
  | null
  | "contactInfo"
  | "starredMessages"
  | "allMedia";
