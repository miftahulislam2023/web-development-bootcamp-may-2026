"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { LogoutButton } from "@/components/auth/logout-button";
import { getTotalUnreadCount, readDmUnreadCounts, readRoomUnreadCounts } from "@/lib/dm-unread";

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

export default function ChatPage() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [myRooms, setMyRooms] = useState<MyRoom[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dmUnreadByConversationId, setDmUnreadByConversationId] = useState<Record<string, number>>({});
  const [roomUnreadByRoomId, setRoomUnreadByRoomId] = useState<Record<string, number>>({});

  const joinedRoomIds = useMemo(() => new Set(myRooms.map((entry) => entry.room.id)), [myRooms]);

  async function loadData() {
    setIsLoading(true);
    setError(null);

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
      const message = caughtError instanceof Error ? caughtError.message : "Failed to load rooms.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    setDmUnreadByConversationId(readDmUnreadCounts());
    setRoomUnreadByRoomId(readRoomUnreadCounts());
  }, []);

  useEffect(() => {
    const totalUnread = getTotalUnreadCount({ dm: dmUnreadByConversationId, rooms: roomUnreadByRoomId });

    document.title = totalUnread > 0 ? `(${totalUnread}) Realtime Chat App` : "Realtime Chat App";

    return () => {
      document.title = "Realtime Chat App";
    };
  }, [dmUnreadByConversationId, roomUnreadByRoomId]);

  async function onCreateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ message: "Failed to create room." }));
      setError(payload.message ?? "Failed to create room.");
      toast.error(payload.message ?? "Failed to create room.");
      return;
    }

    toast.success("Room created.");
    setName("");
    setDescription("");
    await loadData();
  }

  async function joinRoom(roomId: string) {
    setError(null);
    setJoiningRoomId(roomId);

    try {
      const response = await fetch("/api/rooms/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: "Failed to join room." }));
        setError(payload.message ?? "Failed to join room.");
        toast.error(payload.message ?? "Failed to join room.");
        return;
      }

      toast.success("Joined room.");
      await loadData();
    } finally {
      setJoiningRoomId(null);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="rounded-[28px] border border-cyan-400/12 bg-slate-950/75 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">Rooms</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Create or join rooms, then jump into realtime chat with a clean dashboard layout.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dm" className="rounded-full border border-cyan-400/20 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900">
              DMs
            </Link>
            <Link href="/profile" className="rounded-full border border-cyan-400/20 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900">
              Profile
            </Link>
            <LogoutButton />
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-400">Signed in as {session?.user?.email ?? "your account"}</p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-cyan-400/12 bg-slate-950/75 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
          <h2 className="text-lg font-semibold text-slate-50">Create room</h2>
          <p className="mt-1 text-sm text-slate-400">Start a new discussion space in seconds.</p>
          <form onSubmit={onCreateRoom} className="mt-5 space-y-3">
            <input
              type="text"
              placeholder="Room name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-cyan-400/10 bg-slate-900/80 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-xl border border-cyan-400/10 bg-slate-900/80 px-3 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create room"}
            </button>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total</p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">{rooms.length}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Joined</p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">{joinedRoomIds.size}</p>
            </div>
          </div>
        </aside>

        <section className="rounded-[28px] border border-cyan-400/12 bg-slate-950/75 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">All rooms</h2>
              <p className="mt-1 text-sm text-slate-400">Joined rooms open directly; others can be joined in one tap.</p>
            </div>
            {error ? <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs text-rose-200">{error}</span> : null}
          </div>

          {isLoading ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="h-36 animate-pulse rounded-2xl border border-white/5 bg-white/5" />
              ))}
            </div>
          ) : null}

          {!isLoading && rooms.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-cyan-400/15 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
              No rooms yet. Create the first one to get started.
            </div>
          ) : null}

          {!isLoading && rooms.length > 0 ? (
            <ul className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {rooms.map((room) => {
                const joined = joinedRoomIds.has(room.id);
                const unreadCount = roomUnreadByRoomId[room.id] ?? 0;

                return (
                  <li
                    key={room.id}
                    className="group rounded-2xl border border-white/5 bg-slate-900/60 p-4 transition hover:border-cyan-400/20 hover:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-base font-semibold text-slate-50">{room.name}</p>
                          {unreadCount > 0 ? (
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                              {unreadCount}
                            </span>
                          ) : null}
                          {joined ? (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                              Joined
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                          {room.description ?? "No description provided."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
                      <span>{room.memberCount} members</span>
                      <span className="rounded-full border border-white/5 bg-white/5 px-2 py-1">Room</span>
                    </div>

                    <div className="mt-4">
                      {joined ? (
                        <Link
                          href={`/chat/${room.id}`}
                          className="inline-flex rounded-full bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                        >
                          Open room
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => joinRoom(room.id)}
                          disabled={joiningRoomId === room.id}
                          className="inline-flex rounded-full border border-cyan-400/20 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {joiningRoomId === room.id ? "Joining..." : "Join room"}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      </section>
    </main>
  );
}
