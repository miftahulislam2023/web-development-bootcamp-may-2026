import Link from "next/link"
import { Eye, Timer } from "@phosphor-icons/react/dist/ssr"
import { getStreamDuration } from "@/lib/format-stream"
import type { LiveRoom } from "@/lib/types/home"

interface LiveRoomCardProps {
  room: LiveRoom
}

function LiveRoomCard({ room }: LiveRoomCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <Link
        href={`/stream/${room.roomKey}`}
        className="flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Watch ${room.title} by ${room.hostName}`}
      >
      {/* Thumbnail area */}
        <figure className="relative flex aspect-video items-center justify-center bg-linear-to-br from-primary/10 via-background to-primary/5">
          <span className="text-4xl font-black tracking-tighter text-primary/20 transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
            {room.title.charAt(0).toUpperCase()}
          </span>

          {/* LIVE badge */}
          <div role="status" aria-label="Live broadcast" className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-live px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
            <span className="size-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />
            Live
          </div>

          {/* Viewer count */}
          <div aria-label={`${room.viewerCount} viewers`} className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white/90 backdrop-blur-sm">
            <Eye size={12} weight="bold" aria-hidden="true" />
            <span aria-hidden="true">{room.viewerCount}</span>
          </div>
        </figure>

      {/* Info */}
        <div className="flex flex-col gap-1 p-3.5">
          <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {room.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{room.hostName}</p>
            <time dateTime={room.startedAt} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Timer size={11} aria-hidden="true" />
              {getStreamDuration(room.startedAt)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  )
}

export { LiveRoomCard }
