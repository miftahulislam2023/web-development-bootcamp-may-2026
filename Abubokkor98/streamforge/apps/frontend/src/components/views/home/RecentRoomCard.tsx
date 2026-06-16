import Link from "next/link"
import { Clock, Users, ChatCircle } from "@phosphor-icons/react/dist/ssr"
import { formatDuration, getTimeAgo } from "@/lib/format-stream"
import type { RecentRoom } from "@/lib/types/home"

interface RecentRoomCardProps {
  room: RecentRoom
}

function RecentRoomCard({ room }: RecentRoomCardProps) {
  return (
    <Link
      href={`/stream/${room.roomKey}`}
      className="group flex items-center gap-4 rounded-lg border border-border/40 bg-card/30 p-4 transition-all duration-200 hover:border-border/80 hover:bg-card/60"
    >
      {/* Initial avatar */}
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-lg font-bold text-muted-foreground transition-colors group-hover:text-foreground">
        {room.title.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className="truncate text-sm font-semibold text-foreground">
          {room.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {room.hostName} · {getTimeAgo(room.endedAt)}
        </p>
      </div>

      {/* Stats */}
      <div className="hidden shrink-0 items-center gap-3 text-xs text-muted-foreground sm:flex">
        <span className="inline-flex items-center gap-1" title="Duration">
          <Clock size={12} aria-hidden="true" />
          {formatDuration(room.durationSeconds)}
        </span>
        <span className="inline-flex items-center gap-1" title="Peak viewers">
          <Users size={12} aria-hidden="true" />
          {room.peakViewerCount}
        </span>
        <span className="inline-flex items-center gap-1" title="Chat messages">
          <ChatCircle size={12} aria-hidden="true" />
          {room.totalChatMessages}
        </span>
      </div>
    </Link>
  )
}

export { RecentRoomCard }
