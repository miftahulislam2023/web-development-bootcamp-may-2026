'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { CiSearch } from "react-icons/ci";
import { MdLogout } from "react-icons/md";

export default function Sidebar({
  rooms,
  currentRoomId,
  user,
  onCreateRoom,
  onLogout,
  isOpen,
  onClose
}) {
  const router = useRouter()
  const [dms, setDms] = useState([])
  const [username, setUsername] = useState('')
  const [search, setSearch] = useState('')

  const getInitials = (str) => {
    if (!str) return '?'
    return str.substring(0, 2).toUpperCase()
  }

  useEffect(() => {
    const fetchProfile = async () => {
        if (!user?.id) return
    try {
        const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

        if (data?.username) setUsername(data.username)
    } catch (err) {
        console.error('Profile fetch error:', err)
    }
    }
    fetchProfile()
  }, [user])

  useEffect(() => {
    const fetchDMs = async () => {
      if (!user?.id) return
      const { data } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (!data) return

      const seen = new Set()
      const conversations = []
      for (const msg of data) {
        const partnerId = msg.sender_id === user.id
          ? msg.receiver_id
          : msg.sender_id
        if (!seen.has(partnerId)) {
          seen.add(partnerId)
          conversations.push({ partnerId, lastMessage: msg.content })
        }
      }

      const enriched = await Promise.all(
        conversations.map(async (c) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, email')
            .eq('id', c.partnerId)
            .single()
          return { ...c, profile }
        })
      )
      setDms(enriched)
    }
    fetchDMs()
  }, [user])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed md:relative z-30 md:z-auto
        w-80 h-full flex flex-col
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
        style={{ backgroundColor: 'var(--sidebar-bg)' }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-gray-700"
          style={{ backgroundColor: 'var(--message-bg)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-600">
            <Image
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                alt="avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
            />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">
                {username || user?.email?.split('@')[0]}
              </p>
              <p className="text-gray-400 text-xs">
                {user?.email}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-green-400 text-xs">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 text-semibold hover:text-red-400 hover:cursor-pointer  transition"
          >
            <MdLogout size={20} />
          </button>
        </div>
        <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ backgroundColor: 'var(--input-bg)' }}>
        <CiSearch className="text-gray-400 " />
        <input
            type="text"
            placeholder="Search DMs and Rooms"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-white text-sm outline-none w-full placeholder-gray-400"
        />
        </div>
        </div>
        <div className="flex-1 overflow-y-auto">


          {dms.length > 0 && (
            <>
              <div className="px-4 py-2">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  Inbox
                </p>
              </div>
              {dms
                .filter(dm =>
                    (dm.profile?.username || '').toLowerCase().includes(search.toLowerCase()) ||
                    (dm.profile?.email || '').toLowerCase().includes(search.toLowerCase())
                )
                .map((dm, i) => (
                <div
                  key={i}
                  onClick={() => {
                    router.push(`/dm/${encodeURIComponent(dm.profile?.email || dm.partnerId)}`)
                    onClose?.()
                  }}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-800 hover:bg-gray-800 transition"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: '#168aad' }}
                  >
                    {getInitials(dm.profile?.username || dm.profile?.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {dm.profile?.username || dm.profile?.email?.split('@')[0] || 'Unknown'}
                    </p>
                    <p className="text-gray-400 text-xs truncate mt-0.5">
                      {dm.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
                    <div className="px-4 py-2">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Rooms
            </p>
          </div>

          {rooms.length === 0 ? (
            <p className="text-gray-500 text-xs text-center py-2">No rooms yet</p>
          ) : (
            rooms
            .filter(room =>
                room.name.toLowerCase().includes(search.toLowerCase()) ||
                (room.description || '').toLowerCase().includes(search.toLowerCase())
            )
            .map((room) => (
              <div
                key={room.id}
                onClick={() => {
                  router.push(`/chat/${room.id}`)
                  onClose?.()
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 cursor-pointer
                  border-b border-gray-800 transition
                  ${currentRoomId === room.id ? 'bg-gray-700' : 'hover:bg-gray-800'}
                `}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: '#184e77' }}
                >
                  {getInitials(room.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium text-sm truncate">
                       {room.name}
                    </p>
                    <span className="text-gray-500 text-xs shrink-0 ml-2">
                      {new Date(room.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs truncate mt-0.5">
                    {room.description || 'No description'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          className="p-3 border-t border-gray-700 flex flex-col gap-2 "
          style={{ backgroundColor: 'var(--message-bg)' }}
        >
          <Button
            onClick={onCreateRoom}
            className="w-full text-white font-medium hover:cursor-pointer"
            style={{ backgroundColor: '#184e77' }}
          >
            New Room
          </Button>
          <Button
            onClick={() => router.push('/new-dm')}
            className="w-full text-white font-medium hover:cursor-pointer"
            style={{ backgroundColor: '#168aad' }}
          >
            New Message
          </Button>
        </div>
      </div>
    </>
  )
}