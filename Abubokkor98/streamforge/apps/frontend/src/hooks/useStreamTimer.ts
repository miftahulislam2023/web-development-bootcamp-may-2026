"use client"

import { useState, useRef, useEffect } from "react"

interface StreamTimerReturn {
  elapsedSeconds: number
  formattedTime: string
}

/**
 * Minimal wall-clock timer for broadcast sessions.
 * Uses Date.now() delta inside the interval callback to prevent drift
 * in background tabs. No synchronous setState in the effect body.
 */
export function useStreamTimer(isRunning: boolean): StreamTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const startRef = useRef(0)

  useEffect(() => {
    if (!isRunning) return

    startRef.current = Date.now()

    const intervalId = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isRunning])

  const format = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  return { elapsedSeconds, formattedTime: format(elapsedSeconds) }
}
