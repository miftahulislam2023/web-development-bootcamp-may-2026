/**
 * 
 * header section: make a one-loop gif that types fylestash in typewriter animation.
 * 
 */

'use client'

import { useEffect, useState } from 'react'

export function Header() {
  const text = 'Fylestash'
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let index = 0

    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1))
      index++

      if (index === text.length) {
        clearInterval(interval)
      }
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-20 items-center justify-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {displayedText}

          {/* blinking cursor. removed once the animation completes */}
          {displayedText.length !== text.length && (
            <span className="animate-pulse">|</span>
          )}
        </h1>
      </div>
    </header>
  )
}