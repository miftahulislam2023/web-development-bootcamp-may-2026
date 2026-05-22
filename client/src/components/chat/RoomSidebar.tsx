'use client';
import { Room } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Info, Shield, Loader2 } from 'lucide-react';

import { usePresenceStore } from '@/store/presenceStore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Props {
  room: Room | undefined;
}

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export default function RoomSidebar({ room }: Props) {
  const { isOnline } = usePresenceStore();
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState<string | null>(null);

  if (!room) return null;

  const members = room.members || [];

  const startDirectMessage = async (targetUserId: string) => {
    if (!currentUser || targetUserId === currentUser.id) return;
    setLoadingUser(targetUserId);
    try {
      const res = await api.post(`/rooms/direct/${targetUserId}`);
      router.push(`/chat/${res.data.room.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start conversation');
    } finally {
      setLoadingUser(null);
    }
  };

  return (
    <div className="flex h-full w-full flex-col border-l border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <Info size={16} /> Room Info
        </h3>
        <div className="mt-4">
          <h4 className="text-lg font-bold">{room.name}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{room.description || 'No description provided.'}</p>
        </div>
        
        <div className="mt-6 flex items-center gap-4 border-t border-border/40 pt-6">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Owner</span>
            <div className="mt-2 flex items-center gap-2">
              <div className="relative">
                <Avatar className="h-6 w-6">
                   {room.owner.avatar ? (
                    <AvatarImage
                      src={room.owner.avatar.startsWith('http') ? room.owner.avatar : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${room.owner.avatar}`}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="text-[10px]">{getInitials(room.owner.username)}</AvatarFallback>
                </Avatar>
                {isOnline(room.owner.id) && (
                  <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background bg-emerald-500" />
                )}
              </div>
              <span className="text-sm font-medium">{room.owner.username}</span>
              <Shield size={12} className="text-indigo-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="px-6 pb-2">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Users size={16} /> Members ({members.length})
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto px-6">
          <div className="flex flex-col gap-1 py-2">
            {members.map(({ user }) => {
              const isMe = currentUser?.id === user.id;
              return (
                <div 
                  key={user.id} 
                  className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${
                    !isMe ? 'cursor-pointer hover:bg-indigo-500/10 active:bg-indigo-500/20' : ''
                  }`}
                  onClick={() => !isMe && startDirectMessage(user.id)}
                >
                  <div className="relative shrink-0">
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-sm">
                    {user.avatar ? (
                      <AvatarImage
                        src={user.avatar.startsWith('http') ? user.avatar : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${user.avatar}`}
                        alt={user.username}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="bg-transparent text-white">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline(user.id) && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                  )}
                </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium">
                      {user.username} {isMe && <span className="text-xs text-muted-foreground">(You)</span>}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {isOnline(user.id) ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  {loadingUser === user.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
