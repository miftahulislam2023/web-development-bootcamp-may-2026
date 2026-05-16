"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";

import { LogoutButton } from "@/components/auth/logout-button";

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
  const [error, setError] = useState<string | null>(null);

  const joinedRoomIds = useMemo(() => new Set(myRooms.map((entry) => entry.room.id)), [myRooms]);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    const [roomsResponse, myRoomsResponse] = await Promise.all([
      fetch("/api/rooms"),
      fetch("/api/rooms/me"),
    ]);

    if (!roomsResponse.ok) {
      setIsLoading(false);
      setError("Failed to load rooms.");
      return;
    }

    if (!myRoomsResponse.ok) {
      setIsLoading(false);
      setError("Failed to load your room memberships.");
      return;
    }

    const roomsPayload = (await roomsResponse.json()) as Room[];
    const myRoomsPayload = (await myRoomsResponse.json()) as MyRoom[];

    setRooms(roomsPayload);
    setMyRooms(myRoomsPayload);
    setIsLoading(false);
  }

  useEffect(() => {
    void loadData();
  }, []);

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
      return;
    }

    setName("");
    setDescription("");
    await loadData();
  }

  async function joinRoom(roomId: string) {
    setError(null);

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
      return;
    }

    await loadData();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6">
      <header className="flex items-center justify-between border border-zinc-200 bg-white p-4">
        <div>
          <h1 className="text-lg font-semibold">Rooms</h1>
          <p className="text-xs text-zinc-600">Signed in as {session?.user?.email}</p>
        </div>
        <LogoutButton />
      </header>

      <section className="border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold">Create room</h2>
        <form onSubmit={onCreateRoom} className="mt-3 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Room name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="border border-zinc-300 px-3 py-2 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="border border-zinc-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-fit border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create room"}
          </button>
        </form>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section className="border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold">All rooms</h2>
        {isLoading ? <p className="mt-3 text-sm text-zinc-600">Loading rooms...</p> : null}

        {!isLoading && rooms.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">No rooms yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {rooms.map((room) => {
              const joined = joinedRoomIds.has(room.id);

              return (
                <li key={room.id} className="border border-zinc-200 p-3">
                  <p className="text-sm font-medium">{room.name}</p>
                  <p className="text-xs text-zinc-600">{room.description ?? "No description"}</p>
                  <p className="text-xs text-zinc-500">Members: {room.memberCount}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {joined ? (
                      <Link href={`/chat/${room.id}`} className="border border-zinc-300 px-2 py-1 text-xs">
                        Open
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => joinRoom(room.id)}
                        className="border border-zinc-300 px-2 py-1 text-xs"
                      >
                        Join room
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
