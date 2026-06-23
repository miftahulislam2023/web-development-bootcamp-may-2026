'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function OnlineStatus({ roomId, userId }) {
  const [onlineUsers, setOnlineUsers] = useState([])
  useEffect(() => {
    if (!roomId || !userId) return

    const channel = supabase.channel(`presence-${roomId}`, {
      config: { presence: { key: userId } }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = Object.keys(state)
        setOnlineUsers(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: userId, online_at: new Date().toISOString() })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, userId])

  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span className="text-green-400 text-xs">
        {onlineUsers.length} online
      </span>
    </div>
  )
}