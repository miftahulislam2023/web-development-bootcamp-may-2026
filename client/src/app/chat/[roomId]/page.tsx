'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Message, Room, TypingUser } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { usePresenceStore } from '@/store/presenceStore';
import MessageBubble from '@/components/chat/MessageBubble';
import MessageInput from '@/components/chat/MessageInput';
import RoomSidebar from '@/components/chat/RoomSidebar';
import { Button } from '@/components/ui/button';
import { Users, ChevronLeft } from 'lucide-react';

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const { isOnline } = usePresenceStore();
  const [showSidebar, setShowSidebar] = useState(false);

  const { data: room } = useQuery<Room>({
    queryKey: ['room', roomId],
    queryFn: () => api.get(`/rooms/${roomId}`).then((r) => r.data.room),
    enabled: !!user,
  });

  const { sendMessage, startTyping, stopTyping, markRead, deleteMessage } = useSocket({
    roomId,
    onRoomHistory: (msgs) => setMessages(msgs),
    onNewMessage: (msg) => {
      setMessages((prev) => [...prev, msg]);
      markRead(msg.id);
    },
    onTyping: (data) => setTypingUsers((prev) => [...prev.filter((u) => u.userId !== data.userId), data]),
    onStopTyping: (data) => setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId)),
    onMessageRead: (data) =>
      setMessages((prev) =>
        prev.map((m) =>
          m.id === data.messageId
            ? { ...m, readBy: [...m.readBy.filter((r) => r.userId !== data.userId), { userId: data.userId }] }
            : m
        )
      ),
    onMessageDeleted: (msgId) =>
      setMessages((prev) => prev.filter((m) => m.id !== msgId)),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) return null;

  let roomName = room?.name || '...';
  let roomIcon: React.ReactNode = room?.type === 'PRIVATE' ? '🔒' : '💬';
  let memberCountDisplay = `${room?._count?.members ?? 0} members`;

  if (room?.type === 'DIRECT' && user) {
    const otherMember = room.members?.find((m: any) => m.user?.id !== user.id)?.user;
    roomName = otherMember?.name || otherMember?.username || 'Direct Message';
    roomIcon = <img src={otherMember?.avatar} alt={otherMember?.username} className='h-full w-full object-cover rounded-[10px]' />
    memberCountDisplay = 'Direct Message';
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground transition-colors duration-300">
      {/* room header */}
      <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            id="back-btn"
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 sm:h-auto sm:w-auto sm:px-3"
            onClick={() => router.push('/chat')}
          >
            <ChevronLeft size={20} className="sm:hidden" />
            <span className="hidden sm:inline">← Back</span>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo-500 to-purple-500 text-lg shadow-sm">
              {roomIcon}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-bold leading-tight">{roomName}</div>
              <div className="text-xs text-muted-foreground">
                {memberCountDisplay}
              </div>
            </div>
          </div>
        </div>

        {room?.type !== 'DIRECT' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className={`lg:hidden ${showSidebar ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <Users size={20} />
          </Button>
        )}
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        {/* messages area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <div className="mb-3 text-4xl">👋</div>
                <p className="text-sm">No messages yet. Say hello!</p>
              </div>
            ) : (
              <div className="mx-auto flex max-w-[800px] flex-col gap-1">
                {messages.map((msg, i) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === user.id}
                    showAvatar={i === 0 || messages[i - 1]?.senderId !== msg.senderId}
                    isOnline={isOnline(msg.senderId)}
                    onDelete={msg.senderId === user.id ? () => deleteMessage(msg.id) : undefined}
                  />
                ))}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* typing indicators */}
          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.div
                key="typing-indicator"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="px-6 py-1 text-xs text-muted-foreground"
              >
                {typingUsers.map((u) => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing
                <span className="ml-1">
                  <span className="animate-pulse">...</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* message input */}
          <MessageInput onSend={sendMessage} onTypingStart={startTyping} onTypingStop={stopTyping} />
        </div>

        {room?.type !== 'DIRECT' && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-[320px] shrink-0">
              <RoomSidebar room={room} />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
              {showSidebar && (
                <motion.div
                  key="sidebar-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSidebar(false)}
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                />
              )}
              {showSidebar && (
                <motion.div
                  key="sidebar-content"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 right-0 top-0 z-50 w-[280px] bg-background shadow-2xl lg:hidden"
                >
                  <RoomSidebar room={room} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
