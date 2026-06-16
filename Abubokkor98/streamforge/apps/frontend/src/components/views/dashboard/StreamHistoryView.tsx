"use client"

import { useAllStreamHistory } from "@/hooks/useAllStreamHistory"
import { ErrorDisplay } from "@/components/shared/error-display"
import { HistorySkeleton } from "@/components/views/dashboard/history/HistorySkeleton"
import { EmptyHistory } from "@/components/views/dashboard/history/EmptyHistory"
import { SessionRow } from "@/components/views/dashboard/history/SessionRow"

const STAGGER_DELAY_MS = 60

function StreamHistoryView() {
  const { sessions, isLoading, error } = useAllStreamHistory()

  if (isLoading) {
    return <HistorySkeleton />
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Failed to load stream history"
        message={error.message ?? "Something went wrong."}
      />
    )
  }

  if (sessions.length === 0) {
    return <EmptyHistory />
  }

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold text-foreground">Stream History</h2>
        <p className="text-sm text-muted-foreground">
          {sessions.length} past {sessions.length === 1 ? "stream" : "streams"}
        </p>
      </header>

      <ul className="space-y-3">
        {sessions.map((session, index) => (
          <li
            key={session.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * STAGGER_DELAY_MS}ms` }}
          >
            <SessionRow session={session} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export { StreamHistoryView }
