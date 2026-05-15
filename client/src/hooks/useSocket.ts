'use client';
import { useEffect } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import { usePresenceStore } from '@/store/presenceStore';
import { Message, TypingUser } from '@/types';

interface UseSocketOptions {
  roomId?: string;
  onNewMessage?: (msg: Message) => void;
  onRoomHistory?: (msgs: Message[]) => void;
  onTyping?: (user: TypingUser) => void;
  onStopTyping?: (data: { userId: string; roomId: string }) => void;
  onMessageRead?: (data: { messageId: string; userId: string }) => void;
  onMessageDeleted?: (messageId: string) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (userId: string) => void;
}

export const useSocket = ({
  roomId,
  onNewMessage,
  onRoomHistory,
  onTyping,
  onStopTyping,
  onMessageRead,
  onMessageDeleted,
  onUserOnline,
  onUserOffline,
}: UseSocketOptions = {}) => {
  const { user } = useAuthStore();
  const { setOnlineUsers, addUserOnline, removeUserOffline } = usePresenceStore();

  useEffect(() => {
    if (!user) return;
    const socket = connectSocket();

    if (roomId) socket.emit('join_room', roomId);
    if (onRoomHistory) socket.on('room_history', onRoomHistory);
    if (onNewMessage) socket.on('new_message', onNewMessage);
    if (onTyping) socket.on('user_typing', onTyping);
    if (onStopTyping) socket.on('user_stop_typing', onStopTyping);
    if (onMessageRead) socket.on('message_read', onMessageRead);
    if (onMessageDeleted) socket.on('message_deleted', onMessageDeleted);
    
    // Default presence handlers + custom callbacks
    socket.on('online_users_list', (users: string[]) => setOnlineUsers(users));
    
    socket.on('user_online', (userId: string) => {
      addUserOnline(userId);
      if (onUserOnline) onUserOnline(userId);
    });
    
    socket.on('user_offline', (userId: string) => {
      removeUserOffline(userId);
      if (onUserOffline) onUserOffline(userId);
    });

    return () => {
      if (roomId) socket.emit('leave_room', roomId);
      socket.off('room_history');
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
      socket.off('message_read');
      socket.off('message_deleted');
      socket.off('online_users_list');
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, [user, roomId]);

  const sendMessage = (content: string, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT') => {
    if (!roomId) return;
    getSocket().emit('send_message', { roomId, content, type });
  };

  const startTyping = () => roomId && getSocket().emit('typing_start', roomId);
  const stopTyping = () => roomId && getSocket().emit('typing_stop', roomId);
  const markRead = (messageId: string) => getSocket().emit('mark_read', messageId);
  const deleteMessage = (messageId: string) => getSocket().emit('delete_message', messageId);

  return { sendMessage, startTyping, stopTyping, markRead, deleteMessage };
};
