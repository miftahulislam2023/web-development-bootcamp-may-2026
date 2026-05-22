import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  _hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setHasHydrated: (state: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, name: string, email: string, password: string, avatar?: File) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      _hasHydrated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        if (token) localStorage.setItem('chat_token', token);
        else localStorage.removeItem('chat_token');
      },
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      login: async (email, password) => {
        set({ isLoading: true });
        const { data } = await api.post('/auth/login', { email, password });
        get().setToken(data.token);
        set({ user: data.user, isLoading: false });
      },

      register: async (username, name, email, password, avatar) => {
        set({ isLoading: true });
        const formData = new FormData();
        formData.append('username', username);
        if (name) formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        if (avatar) formData.append('avatar', avatar);

        const { data } = await api.post('/auth/register', formData);
        get().setToken(data.token);
        set({ user: data.user, isLoading: false });
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          get().setToken(null);
          set({ user: null });
          localStorage.removeItem('chat_token');
        }
      },

      hydrate: async () => {
        const token = get().token;
        if (!token) return;
        
        set({ isLoading: true });
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user, isLoading: false });
        } catch (err: any) {
          console.error('Hydration error:', err);
          if (err.response?.status === 401) {
            get().setToken(null);
            set({ user: null, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        }
      },
    }),
    { 
      name: 'chat-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
