import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: number
  name: string
  email: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  hasHydrated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const selectIsAuthenticated = (state: AuthState): boolean =>
  !!state.user && !!state.accessToken

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ accessToken: token }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "sf-auth-storage",
      // Only persist user — accessToken stays in-memory for security.
      // After page refresh, the interceptor refreshes via HttpOnly cookie.
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true
        }
      },
    },
  ),
)

export const useIsAuthenticated = (): boolean =>
  useAuthStore(selectIsAuthenticated)
