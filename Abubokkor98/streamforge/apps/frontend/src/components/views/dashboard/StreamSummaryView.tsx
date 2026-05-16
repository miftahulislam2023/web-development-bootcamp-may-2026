"use client"

import Link from "next/link"
import { useStreamSummary } from "@/hooks/useStreamSummary"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ErrorDisplay } from "@/components/shared/error-display"
import { SummarySkeleton } from "@/components/views/dashboard/history/SummarySkeleton"
import { StatCard } from "@/components/views/dashboard/history/StatCard"
import {
  Clock,
  Users,
  ChatText,
  CalendarBlank,
  ArrowLeft,
  FilmSlate,
} from "@phosphor-icons/react"
import {
  formatDuration,
  formatFullDate,
  formatTimeRange,
} from "@/lib/format-stream"

interface StreamSummaryViewProps {
  roomKey: string
  sessionId: string
}

function StreamSummaryView({ roomKey, sessionId }: StreamSummaryViewProps) {
  const { summary, isLoading, error } = useStreamSummary(roomKey, sessionId)

  if (isLoading) {
    return <SummarySkeleton />
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Failed to load stream summary"
        message={error.message ?? "Something went wrong."}
        action={
          <Button variant="outline" asChild>
            <Link href="/dashboard/history">Back to History</Link>
          </Button>
        }
      />
    )
  }

  if (!summary) {
    return (
      <section className="flex flex-col items-center gap-4 py-20 text-center">
        <FilmSlate className="size-10 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-foreground">
          Session not found
        </h2>
        <Button variant="outline" asChild>
          <Link href="/dashboard/history">Back to History</Link>
        </Button>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      {/* Back link */}
      <nav>
        <Button variant="ghost" size="sm" className="gap-1.5" asChild>
          <Link href="/dashboard/history">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to History
          </Link>
        </Button>
      </nav>

      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {summary.roomTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatFullDate(summary.startedAt)} · {formatTimeRange(summary.startedAt, summary.endedAt)}
        </p>
      </header>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Clock className="size-5" aria-hidden="true" />}
          label="Total Duration"
          value={formatDuration(summary.durationSeconds)}
          accent
        />
        <StatCard
          icon={<Users className="size-5" aria-hidden="true" />}
          label="Peak Viewers"
          value={summary.peakViewerCount.toLocaleString()}
        />
        <StatCard
          icon={<ChatText className="size-5" aria-hidden="true" />}
          label="Chat Messages"
          value={summary.totalChatMessages.toLocaleString()}
        />
      </div>

      {/* Metadata */}
      <Card className="border-border/50 bg-card/80">
        <CardContent className="pt-5">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Room
              </dt>
              <dd className="font-medium text-foreground">{summary.roomTitle}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Host
              </dt>
              <dd className="font-medium text-foreground">{summary.hostName}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Started
              </dt>
              <dd className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <CalendarBlank className="size-3.5 text-muted-foreground" aria-hidden="true" />
                {formatFullDate(summary.startedAt)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Session ID
              </dt>
              <dd className="font-mono text-xs text-muted-foreground">
                #{summary.id}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  )
}

export { StreamSummaryView }
