/**
 * Safe sessionStorage wrapper — handles SSR, disabled storage,
 * and quota errors without crashing. Logs errors in development.
 *
 * Stores plain strings only (no JSON serialization needed for our use case).
 */

function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false

  try {
    const testKey = "__storage_test__"
    window.sessionStorage.setItem(testKey, "1")
    window.sessionStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export const safeSessionStorage = {
  getItem(key: string): string | null {
    if (!isStorageAvailable()) return null

    try {
      return window.sessionStorage.getItem(key)
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(`[safeSessionStorage] Failed to read "${key}"`, error)
      }
      return null
    }
  },

  setItem(key: string, value: string): void {
    if (!isStorageAvailable()) return

    try {
      window.sessionStorage.setItem(key, value)
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(`[safeSessionStorage] Failed to write "${key}"`, error)
      }
    }
  },

  removeItem(key: string): void {
    if (!isStorageAvailable()) return

    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(`[safeSessionStorage] Failed to remove "${key}"`, error)
      }
    }
  },
}
