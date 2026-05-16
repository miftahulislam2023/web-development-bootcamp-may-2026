import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  Users,
  ChatText,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr"
import { formatDuration, formatDate, formatTime } from "@/lib/format-stream"
import type { StreamSessionSummary } from "@/lib/types/stream-session"

interface SessionRowProps {
  session: StreamSessionSummary
}

function SessionRow({ session }: SessionRowProps) {
  return (
    <Card
      size="sm"
      className="group transition-colors hover:border-primary/30 hover:bg-accent/50"
    >
      <Link
        href={`/dashboard/history/${encodeURIComponent(session.roomKey)}/${session.id}`}
        className="block"
        aria-label={`View summary for ${session.roomTitle} on ${formatDate(session.startedAt)}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="truncate text-sm font-semibold">
              {session.roomTitle}
            </span>
            <Badge variant="outline" className="shrink-0 text-xs font-normal text-muted-foreground">
              {formatDate(session.startedAt)}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {formatDuration(session.durationSeconds)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden="true" />
              {session.peakViewerCount} peak viewers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ChatText className="size-3.5" aria-hidden="true" />
              {session.totalChatMessages} messages
            </span>
            <span className="ml-auto text-xs text-muted-foreground/60">
              {formatTime(session.startedAt)}
            </span>
            <ArrowRight
              className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden="true"
            />
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export { SessionRow }
