"use client"

import { useRecentRooms } from "@/hooks/useRecentRooms"
import { RecentRoomCard } from "@/components/views/home/RecentRoomCard"
import { ClockCounterClockwise } from "@phosphor-icons/react"

const STAGGER_DELAY_MS = 60

function RecentlyEndedSection() {
  const { rooms, isLoading } = useRecentRooms()

  // Don't render if loading or no recent rooms — section is supplemental
  if (isLoading || rooms.length === 0) {
    return null
  }

  return (
    <section className="px-6 py-12 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center gap-2.5">
          <ClockCounterClockwise size={20} weight="bold" className="text-muted-foreground" />
          <h2 className="text-lg font-bold text-foreground">Recently Ended</h2>
        </header>

        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {rooms.map((room, index) => (
            <li
              key={`${room.roomKey}-${room.endedAt}`}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * STAGGER_DELAY_MS}ms` }}
            >
              <RecentRoomCard room={room} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { RecentlyEndedSection }
