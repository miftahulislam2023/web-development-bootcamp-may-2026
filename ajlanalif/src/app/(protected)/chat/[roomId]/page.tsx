"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { LogoutButton } from "@/components/auth/logout-button";
import { getSocketClient } from "@/lib/socket/client";

type Message = {
  id: string;
  content: string;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
  author: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
};

type MessagesResponse = {
  messages: Message[];
  nextCursor: string | null;
};

type Room = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  memberCount: number;
};

type MyRoom = {
  joinedAt: string;
  room: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
  };
};

type RealtimeMessage = {
  id: string;
  content: string;
  roomId: string;
  createdAt: string;
  author: {
    id: string;
    username: string | null;
    image: string | null;
  };
};

type MessageEditedPayload = {
  messageId: string;
  content: string;
  editedAt: string;
  author: {
    id: string;
    username: string | null;
    image: string | null;
  };
};

type MessageDeletedPayload = {
  messageId: string;
  deletedAt: string;
};

type SocketConnectionState = "connected" | "connecting" | "reconnecting" | "disconnected";

type LoadMessagesOptions = {
  showLoading?: boolean;
  scrollToBottom?: boolean;
  preserveScrollPosition?: boolean;
  appendAtTop?: boolean;
  syncing?: boolean;
};

const socketStatusCopy: Record<SocketConnectionState, string> = {
  connected: "Connected",
  connecting: "Connecting...",
  reconnecting: "Reconnecting...",
  disconnected: "Disconnected",
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function RoomChatPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params.roomId;
  const { data: session, status } = useSession();

  const [room, setRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [myRooms, setMyRooms] = useState<MyRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [socketStatus, setSocketStatus] = useState<SocketConnectionState>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const editingMessageIdRef = useRef<string | null>(null);
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);
  const shouldStickToBottomRef = useRef(true);
  const reconnectToastVisibleRef = useRef(false);
  const isLoadingOlderRef = useRef(false);
  const topLoadArmedRef = useRef(true);

  useEffect(() => {
    editingMessageIdRef.current = editingMessageId;
  }, [editingMessageId]);

  useEffect(() => {
    isLoadingOlderRef.current = isLoadingOlder;
  }, [isLoadingOlder]);

  const joinedRoomIds = useMemo(() => new Set(myRooms.map((entry) => entry.room.id)), [myRooms]);

  function scrollMessagesToBottom(behavior: ScrollBehavior = "auto") {
    const viewport = messagesViewportRef.current;

    if (!viewport) {
      return;
    }

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior,
    });
  }

  function handleMessagesScroll() {
    const viewport = messagesViewportRef.current;

    if (!viewport) {
      return;
    }

    const distanceFromTop = viewport.scrollTop;
    const distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    shouldStickToBottomRef.current = distanceFromBottom < 120;

    if (distanceFromTop > 260) {
      topLoadArmedRef.current = true;
    }

    if (
      topLoadArmedRef.current &&
      distanceFromTop < 160 &&
      nextCursor &&
      messages.length > 0 &&
      !isLoadingOlderRef.current &&
      !isLoading
    ) {
      topLoadArmedRef.current = false;
      void loadOlderMessages();
    }
  }

  function normalizeMessages(entries: Message[]) {
    const seen = new Set<string>();
    const uniqueMessages: Message[] = [];

    for (const entry of entries) {
      if (seen.has(entry.id)) {
        continue;
      }

      seen.add(entry.id);
      uniqueMessages.push(entry);
    }

    return uniqueMessages;
  }

  async function loadOlderMessages() {
    if (!nextCursor || isLoadingOlderRef.current) {
      return;
    }

    isLoadingOlderRef.current = true;
    setIsLoadingOlder(true);
    await loadMessages(nextCursor, {
      appendAtTop: true,
      preserveScrollPosition: true,
    });
    setIsLoadingOlder(false);
    isLoadingOlderRef.current = false;
  }

  async function loadRoom() {
    setIsRoomLoading(true);
    setError(null);

    const response = await fetch(`/api/rooms/${roomId}`);

    if (response.status === 404) {
      setRoom(null);
      setIsRoomLoading(false);
      return;
    }

    if (response.status === 401 || response.status === 403) {
      const message = "You need to sign in again to continue.";
      setError(message);
      toast.error(message);
      setIsRoomLoading(false);
      return;
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ message: "Failed to load room." }));
      setError(payload.message ?? "Failed to load room.");
      toast.error(payload.message ?? "Failed to load room.");
      setIsRoomLoading(false);
      return;
    }

    const payload = (await response.json()) as Room;
    setRoom(payload);
    setIsRoomLoading(false);
  }

  async function loadSidebarData() {
    setIsSidebarLoading(true);

    try {
      const [roomsResponse, myRoomsResponse] = await Promise.all([fetch("/api/rooms"), fetch("/api/rooms/me")]);

      if (!roomsResponse.ok) {
        throw new Error("Failed to load rooms.");
      }

      if (!myRoomsResponse.ok) {
        throw new Error("Failed to load your room memberships.");
      }

      const roomsPayload = (await roomsResponse.json()) as Room[];
      const myRoomsPayload = (await myRoomsResponse.json()) as MyRoom[];

      setRooms(roomsPayload);
      setMyRooms(myRoomsPayload);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to load sidebar data.";
      toast.error(message);
    } finally {
      setIsSidebarLoading(false);
    }
  }

  async function loadMessages(cursor?: string, options: LoadMessagesOptions = {}) {
    if (options.showLoading) {
      setIsLoading(true);
    }

    if (options.syncing) {
      setIsSyncing(true);
    }

    const query = new URLSearchParams({
      roomId,
      limit: "20",
    });

    const viewport = messagesViewportRef.current;
    const previousScrollHeight = viewport?.scrollHeight ?? 0;
    const previousScrollTop = viewport?.scrollTop ?? 0;
    const shouldAutoScroll = options.scrollToBottom ?? shouldStickToBottomRef.current;

    if (cursor) {
      query.set("cursor", cursor);
    }

    const response = await fetch(`/api/messages?${query.toString()}`);

    if (response.status === 401 || response.status === 403) {
      const message = "You need to sign in again to view messages.";
      setError(message);
      toast.error(message);
      setIsLoading(false);
      setIsLoadingOlder(false);
      setIsSyncing(false);
      return;
    }

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ message: "Failed to fetch messages." }));
      setError(payload.message ?? "Failed to fetch messages.");
      toast.error(payload.message ?? "Failed to fetch messages.");
      setIsLoading(false);
      setIsLoadingOlder(false);
      setIsSyncing(false);
      return;
    }

    const payload = (await response.json()) as MessagesResponse;
    const orderedMessages = payload.messages.slice().reverse();
    const normalizedMessages = normalizeMessages(orderedMessages);

    setMessages((current) =>
      cursor || options.appendAtTop ? normalizeMessages([...normalizedMessages, ...current]) : normalizedMessages
    );
    setNextCursor(payload.nextCursor);
    setIsLoading(false);

    requestAnimationFrame(() => {
      const currentViewport = messagesViewportRef.current;

      if (!currentViewport) {
        setIsLoadingOlder(false);
        setIsSyncing(false);
        return;
      }

      if (cursor || options.appendAtTop) {
        const nextScrollHeight = currentViewport.scrollHeight;
        currentViewport.scrollTop = nextScrollHeight - previousScrollHeight + previousScrollTop;
      } else if (shouldAutoScroll) {
        scrollMessagesToBottom("auto");
      } else if (options.preserveScrollPosition) {
        currentViewport.scrollTop = previousScrollTop;
      }

      setIsLoadingOlder(false);
      setIsSyncing(false);
    });
  }

  useEffect(() => {
    setMessages([]);
    setNextCursor(null);
    setContent("");
    setEditingMessageId(null);
    setEditingContent("");
    setError(null);
    setSocketStatus("disconnected");
    setIsSyncing(false);
    setIsLoading(true);
    setIsLoadingOlder(false);
    topLoadArmedRef.current = true;
    setIsSidebarLoading(true);
    void loadRoom();
    void loadSidebarData();
  }, [roomId]);

  useEffect(() => {
    if (!room) {
      return;
    }

    void loadMessages(undefined, { showLoading: true, scrollToBottom: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    if (!room || status !== "authenticated" || !session?.user?.id) {
      return;
    }

    const socket = getSocketClient();

    const rejoinRoomAndSync = () => {
      socket.emit("authenticate", {
        userId: session.user.id,
      });
      socket.emit("join_room", roomId);
      void loadMessages(undefined, {
        preserveScrollPosition: true,
        scrollToBottom: shouldStickToBottomRef.current,
        syncing: true,
      });
    };

    const handleReceiveMessage = (message: RealtimeMessage) => {
      if (message.roomId !== roomId) {
        return;
      }

      const viewport = messagesViewportRef.current;
      const distanceFromBottom = viewport ? viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight : 0;
      const shouldScroll = distanceFromBottom < 120;

      setMessages((current) => {
        if (current.some((existingMessage) => existingMessage.id === message.id)) {
          return current;
        }

        return [
          ...current,
          {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            editedAt: null,
            deletedAt: null,
            author: {
              id: message.author.id,
              username: message.author.username,
              name: null,
              image: message.author.image,
            },
          },
        ];
      });

      if (shouldScroll) {
        requestAnimationFrame(() => scrollMessagesToBottom("smooth"));
      }
    };

    const handleMessageEdited = (payload: MessageEditedPayload) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === payload.messageId
            ? {
                ...message,
                content: payload.content,
                editedAt: payload.editedAt,
                deletedAt: null,
              }
            : message
        )
      );

      if (editingMessageIdRef.current === payload.messageId) {
        setEditingMessageId(null);
        setEditingContent("");
      }
    };

    const handleMessageDeleted = (payload: MessageDeletedPayload) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === payload.messageId
            ? {
                ...message,
                content: "[deleted]",
                deletedAt: payload.deletedAt,
              }
            : message
        )
      );

      if (editingMessageIdRef.current === payload.messageId) {
        setEditingMessageId(null);
        setEditingContent("");
      }
    };

    const handleConnect = () => {
      // eslint-disable-next-line no-console
      console.log("socket connect:", socket.id);
      setSocketStatus("connected");
      rejoinRoomAndSync();
    };

    const handleReconnect = (attemptNumber: number) => {
      // eslint-disable-next-line no-console
      console.log("socket reconnect:", attemptNumber, socket.id);
      setSocketStatus("connected");
      reconnectToastVisibleRef.current = false;
      toast.dismiss("socket-reconnecting");
      toast.success("Connection restored.");
      rejoinRoomAndSync();
    };

    const handleReconnectAttempt = (attemptNumber: number) => {
      // eslint-disable-next-line no-console
      console.log("socket reconnect_attempt:", attemptNumber);
      setSocketStatus("reconnecting");
      if (!reconnectToastVisibleRef.current) {
        reconnectToastVisibleRef.current = true;
        toast.loading("Reconnecting...", { id: "socket-reconnecting" });
      }
    };

    const handleConnectError = (error: Error) => {
      // eslint-disable-next-line no-console
      console.log("socket connect_error:", error.message);
      setSocketStatus("disconnected");
      const message = "Realtime connection issue. Retrying in the background.";
      setError(message);
      toast.error(message);
    };

    const handleDisconnect = (reason: string) => {
      // eslint-disable-next-line no-console
      console.log("socket disconnect:", reason);
      setSocketStatus("disconnected");
      if (reconnectToastVisibleRef.current) {
        toast.dismiss("socket-reconnecting");
      }
    };

    const handleSocketError = (payload: { message?: string }) => {
      if (payload.message) {
        setError(payload.message);
        toast.error(payload.message);
      }
    };

    setSocketStatus(socket.connected ? "connected" : "connecting");
    socket.on("connect", handleConnect);
    socket.on("reconnect", handleReconnect);
    socket.on("reconnect_attempt", handleReconnectAttempt);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_edited", handleMessageEdited);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("socket_error", handleSocketError);
    socket.connect();

    if (socket.connected) {
      rejoinRoomAndSync();
    }

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_edited", handleMessageEdited);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("socket_error", handleSocketError);
      socket.off("connect", handleConnect);
      socket.off("reconnect", handleReconnect);
      socket.off("reconnect_attempt", handleReconnectAttempt);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.emit("leave_room", roomId);
      socket.disconnect();
      toast.dismiss("socket-reconnecting");
      reconnectToastVisibleRef.current = false;
    };
  }, [room, roomId, session?.user?.id, status]);

  async function sendMessage() {
    if (!content.trim()) {
      return;
    }

    const shouldScroll = shouldStickToBottomRef.current;
    const socket = getSocketClient();
    socket.emit("send_message", {
      roomId,
      content,
    });

    setContent("");

    if (shouldScroll) {
      requestAnimationFrame(() => scrollMessagesToBottom("smooth"));
    }
  }

  async function onSendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setError(null);

    await sendMessage();
    setIsSending(false);
  }

  function startEditing(message: Message) {
    setEditingMessageId(message.id);
    setEditingContent(message.content);
  }

  function cancelEditing() {
    setEditingMessageId(null);
    setEditingContent("");
  }

  function saveEdit(messageId: string) {
    if (!editingContent.trim()) {
      return;
    }

    const socket = getSocketClient();
    socket.emit("edit_message", {
      messageId,
      content: editingContent,
    });

    toast.success("Message updated.");

    cancelEditing();
  }

  function deleteMessage(messageId: string) {
    const socket = getSocketClient();
    socket.emit("delete_message", {
      messageId,
    });

    toast.success("Message deleted.");
  }

  const connectedRooms = useMemo(
    () =>
      rooms
        .filter((entry) => joinedRoomIds.has(entry.id) || entry.id === room?.id)
        .sort((left, right) => Number(right.id === room?.id) - Number(left.id === room?.id)),
    [joinedRoomIds, room?.id, rooms]
  );

  const socketStatusTone: Record<SocketConnectionState, string> = {
    connected: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
    connecting: "border-cyan-400/20 bg-cyan-400/10 text-cyan-100",
    reconnecting: "border-amber-400/20 bg-amber-400/10 text-amber-100",
    disconnected: "border-rose-400/20 bg-rose-400/10 text-rose-100",
  };

  const avatarLabel = (name: string | null | undefined) => (name?.trim().charAt(0) ?? "?").toUpperCase();

  if (isRoomLoading) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-center rounded-[28px] border border-cyan-400/12 bg-slate-950/75 px-6 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Loading room</p>
            <p className="mt-3 text-sm text-slate-300">Preparing the conversation space...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-center rounded-[28px] border border-cyan-400/12 bg-slate-950/75 px-6 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="max-w-md text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Room unavailable</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50">Room not found</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">The requested room does not exist or you no longer have access to it.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link href="/chat" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                Back to rooms
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid flex-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-cyan-400/12 bg-slate-950/75 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Room</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">{room.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{room.description ?? "No description available."}</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${socketStatusTone[socketStatus]}`}>
              {socketStatusCopy[socketStatus]}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Members</p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">{room.memberCount}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Messages</p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">{messages.length}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-300">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Quick links</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/chat" className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900">
                Rooms
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Joined rooms</h3>
              <Link href="/chat" className="text-xs font-medium text-cyan-200 hover:text-cyan-100">
                Browse all
              </Link>
            </div>

            {isSidebarLoading ? (
              <div className="mt-4 space-y-3">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="h-16 animate-pulse rounded-2xl border border-white/5 bg-white/5" />
                ))}
              </div>
            ) : null}

            {!isSidebarLoading && connectedRooms.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-cyan-400/15 bg-slate-900/50 p-4 text-sm text-slate-400">
                You have not joined any rooms yet.
              </div>
            ) : null}

            {!isSidebarLoading && connectedRooms.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {connectedRooms.map((connectedRoom) => {
                  const isActive = connectedRoom.id === room.id;

                  return (
                    <li key={connectedRoom.id}>
                      <Link
                        href={`/chat/${connectedRoom.id}`}
                        className={`block rounded-2xl border px-4 py-3 transition ${
                          isActive
                            ? "border-cyan-300/30 bg-cyan-400/10 text-slate-50"
                            : "border-white/5 bg-white/5 text-slate-200 hover:border-cyan-400/20 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate text-sm font-medium">{connectedRoom.name}</span>
                          {isActive ? (
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                              Active
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                          {connectedRoom.description ?? "No description"}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col overflow-visible rounded-[28px] border border-cyan-400/12 bg-slate-950/75 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:overflow-hidden">
          <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-white/5 bg-slate-950/90 px-5 py-5 backdrop-blur-xl sm:px-6 lg:static lg:bg-transparent lg:backdrop-blur-0 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Live conversation</p>
              <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-50">{room.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{room.description ?? "No room description provided."}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${socketStatusTone[socketStatus]}`}>
                {socketStatusCopy[socketStatus]}
              </span>
              <Link href="/chat" className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900">
                Back to rooms
              </Link>
            </div>
          </header>

          {error ? (
            <div className="border-b border-rose-400/15 bg-rose-400/10 px-5 py-3 text-sm text-rose-100 sm:px-6">
              {error}
            </div>
          ) : null}

          <div className="flex min-h-0 flex-1 flex-col">
            <div
              ref={messagesViewportRef}
              onScroll={handleMessagesScroll}
              className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6"
            >
              {isSyncing ? (
                <div className="mb-4 flex justify-center">
                  <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
                    Syncing latest messages...
                  </span>
                </div>
              ) : null}

              {nextCursor ? (
                <div className="mb-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      void loadOlderMessages();
                    }}
                    disabled={isLoadingOlder}
                    className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoadingOlder ? "Loading older messages..." : "Load older messages"}
                  </button>
                </div>
              ) : null}

              {isLoading ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-white/5 bg-white/5 text-center">
                  <div>
                    <p className="text-sm font-medium text-slate-100">Loading messages...</p>
                    <p className="mt-1 text-xs text-slate-400">Pulling the latest conversation history.</p>
                  </div>
                </div>
              ) : null}

              {!isLoading && messages.length === 0 ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-cyan-400/15 bg-slate-900/50 text-center">
                  <div>
                    <p className="text-sm font-medium text-slate-100">No messages yet</p>
                    <p className="mt-1 text-xs text-slate-400">Send the first message to start the room.</p>
                  </div>
                </div>
              ) : null}

              {!isLoading && messages.length > 0 ? (
                <ul className="space-y-3">
                  {messages.map((message) => {
                    const isOwnMessage = message.author.id === session?.user?.id;
                    const isEditingThisMessage = editingMessageId === message.id;
                    const displayName = message.author.username ?? message.author.name ?? "Unknown";

                    return (
                      <li key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                        <article
                          className={`max-w-[92%] rounded-3xl border px-4 py-3 shadow-lg sm:max-w-[78%] ${
                            isOwnMessage
                              ? "border-cyan-300/20 bg-gradient-to-br from-cyan-400/18 to-sky-500/10 text-slate-50"
                              : "border-white/6 bg-slate-900/80 text-slate-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isOwnMessage ? "bg-cyan-400/20 text-cyan-100" : "bg-white/10 text-slate-200"}`}>
                                {avatarLabel(displayName)}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-100">{displayName}</p>
                                <p className="text-[11px] text-slate-400">{formatTimestamp(message.createdAt)}</p>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em]">
                              {message.editedAt ? (
                                <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 text-cyan-100">Edited</span>
                              ) : null}
                              {message.deletedAt ? (
                                <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-2 py-1 text-amber-100">Deleted</span>
                              ) : null}
                            </div>
                          </div>

                          {isEditingThisMessage ? (
                            <div className="mt-4 space-y-3">
                              <textarea
                                value={editingContent}
                                onChange={(event) => setEditingContent(event.target.value)}
                                className="block w-full rounded-2xl border border-cyan-400/10 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                                rows={3}
                              />
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => saveEdit(message.id)}
                                  className="rounded-full bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEditing}
                                  className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className={`mt-3 text-sm leading-6 ${message.deletedAt ? "italic text-slate-400" : "text-slate-100"}`}>
                              {message.deletedAt ? "This message was deleted." : message.content}
                            </p>
                          )}

                          {isOwnMessage && !message.deletedAt && !isEditingThisMessage ? (
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => startEditing(message)}
                                className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteMessage(message.id)}
                                className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/15"
                              >
                                Delete
                              </button>
                            </div>
                          ) : null}
                        </article>
                      </li>
                    );
                  })}
                </ul>
              ) : null}

              {!isLoading && !isLoadingOlder && !isSyncing && socketStatus === "disconnected" ? (
                <div className="mt-4 rounded-2xl border border-rose-400/15 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  Connection interrupted. The app will retry automatically.
                </div>
              ) : null}
            </div>

            <form onSubmit={onSendMessage} className="border-t border-white/5 bg-slate-950/90 p-4 sm:p-5">
              <label htmlFor="content" className="text-sm font-semibold text-slate-100">
                New message
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                className="mt-2 block w-full rounded-2xl border border-cyan-400/10 bg-slate-900/80 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                rows={3}
                placeholder="Write a message..."
                required
                disabled={isSending || socketStatus === "disconnected"}
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400">Press Enter to send, Shift + Enter for a new line.</p>
                <button
                  type="submit"
                  disabled={isSending || socketStatus === "disconnected"}
                  className="rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
