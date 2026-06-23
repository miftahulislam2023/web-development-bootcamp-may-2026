'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import MessageBubble from '@/components/MessageBubble'
import MessageInput from '@/components/MessageInput'
import Sidebar from '@/components/Sidebar'
import OnlineStatus from '@/components/OnlineStatus'
import CreateRoomModal from '@/components/CreateRoomModal'

export default function RoomPage() {
  const router = useRouter()
  const params = useParams()
  const roomId = params.roomId

  const [room, setRoom] = useState(null)
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const bottomRef = useRef(null)

  useEffect(() => {
    let channel
    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (roomError || !roomData) {
        router.push('/chat')
        return
      }
      setRoom(roomData)

      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false })
      if (roomsData) setRooms(roomsData)

      await fetchMessages(session.user)
      setLoading(false)

channel = supabase
  .channel(`room-${roomId}-${Date.now()}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `room_id=eq.${roomId}`
    },
    (payload) => {
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === payload.new.id)
        if (exists) return prev
        return [...prev, payload.new]
      })
    }
  )
  .subscribe()
    }
    initialize()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async (currentUser) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error:', error)
      return
    }

    const messagesWithEmail = data.map(msg => ({
      ...msg,
      user_email: msg.user_id === currentUser.id
        ? currentUser.email
        : msg.user_email || 'Unknown'
    }))

    setMessages(messagesWithEmail)
  }

  const handleSend = async (content) => {
    if (!user) return
    const { error } = await supabase
      .from('messages')
      .insert({
        content,
        user_id: user.id,
        room_id: roomId,
        user_email: user.email,
      })
    if (error) console.error('Send error:', error)
  }

  const handleRoomCreated = (newRoom) => {
    setRooms(prev => [newRoom, ...prev])
    router.push(`/chat/${newRoom.id}`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: 'var(--chat-bg)' }}>
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--chat-bg)' }}
      >

      <Sidebar
        rooms={rooms}
        currentRoomId={roomId}
        user={user}
        onCreateRoom={() => setShowModal(true)}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-gray-700 flex-shrink-0"
          style={{ backgroundColor: 'var(--message-bg)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-400 hover:text-white mr-1"
            >
              ☰
            </button>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: '#184e77' }}
            >
              {room?.name?.substring(0, 2).toUpperCase()}
            </div>

            <div>
              <h1 className="text-white font-semibold text-sm">
                 {room?.name}
              </h1>
              <OnlineStatus roomId={roomId} userId={user?.id} />
            </div>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{
            backgroundColor: 'var(--chat-bg)',
            backgroundSize: '20px 20px'
          }}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div
                className="text-center px-6 py-4 rounded-lg"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
              >
                <p className="text-3xl mb-2"></p>
                <p className="text-gray-500 mt-1">
                  Say Hello!
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.user_id === user?.id}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <div className="
        shrink-0">
          <MessageInput
            onSend={handleSend}
            disabled={!user}
            roomId={roomId}
            userId={user?.id}
          />
        </div>
      </div>

      {showModal && (
        <CreateRoomModal
          userId={user?.id}
          onRoomCreated={handleRoomCreated}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}