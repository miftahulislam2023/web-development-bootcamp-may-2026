'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function DMPage() {
  const { email } = useParams()
  const router = useRouter()
  const decodedEmail = decodeURIComponent(email)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [receiver, setReceiver] = useState(null)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    let channel

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setCurrentUser(user)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('email', decodedEmail)
        .single()

      if (profileError || !profile) {
        setError('No user found with that email.')
        return
      }
      setReceiver(profile)

      const { data: msgs } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      setMessages(msgs || [])

      channel = supabase
        .channel(`dm-${user.id}-${profile.id}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'direct_messages',
          },
          (payload) => {
            const msg = payload.new
            if (
              (msg.sender_id === user.id && msg.receiver_id === profile.id) ||
              (msg.sender_id === profile.id && msg.receiver_id === user.id)
            ) {
              setMessages(prev => {
                const exists = prev.some(m => m.id === msg.id)
                if (exists) return prev
                return [...prev, msg]
              })
            }
          }
        )
        .subscribe()
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [decodedEmail])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !receiver || !currentUser) return
    await supabase.from('direct_messages').insert({
      sender_id: currentUser.id,
      receiver_id: receiver.id,
      content: newMessage.trim(),
    })
    setNewMessage('')
  }

  if (error) return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => router.push('/new-dm')}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          ← Try another email
        </button>
      </div>
    </main>
  )

  return (
    <main className="flex flex-col h-screen text-white"
      style={{ backgroundColor: 'var(--chat-bg)' }}>
      <div
        className="px-4 py-3 border-b border-gray-700 flex items-center gap-3"
        style={{ backgroundColor: 'var(--message-bg)' }}
      >
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white transition"
        >
          ←
        </button>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: '#168aad' }}
        >
          {(receiver?.username || decodedEmail).substring(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-sm text-white">
            {receiver?.username || decodedEmail}
          </p>
          <p className="text-xs text-gray-400">{decodedEmail}</p>
        </div>
      </div>
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
        style={{ backgroundColor: 'var(--chat-bg)' }}
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">
              No messages yet — say hello! 👋
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
              msg.sender_id === currentUser?.id
                ? 'ml-auto text-white'
                : 'text-gray-100'
            }`}
            style={{
              backgroundColor: msg.sender_id === currentUser?.id
                ? '#168aad'
                : 'var(--message-bg)',
              borderRadius: msg.sender_id === currentUser?.id
                ? '16px 16px 3px 16px'
                : '16px 16px 16px 3px'
            }}
          >
            {msg.content}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div
        className="px-4 py-3 border-t border-gray-700 flex gap-2"
        style={{ backgroundColor: 'var(--message-bg)' }}
      >
        <input
          className="flex-1 rounded-full px-4 py-2 text-sm outline-none text-white"
          style={{ backgroundColor: 'var(--input-bg)' }}
          placeholder="Type a message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={sendMessage}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: '#168aad' }}
        >
          ➤
        </motion.button>
      </div>
    </main>
  )
}