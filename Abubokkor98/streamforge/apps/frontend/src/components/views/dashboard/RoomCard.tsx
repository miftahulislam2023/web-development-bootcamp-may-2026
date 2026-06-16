"use client"

import Link from "next/link"
import { EditRoomDialog } from "@/components/views/dashboard/EditRoomDialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Trash, Play } from "@phosphor-icons/react"
import { toast } from "sonner"
import { axiosInstance } from "@/lib/api-client"
import type { Room, RoomStatus } from "@/lib/types/room"

interface RoomCardProps {
  room: Room
  onDeleted: () => void
}

const STATUS_CONFIG: Record<RoomStatus, { label: string; className: string }> = {
  LIVE: { label: "Live", className: "bg-live/15 text-live border-live/30" },
  OFFLINE: { label: "Offline", className: "bg-offline/15 text-offline border-offline/30" },
  ENDED: { label: "Ended", className: "bg-ended/15 text-ended border-ended/30" },
}

const DELETE_ENDPOINT = "/api/rooms"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function RoomCard({ room, onDeleted }: RoomCardProps) {
  const status = STATUS_CONFIG[room.status]
  const isOffline = room.status === "OFFLINE"

  async function handleCopyLink() {
    try {
      const streamUrl = `${window.location.origin}/stream/${room.roomKey}`
      await navigator.clipboard.writeText(streamUrl)
      toast.success("Stream link copied!")
    } catch {
      toast.error("Failed to copy link.")
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${room.title}"? This cannot be undone.`)) return

    try {
      await axiosInstance.delete(`${DELETE_ENDPOINT}/${room.roomKey}`)
      toast.success("Room deleted.")
      onDeleted()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed."
      toast.error(message)
    }
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="truncate">{room.title}</CardTitle>
        <CardDescription>
          <time dateTime={room.createdAt}>{formatDate(room.createdAt)}</time>
        </CardDescription>
        <CardAction>
          <Badge variant="outline" className={status.className}>
            {status.label}
          </Badge>
        </CardAction>
      </CardHeader>

      {room.description && (
        <CardContent>
          <p className="line-clamp-2 text-muted-foreground">
            {room.description}
          </p>
        </CardContent>
      )}

      <CardFooter className="flex-wrap gap-1.5">
        {isOffline && (
          <Button variant="default" size="sm" className="gap-1.5" asChild>
            <Link href={`/host/${room.roomKey}`}>
              <Play className="size-3.5" aria-hidden="true" />
              Go Live
            </Link>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handleCopyLink}
        >
          <Copy className="size-3.5" aria-hidden="true" />
          Copy Link
        </Button>

        <EditRoomDialog room={room} />

        {isOffline && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash className="size-3.5" aria-hidden="true" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export { RoomCard }
