/**
 * Pure formatting utilities for stream session data.
 */

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600
const INVALID_DATE_FALLBACK = "—"

function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime())
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === 0) return "—"

  const hours = Math.floor(seconds / SECONDS_PER_HOUR)
  const minutes = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
  const secs = seconds % SECONDS_PER_MINUTE

  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

  return parts.join(" ")
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  if (!isValidDate(date)) return INVALID_DATE_FALLBACK

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  if (!isValidDate(date)) return INVALID_DATE_FALLBACK

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatFullDate(dateString: string): string {
  const date = new Date(dateString)
  if (!isValidDate(date)) return INVALID_DATE_FALLBACK

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function getStreamDuration(startedAt: string): string {
  const started = new Date(startedAt)
  if (!isValidDate(started)) return INVALID_DATE_FALLBACK

  const diffMs = Date.now() - started.getTime()
  const minutes = Math.floor(diffMs / 60_000)

  if (minutes < 1) return "Just started"
  if (minutes < 60) return `${minutes}m`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export function getTimeAgo(endedAt: string): string {
  const ended = new Date(endedAt)
  if (!isValidDate(ended)) return INVALID_DATE_FALLBACK

  const diffMs = Date.now() - ended.getTime()
  const minutes = Math.floor(diffMs / 60_000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  return `${Math.floor(hours / 24)}d ago`
}

export function formatTimeRange(
  startedAt: string,
  endedAt: string | null,
): string {
  const startTime = formatTime(startedAt)
  if (startTime === INVALID_DATE_FALLBACK) return INVALID_DATE_FALLBACK

  if (!endedAt) return startTime

  const endTime = formatTime(endedAt)
  if (endTime === INVALID_DATE_FALLBACK) return startTime

  return `${startTime} — ${endTime}`
}
