'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function MessageInput({ onSend, disabled, roomId, userId }) {
  const [message, setMessage] = useState('')
  const [typingUsers, setTypingUsers] = useState([])
  const typingTimeoutRef = useRef(null)
  const channelRef = useRef(null)

  useEffect(() => {
    if (!roomId || !userId) return

    const channel = supabase.channel(`typing-${roomId}`)

    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId === userId) return

        setTypingUsers(prev => {
          if (!prev.includes(payload.username)) {
            return [...prev, payload.username]
          }
          return prev
        })

        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u !== payload.username))
        }, 2000)
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, userId])

  const broadcastTyping = (username) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId, username }
    })
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    broadcastTyping(e.target.value ? userId?.substring(0, 6) : '')
    clearTimeout(typingTimeoutRef.current)
  }

  const handleSend = () => {
    if (!message.trim()) return
    onSend(message.trim())
    setMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--sidebar-bg)' }}>
      {typingUsers.length > 0 && (
        <div className="px-4 py-1">
          <p className="text-xs" style={{ color: 'var(--whatsapp-green)' }}>
            {typingUsers[0]} is typing
            <span className="animate-pulse">...</span>
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 px-3 py-2">
        <div
          className="flex-1 flex items-center rounded-full px-4 py-2"
          style={{ backgroundColor: 'var(--input-bg)' }}
        >
          <input
            type="text"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            disabled={disabled}
            className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center transition flex-shrink-0 disabled:opacity-50"
          style={{ backgroundColor: '#184e77' }}
        >
          <span className="text-white text-lg">➤</span>
        </button>
      </div>
    </div>
  )
}