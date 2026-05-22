import { create } from "zustand";

interface UIState {
  isSearchOpen: boolean;
  isSidebarOpen: boolean;
}

interface UIActions {
  setSearchOpen: (v: boolean) => void;
  toggleSidebar: () => void;
}

type UIStore = UIState & UIActions;

/**
 * @description
 * UI store for managing UI state
 */
export const useUIStore = create<UIStore>()((set) => ({
  isSearchOpen: false,
  setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
  isSidebarOpen: true,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
}));
