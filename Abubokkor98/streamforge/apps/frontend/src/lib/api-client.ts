import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios"
import { useAuthStore } from "@/lib/auth-store"

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// Fallback to empty string in production to use Next.js rewrites (relative paths),
// preventing cross-origin 3rd-party cookie blocking by Brave/Safari.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000")

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// ── Request interceptor: attach access token ──
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Endpoints that return 401 intentionally (bad credentials, not expired token) ──
const SKIP_REFRESH_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/reset-password",
]

const shouldSkipRefresh = (url: string | undefined): boolean =>
  SKIP_REFRESH_PATHS.some((path) => url?.includes(path))

// ── Shared refresh promise — prevents concurrent refreshes ──
let refreshTokenPromise: Promise<string> | null = null

const resetRefreshState = (): void => {
  refreshTokenPromise = null
}

// ── Response interceptor: handle 401 + auto-refresh ──
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url) &&
      typeof window !== "undefined" // Skip refresh on server — no browser cookies available
    ) {
      originalRequest._retry = true

      // If already refreshing, wait for that promise
      if (refreshTokenPromise) {
        try {
          const newToken = await refreshTokenPromise
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }

      // Start new refresh attempt
      refreshTokenPromise = (async () => {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/auth/refresh`,
            {},
            { withCredentials: true },
          )

          const { accessToken } = response.data.data
          if (!accessToken) {
            throw new Error("Token refresh returned no access token")
          }

          useAuthStore.getState().setToken(accessToken)
          return accessToken
        } catch (refreshError: unknown) {
          const isAuthError =
            isAxiosError(refreshError) &&
            (refreshError.response?.status === 401 ||
              refreshError.response?.status === 403)

          if (isAuthError) {
            useAuthStore.getState().logout()

            if (typeof window !== "undefined") {
              window.location.href = "/login"
            }
          }

          throw refreshError
        } finally {
          resetRefreshState()
        }
      })()

      try {
        const newToken = await refreshTokenPromise
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
