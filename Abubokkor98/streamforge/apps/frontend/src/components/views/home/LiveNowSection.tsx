"use client"

import { useLiveRooms } from "@/hooks/useLiveRooms"
import { LiveRoomCard } from "@/components/views/home/LiveRoomCard"
import { EmptyLiveState } from "@/components/views/home/EmptyLiveState"
import { LiveNowSkeleton } from "@/components/views/home/LiveNowSkeleton"
import { ErrorDisplay } from "@/components/shared/error-display"
import { Broadcast } from "@phosphor-icons/react"

const STAGGER_DELAY_MS = 80

function LiveNowSection() {
  const { rooms, isLoading, error } = useLiveRooms()

  if (isLoading) {
    return <LiveNowSkeleton />
  }

  if (error) {
    return (
      <section id="live-now" className="px-6 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <ErrorDisplay
            title="Failed to load live streams"
            message={error.message || "Please check your connection and try again."}
          />
        </div>
      </section>
    )
  }

  if (rooms.length === 0) {
    return (
      <section id="live-now" className="px-6 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex items-center gap-2.5">
            <Broadcast size={22} weight="bold" className="text-muted-foreground" />
            <h2 className="text-xl font-bold text-foreground">Live Now</h2>
          </header>
          <EmptyLiveState />
        </div>
      </section>
    )
  }

  return (
    <section id="live-now" className="px-6 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center gap-2.5">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-live" />
          </span>
          <h2 className="text-xl font-bold text-foreground">
            Live Now
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({rooms.length})
            </span>
          </h2>
        </header>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, index) => (
            <li
              key={room.roomKey}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * STAGGER_DELAY_MS}ms` }}
            >
              <LiveRoomCard room={room} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { LiveNowSection }
