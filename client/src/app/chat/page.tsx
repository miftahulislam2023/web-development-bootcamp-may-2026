'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import api from '@/lib/api';
import { Room, User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import Navbar from '@/components/shared/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NewDirectMessageModal from '@/components/chat/NewDirectMessageModal';
import { Plus, MessageCirclePlus, Globe, Star, MessageSquare } from 'lucide-react';

function getAvatarUrl(avatar: string | null | undefined) {
  if (!avatar) return null;
  return avatar.startsWith('http')
    ? avatar
    : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${avatar}`;
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function DirectRoomCard({ room, onClick, currentUser }: { room: Room; onClick: () => void; currentUser: Pick<User, 'id'> }) {
  const other = room.members?.find((m: any) => m.user?.id !== currentUser.id)?.user;
  const lastMsg = room.messages?.[0];
  const avatarUrl = getAvatarUrl(other?.avatar);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-md transition-all hover:border-pink-500/30 hover:bg-pink-500/5 hover:shadow-[0_0_0_1px_rgba(236,72,153,0.12)]"
    >
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-sm font-bold text-white shadow-md">
          {avatarUrl
            ? <img src={avatarUrl} alt={other?.username} className="h-full w-full object-cover" />
            : getInitials(other?.name || other?.username || 'DM')}
        </div>
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[15px] font-bold text-foreground">{other?.name || other?.username || 'Direct Message'}</span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(room.updatedAt), { addSuffix: true })}
          </span>
        </div>
        {lastMsg ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {lastMsg.content}
          </p>
        ) : (
          <p className="mt-0.5 text-xs text-muted-foreground/60 italic">No messages yet</p>
        )}
      </div>
    </motion.div>
  );
}

function RoomCard({ room, onClick, onRequestClick, onDeleteClick, onLeaveClick, isOwner, currentUser }: {
  room: Room; onClick: () => void; onRequestClick?: () => void; onDeleteClick?: () => void; onLeaveClick?: () => void; isOwner?: boolean; currentUser: Pick<User, 'id'>;
}) {
  const lastMsg = room.messages?.[0];
  const isMember = (room.members && room.members.length > 0) || isOwner;
  const pendingRequest = room.joinRequests?.find(r => r.status === 'PENDING');
  const isRejected = room.joinRequests?.find(r => r.status === 'REJECTED');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group relative rounded-2xl border border-border/50 bg-background/40 p-4 backdrop-blur-md transition-all hover:border-indigo-500/50 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.15)] sm:p-5"
    >
      <div
        className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4 ${isMember ? 'cursor-pointer' : ''}`}
        onClick={() => isMember && onClick()}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-lg shadow-sm sm:h-11 sm:w-11 sm:text-xl">
          {room.type === 'PRIVATE' ? '🔒' : '💬'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold sm:text-[15px]">{room.name}</span>
            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${
              room.type === 'PRIVATE' ? 'bg-red-500/15 text-red-500' : 'bg-indigo-500/15 text-indigo-400'
            }`}>
              {room.type}
            </span>
          </div>
          {room.description && (
            <p className="mb-2 line-clamp-2 text-xs text-muted-foreground sm:text-[13px]">{room.description}</p>
          )}
          {isMember && lastMsg && (
            <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
              <span className="font-medium text-foreground/80">{lastMsg.sender?.username}: </span>
              {lastMsg.content}
            </p>
          )}
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <div className="text-[11px] text-muted-foreground sm:text-xs">
            {formatDistanceToNow(new Date(room.updatedAt), { addSuffix: true })}
          </div>
          {room._count && (
            <div className="mt-1 text-[10px] text-muted-foreground sm:text-[11px]">👥 {room._count.members}</div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/20 pt-4">
        {isMember ? (
          <Button size="sm" variant="ghost" className="h-8 rounded-lg px-4 text-xs font-bold text-indigo-400 hover:bg-indigo-500/10" onClick={onClick}>
            Enter Chat →
          </Button>
        ) : room.type === 'PUBLIC' ? (
          <Button size="sm" className="h-8 rounded-lg bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700" onClick={onClick}>
            Join Room
          </Button>
        ) : pendingRequest ? (
          <Button size="sm" disabled className="h-8 rounded-lg bg-amber-500/10 px-4 text-xs font-bold text-amber-500 opacity-100">
            Request Pending
          </Button>
        ) : isRejected ? (
          <Button size="sm" disabled className="h-8 rounded-lg bg-red-500/10 px-4 text-xs font-bold text-red-500 opacity-100">
            Access Denied
          </Button>
        ) : (
          <Button size="sm" className="h-8 rounded-lg bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700" onClick={onClick}>
            Request Access
          </Button>
        )}

        {isOwner && room.type === 'PRIVATE' && (
          <Button size="sm" variant="outline" className="h-8 rounded-lg border-indigo-500/30 px-3 text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/10"
            onClick={(e) => { e.stopPropagation(); onRequestClick?.(); }}>
            Manage Requests
          </Button>
        )}

        {isOwner && (
          <Button size="sm" variant="destructive" className="h-8 rounded-lg px-3 text-[10px] font-bold"
            onClick={(e) => { e.stopPropagation(); onDeleteClick?.(); }}>
            Delete
          </Button>
        )}

        {!isOwner && isMember && (
          <Button size="sm" variant="outline" className="h-8 rounded-lg border-red-500/30 px-3 text-[10px] font-bold text-red-400 hover:bg-red-500/10"
            onClick={(e) => { e.stopPropagation(); onLeaveClick?.(); }}>
            Leave
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function JoinRequestsModal({ roomId, onClose }: { roomId: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['room-requests', roomId],
    queryFn: () => api.get(`/rooms/${roomId}/requests`).then((r) => r.data.requests),
  });

  const mutation = useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: 'ACCEPTED' | 'REJECTED' }) =>
      api.post('/rooms/requests/respond', { requestId, status }),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['room-requests', roomId] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] });
      toast.success(`Request ${status === 'ACCEPTED' ? 'accepted' : 'rejected'}`);
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-3xl border border-border/50 bg-background/80 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-6 text-xl font-bold tracking-tight">Join Requests</h2>
        {isLoading ? (
          <div className="py-10 text-center">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">No pending requests</div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((req: any) => (
              <div key={req.id} className="flex items-center justify-between gap-4 rounded-xl border border-border/40 bg-background/40 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-indigo-500">
                    {req.user.avatar && <img src={getAvatarUrl(req.user.avatar)!} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{req.user.username}</div>
                    <div className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-400/10" onClick={() => mutation.mutate({ requestId: req.id, status: 'REJECTED' })}>Reject</Button>
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" onClick={() => mutation.mutate({ requestId: req.id, status: 'ACCEPTED' })}>Accept</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button variant="outline" className="mt-6 w-full rounded-xl" onClick={onClose}>Close</Button>
      </motion.div>
    </motion.div>
  );
}

function CreateRoomModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', description: '', type: 'PUBLIC' as 'PUBLIC' | 'PRIVATE' });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.post('/rooms', form).then((r) => r.data.room),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] });
      toast.success('Room created!');
      onClose();
    },
    onError: () => toast.error('Failed to create room'),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6 bg-background/95 backdrop-blur-xl"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[calc(100%-2rem)] rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl p-5 shadow-2xl sm:max-w-[440px] sm:p-8">
        <h2 className="mb-5 text-lg font-bold tracking-tight sm:mb-6 sm:text-xl">Create New Room</h2>
        <div className="flex flex-col gap-3 sm:gap-4">
          <Input id="room-name" placeholder="Room name" value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="h-10 rounded-xl bg-background/50 text-[13px] sm:h-11 sm:text-[14px]" />
          <Input id="room-desc" placeholder="Description (optional)" value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="h-10 rounded-xl bg-background/50 text-[13px] sm:h-11 sm:text-[14px]" />
          <div className="flex gap-2">
            {(['PUBLIC', 'PRIVATE'] as const).map((t) => (
              <Button key={t} id={`type-${t.toLowerCase()}`} onClick={() => setForm((p) => ({ ...p, type: t }))}
                variant={form.type === t ? 'default' : 'outline'}
                className={`flex-1 rounded-xl text-xs sm:text-sm ${form.type === t
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent'
                  : 'bg-background/50 text-muted-foreground'}`}>
                {t === 'PUBLIC' ? '🌐' : '🔒'} {t}
              </Button>
            ))}
          </div>
          <div className="mt-2 flex gap-3">
            <Button variant="ghost" className="h-10 flex-1 rounded-xl text-sm sm:h-11" onClick={onClose}>Cancel</Button>
            <Button id="create-room-submit"
              className="h-10 flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-sm shadow-md sm:h-11"
              disabled={!form.name.trim() || mutation.isPending}
              onClick={() => mutation.mutate()}>
              {mutation.isPending ? 'Creating...' : 'Create Room'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

type Tab = 'all' | 'my' | 'direct';

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [showNewDM, setShowNewDM] = useState(false);
  const [requestRoomId, setRequestRoomId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('all');

  useSocket();

  const { data: allRooms = [], isLoading: loadingAll } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: () => api.get('/rooms').then((r) => r.data.rooms),
    enabled: !!user,
  });

  const { data: myRooms = [], isLoading: loadingMy } = useQuery<Room[]>({
    queryKey: ['my-rooms'],
    queryFn: () => api.get('/rooms/my').then((r) => r.data.rooms.filter((rm: Room) => rm.type !== 'DIRECT')),
    enabled: !!user && tab === 'my',
  });

  const publicPrivateRooms = allRooms.filter(r => r.type !== 'DIRECT');
  const directRooms = allRooms.filter(r => r.type === 'DIRECT');

  const rooms = tab === 'all' ? publicPrivateRooms : tab === 'my' ? myRooms : directRooms;
  const isLoading = tab === 'all' ? loadingAll : tab === 'my' ? loadingMy : loadingAll;

  const handleJoinAndOpen = async (roomId: string) => {
    try {
      const { data } = await api.post(`/rooms/${roomId}/join`);
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] });
      if (data.message === 'Join request sent to owner') {
        toast.success(data.message);
      } else {
        router.push(`/chat/${roomId}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to join room');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">Delete this room?</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 border-white/10" onClick={() => toast.dismiss(t.id)}>Cancel</Button>
          <Button size="sm" variant="destructive" className="flex-1" onClick={async () => {
            toast.dismiss(t.id);
            try {
              await api.delete(`/rooms/${roomId}`);
              queryClient.invalidateQueries({ queryKey: ['rooms'] });
              queryClient.invalidateQueries({ queryKey: ['my-rooms'] });
              toast.success('Room deleted');
            } catch (err: any) {
              toast.error(err.response?.data?.message || 'Failed to delete');
            }
          }}>Delete</Button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleLeaveRoom = async (roomId: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">Leave this room?</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 border-white/10" onClick={() => toast.dismiss(t.id)}>Cancel</Button>
          <Button size="sm" variant="destructive" className="flex-1" onClick={async () => {
            toast.dismiss(t.id);
            try {
              await api.delete(`/rooms/${roomId}/leave`);
              queryClient.invalidateQueries({ queryKey: ['rooms'] });
              queryClient.invalidateQueries({ queryKey: ['my-rooms'] });
              toast.success('Left room');
            } catch (err: any) {
              toast.error(err.response?.data?.message || 'Failed to leave');
            }
          }}>Leave</Button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (!user) return null;

  const TABS = [
    { key: 'all', label: 'All Rooms', icon: Globe, count: publicPrivateRooms.length },
    { key: 'my', label: 'My Rooms', icon: Star, count: myRooms.length },
    { key: 'direct', label: 'Direct', icon: MessageSquare, count: directRooms.length },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              Chat <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Rooms</span>
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Join conversations or message someone directly
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              id="new-dm-btn"
              variant="outline"
              className="flex-1 rounded-xl border-pink-500/30 bg-pink-500/5 px-4 py-2 text-sm text-pink-400 shadow-sm hover:bg-pink-500/10 sm:flex-none sm:px-5"
              onClick={() => setShowNewDM(true)}
            >
              <MessageCirclePlus size={16} className="mr-2" /> New DM
            </Button>
            <Button
              id="create-room-btn"
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:-translate-y-[1px] sm:flex-none sm:px-5"
              onClick={() => setShowCreate(true)}
            >
              <Plus size={16} className="mr-2" /> New Room
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex w-full gap-1 overflow-x-auto rounded-[14px] border border-border/40 bg-background/40 p-1 backdrop-blur-md sm:mb-6 sm:w-fit">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <Button
              key={key}
              id={`tab-${key}`}
              variant="ghost"
              onClick={() => setTab(key)}
              className={`relative flex-1 items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:flex-none sm:px-6 sm:text-sm ${
                tab === key
                  ? key === 'direct'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
              }`}
            >
              <Icon size={14} className="inline" />
              <span className="whitespace-nowrap ml-1">{label}</span>
              {count !== undefined && count > 0 && (
                <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === key ? 'bg-white/20' : 'bg-pink-500/20 text-pink-400'}`}>
                  {count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[110px] animate-pulse rounded-2xl border border-border/50 bg-background/40" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground sm:py-20">
            <div className="mb-3 text-4xl sm:mb-4 sm:text-5xl">
              {tab === 'direct' ? '💬' : '🏠'}
            </div>
            <p className="text-sm font-semibold text-foreground/80 sm:text-base">
              {tab === 'direct' ? 'No direct messages yet' : 'No rooms yet'}
            </p>
            <p className="mt-1 text-xs sm:mt-2 sm:text-sm">
              {tab === 'direct' ? 'Click "New DM" to start a private conversation' : 'Be the first to create a room!'}
            </p>
            {tab === 'direct' && (
              <Button
                className="mt-5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 text-sm shadow-md"
                onClick={() => setShowNewDM(true)}
              >
                <MessageCirclePlus size={16} className="mr-2" /> Start a Conversation
              </Button>
            )}
          </div>
        ) : tab === 'direct' ? (
          <div className="flex flex-col gap-3">
            {rooms.map((room) => (
              <DirectRoomCard
                key={room.id}
                room={room}
                onClick={() => router.push(`/chat/${room.id}`)}
                currentUser={user}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onClick={() => handleJoinAndOpen(room.id)}
                isOwner={room.ownerId === user.id}
                onRequestClick={() => setRequestRoomId(room.id)}
                onDeleteClick={() => handleDeleteRoom(room.id)}
                onLeaveClick={() => handleLeaveRoom(room.id)}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && <CreateRoomModal onClose={() => setShowCreate(false)} />}
        {showNewDM && <NewDirectMessageModal onClose={() => setShowNewDM(false)} />}
        {requestRoomId && <JoinRequestsModal roomId={requestRoomId} onClose={() => setRequestRoomId(null)} />}
      </AnimatePresence>
    </div>
  );
}