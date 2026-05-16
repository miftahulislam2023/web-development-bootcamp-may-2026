"use client"

import { useRooms } from "@/hooks/useRooms"
import { RoomCard } from "@/components/views/dashboard/RoomCard"
import { DashboardSkeleton } from "@/components/views/dashboard/DashboardSkeleton"
import { CreateRoomDialog } from "@/components/views/dashboard/CreateRoomDialog"
import { ErrorDisplay } from "@/components/shared/error-display"
import { Button } from "@/components/ui/button"

const STAGGER_DELAY_MS = 80

/**
 * Handles its own loading/error states via useRooms hook.
 * No Suspense/ErrorBoundary needed — React Query manages loading/error states internally.
 */
function DashboardView() {
  const { rooms, isLoading, error, refetch } = useRooms()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Failed to load rooms"
        message={error?.message ?? "Something went wrong."}
        action={
          <Button onClick={refetch} variant="outline">
            Try again
          </Button>
        }
      />
    )
  }

  if (rooms.length === 0) {
    return (
      <section className="flex flex-col items-center gap-4 py-20 text-center">
        <h2 className="text-lg font-semibold text-foreground">No rooms yet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Create your first streaming room to get started.
        </p>
        <CreateRoomDialog />
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Rooms</h2>
        <CreateRoomDialog
          trigger={
            <Button size="sm" className="gap-2">
              Create Room
            </Button>
          }
        />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room, index) => (
          <div
            key={room.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * STAGGER_DELAY_MS}ms` }}
          >
            <RoomCard room={room} onDeleted={refetch} />
          </div>
        ))}
      </div>
    </section>
  )
}

export { DashboardView }
