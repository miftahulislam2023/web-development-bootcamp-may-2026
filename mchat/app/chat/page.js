'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import CreateRoomModal from '@/components/CreateRoomModal'

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [username, setUsername] = useState('')
  useEffect(() => {
    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', session.user.id)
      .single()

    if (profile?.username) setUsername(profile.username)

      await fetchRooms()
      setLoading(false)
    }
    initialize()
  }, [router])

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setRooms(data)
  }

  const handleRoomCreated = (newRoom) => {
    setRooms(prev => [newRoom, ...prev])
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: 'var(--chat-bg)' }}>
        <div className="text-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-white">Loading mchat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--chat-bg)' }}>

      <Sidebar
        rooms={rooms}
        currentRoomId={null}
        user={user}
        onCreateRoom={() => setShowModal(true)}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

<div className="flex-1 flex flex-col items-center justify-center px-6">
  <div className="text-center max-w-sm">

    <div
      className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
      style={{ backgroundColor: 'rgba(37,211,102,0.1)', 
        border: '2px solid rgba(37,211,102,0.2)' }}
    >
      <span className="text-5xl">💬</span>
    </div>

    <h2
      className="text-white text-2xl font-bold mb-2"
      style={{ letterSpacing: '-0.5px' }}
    >
      Welcome, {username || user?.email?.split('@')[0]}!
    </h2>
    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
      Join a room to chat with everyone, or send a
      private message to someone directly.
    </p>

    <div className="flex gap-4 justify-center mb-8">
      <div
        className="px-4 py-3 rounded-xl text-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-white font-bold text-xl">{rooms.length}</p>
        <p className="text-gray-500 text-xs mt-0.5">Rooms</p>
      </div>
      <div
        className="px-4 py-3 rounded-xl text-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-1 justify-center">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <p className="text-green-400 font-bold text-xl">1</p>
        </div>
        <p className="text-gray-500 text-xs mt-0.5">Online</p>
      </div>
    </div>

    <div className="flex flex-col gap-3">
      <button
        onClick={() => setShowModal(true)}
        className="w-full px-6 py-3 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
        style={{ backgroundColor: '#184e77 ' }}
      >
         Create a Room
      </button>
      <button
        onClick={() => router.push('/new-dm')}
        className="w-full px-6 py-3 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
        style={{ backgroundColor: '#168aad' }}
      >
         Send a Direct Message
      </button>
    </div>
  </div>
</div>

      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-10 text-white bg-gray-700 p-2 rounded-full"
      >
        ☰
      </button>

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