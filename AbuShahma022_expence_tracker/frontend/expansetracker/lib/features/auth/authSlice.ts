import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit"

import {
  AuthState,
  User,
} from "@/types/auth.types"

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.loading = action.payload
    },

    setUser: (
      state,
      action: PayloadAction<User | null>
    ) => {
      state.user = action.payload
    },

    setError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.error = action.payload
    },

    logout: (state) => {
      state.user = null
    },
  },
})

export const {
  setLoading,
  setUser,
  setError,
  logout,
} = authSlice.actions

export default authSlice.reducer