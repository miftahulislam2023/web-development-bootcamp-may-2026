'use client';
import { Message } from '@/types';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';

interface Props {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  isOnline: boolean;
  onDelete?: () => void;
}

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export default function MessageBubble({ message, isOwn, showAvatar, isOnline, onDelete }: Props) {
  return (
    <div className={`group flex items-end gap-2.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'} ${showAvatar ? 'mb-3' : 'mb-0.5'}`}>
      {/* Avatar */}
      {!isOwn && (
        <div className="relative w-8 shrink-0">
          {showAvatar && (
            <>
              <Avatar className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-sm">
                {message.sender.avatar ? (
                  <AvatarImage
                    src={message.sender.avatar.startsWith('http') ? message.sender.avatar : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${message.sender.avatar}`}
                    alt={message.sender.username}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-transparent text-white">
                  {getInitials(message.sender.username)}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#07070f] bg-emerald-500" />
              )}
            </>
          )}
        </div>
      )}

      <div className={`flex max-w-[70%] flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {showAvatar && !isOwn && (
          <span className="mb-1 ml-1 text-[11px] text-muted-foreground">
            {message.sender.username}
          </span>
        )}

        <div className={`relative break-word rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isOwn
            ? 'rounded-br-sm bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_4px_16px_rgba(99,102,241,0.25)]'
            : 'rounded-bl-sm border border-border/50 bg-background/40 text-slate-600 dark:text-slate-200 backdrop-blur-sm'
        }`}>
          {message.content}
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">
            {format(new Date(message.createdAt), 'HH:mm')}
          </span>
          {isOwn && message.readBy.length > 1 && (
            <span className="text-[11px] font-semibold text-indigo-400">✓✓</span>
          )}
        </div>
      </div>

      {isOwn && onDelete && (
        <button
          onClick={onDelete}
          className="mb-6 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
          title="Delete message"
        >
          <Trash2 size={14} className="text-muted-foreground hover:text-red-500" />
        </button>
      )}
    </div>
  );
}
