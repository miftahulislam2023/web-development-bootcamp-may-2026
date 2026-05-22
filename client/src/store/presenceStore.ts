import { create } from 'zustand';

interface PresenceState {
  onlineUsers: string[];
  setOnlineUsers: (users: string[]) => void;
  addUserOnline: (userId: string) => void;
  removeUserOffline: (userId: string) => void;
  isOnline: (userId: string) => boolean;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  addUserOnline: (userId) => 
    set((state) => ({ 
      onlineUsers: state.onlineUsers.includes(userId) 
        ? state.onlineUsers 
        : [...state.onlineUsers, userId] 
    })),
  removeUserOffline: (userId) => 
    set((state) => ({ 
      onlineUsers: state.onlineUsers.filter((id) => id !== userId) 
    })),
  isOnline: (userId) => get().onlineUsers.includes(userId),
}));
