/** Backend wraps all endpoints in this envelope */
interface ApiResponse<T> {
  status: string
  data: T
}

export type { ApiResponse }
