import { create } from "zustand";
import { apiClient } from "@/lib/api";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  currency?: string;
  monthlyIncome?: number;
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (payload: Record<string, unknown>) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getProfile();
      set({
        user: response.data?.data ?? response.data,
        isAuthenticated: true,
      });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.login({ email, password });
      const token = response.data?.data?.accessToken;
      if (token && typeof window !== "undefined") {
        window.localStorage.setItem("accessToken", token);
      }
      await useAuthStore.getState().fetchUser();
    } finally {
      set({ isLoading: false });
    }
  },
  register: async (email, firstName, lastName, password) => {
    set({ isLoading: true });
    try {
      await apiClient.register({ email, firstName, lastName, password });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await apiClient.logout();
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("accessToken");
      }
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  updateUser: async (payload) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.updateProfile(payload);
      set({ user: response.data?.data ?? response.data });
    } finally {
      set({ isLoading: false });
    }
  },
}));
