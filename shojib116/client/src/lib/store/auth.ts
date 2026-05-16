import { writable, type Readable } from "svelte/store";
import type { User } from "$lib/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthStore extends Readable<AuthState> {
  init: (user: User) => void;
  setUser: (user: User) => void;
  updateUser: (patch: Partial<User>) => void;
  clear: () => void;
}

function createAuthStore(): AuthStore {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  return {
    subscribe,

    init: (user: User) => set({ user, isAuthenticated: true }),

    setUser: (user: User) => set({ user, isAuthenticated: true }),

    updateUser: (patch: Partial<User>) =>
      update((state) => ({
        ...state,
        user: state.user ? { ...state.user, ...patch } : null,
      })),

    clear: () => set({ user: null, isAuthenticated: false }),
  };
}

export const authStore = createAuthStore();
