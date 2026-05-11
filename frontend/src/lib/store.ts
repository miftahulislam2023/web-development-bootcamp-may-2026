// src/lib/store.ts
import { create } from "zustand";
import { apiClient } from "./api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  role: string;
  avatarUrl?: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateUser: (data: Record<string, any>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.login(email, password);
      if (response.data?.user) {
        set({ user: response.data.user, isAuthenticated: true });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) => {
    set({ isLoading: true });
    try {
      await apiClient.register(email, firstName, lastName, password);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiClient.logout();
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getProfile();
      if (response.data) {
        set({ user: response.data, isAuthenticated: true });
      }
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (data: Record<string, any>) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.updateProfile(data);
      if (response.data) {
        set({ user: response.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

interface UiStore {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isDialogOpen: false,
  openDialog: () => set({ isDialogOpen: true }),
  closeDialog: () => set({ isDialogOpen: false }),
  isSidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
