"use client"

import { useEffect } from "react"

import { useAppDispatch } from "@/lib/hook"

import {
  setLoading,
  setUser,
} from "@/lib/features/auth/authSlice"

import { getCurrentUserApi } from "@/services/auth.api"

export default function AuthInitializer() {
  const dispatch =
    useAppDispatch()

  useEffect(() => {
    const loadUser = async () => {
      try {
        dispatch(setLoading(true))

        const response =
          await getCurrentUserApi()

        dispatch(
          setUser(response.data)
        )
      } catch (error) {
        dispatch(setUser(null))
      } finally {
        dispatch(setLoading(false))
      }
    }

    loadUser()
  }, [dispatch])

  return null
}