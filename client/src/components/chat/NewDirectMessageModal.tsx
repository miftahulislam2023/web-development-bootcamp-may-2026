'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { User } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, MessageCircle, Loader2 } from 'lucide-react';

function getAvatarUrl(avatar: string | null) {
  if (!avatar) return null;
  return avatar.startsWith('http')
    ? avatar
    : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${avatar}`;
}

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

const GRADIENT_COLORS = [
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-500',
];

function userGradient(username: string) {
  const idx = username.charCodeAt(0) % GRADIENT_COLORS.length;
  return GRADIENT_COLORS[idx];
}

export default function NewDirectMessageModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['all-users', search],
    queryFn: () =>
      api.get('/rooms/users', { params: { search } }).then((r) => r.data.users),
    staleTime: 10_000,
  });

  const startDM = async (userId: string) => {
    setLoadingId(userId);
    try {
      const res = await api.post(`/rooms/direct/${userId}`);
      router.push(`/chat/${res.data.room.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start conversation');
      setLoadingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[480px] overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f1a] shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">New Direct Message</h2>
            <p className="mt-0.5 text-xs text-white/40">Search and start a private conversation</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="relative px-6 py-4">
          <Search size={15} className="absolute left-9 top-1/2 -translate-y-1/2 text-white/30" />
          <Input
            autoFocus
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border-white/10 bg-white/5 pl-8 text-sm text-white placeholder:text-white/30 focus-visible:ring-indigo-500/40"
          />
        </div>

        {/* User list */}
        <div className="max-h-[360px] overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <div className="flex flex-col gap-2 py-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[62px] animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-2 text-3xl">🔍</div>
              <p className="text-sm text-white/40">No users found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {users.map((u) => (
                <motion.button
                  key={u.id}
                  whileHover={{ x: 2 }}
                  onClick={() => startDM(u.id)}
                  disabled={loadingId === u.id}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-white/5 px-4 py-3 text-left transition-all hover:border-indigo-500/30 hover:bg-indigo-500/10 disabled:opacity-60"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${userGradient(u.username)} text-xs font-bold text-white shadow-md`}>
                      {getAvatarUrl(u.avatar)
                        ? <img src={getAvatarUrl(u.avatar)!} alt={u.username} className="h-full w-full rounded-full object-cover" />
                        : getInitials(u.username)
                      }
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f0f1a] bg-emerald-500" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-white">{u.username}</div>
                    {u.name && <div className="truncate text-xs text-white/40">{u.name}</div>}
                  </div>

                  {/* Action */}
                  {loadingId === u.id ? (
                    <Loader2 size={16} className="shrink-0 animate-spin text-indigo-400" />
                  ) : (
                    <MessageCircle size={16} className="shrink-0 text-white/20 transition group-hover:text-indigo-400" />
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
