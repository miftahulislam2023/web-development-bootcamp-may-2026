"use client"

import { useState } from "react"
import { useActionState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/api-client"
import { toast } from "sonner"
import type { Room } from "@/lib/types/room"

interface EditRoomState {
  error: string | null
  fieldErrors: {
    title?: string
    description?: string
    slowModeInterval?: string
  }
}

const INITIAL_STATE: EditRoomState = { error: null, fieldErrors: {} }
const ROOMS_ENDPOINT = "/api/rooms"
const TITLE_MAX_LENGTH = 100
const DESCRIPTION_MAX_LENGTH = 500
const SLOW_MODE_MIN = 1
const SLOW_MODE_MAX = 60

export function useEditRoomAction(roomKey: string) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  async function editRoomAction(
    _prevState: EditRoomState,
    formData: FormData,
  ): Promise<EditRoomState> {
    const rawTitle = formData.get("title")
    const rawDescription = formData.get("description")
    const rawSlowMode = formData.get("slowModeInterval")
    const guestChatEnabled = formData.get("guestChatEnabled") === "on"

    if (typeof rawTitle !== "string" || !rawTitle.trim()) {
      return { error: null, fieldErrors: { title: "Title cannot be empty." } }
    }

    const title = rawTitle.trim()
    const description =
      typeof rawDescription === "string" ? rawDescription.trim() : undefined

    const fieldErrors: EditRoomState["fieldErrors"] = {}

    if (title.length > TITLE_MAX_LENGTH) {
      fieldErrors.title = `Title must not exceed ${TITLE_MAX_LENGTH} characters.`
    }

    if (description && description.length > DESCRIPTION_MAX_LENGTH) {
      fieldErrors.description = `Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters.`
    }

    let slowModeInterval: number | null = null
    if (typeof rawSlowMode === "string" && rawSlowMode.trim()) {
      const parsed = Number(rawSlowMode)
      if (!Number.isInteger(parsed) || parsed < SLOW_MODE_MIN || parsed > SLOW_MODE_MAX) {
        fieldErrors.slowModeInterval = `Must be between ${SLOW_MODE_MIN}–${SLOW_MODE_MAX} seconds.`
      } else {
        slowModeInterval = parsed
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { error: null, fieldErrors }
    }

    try {
      await axiosInstance.patch<{
        status: string
        data: Room
      }>(`${ROOMS_ENDPOINT}/${roomKey}`, {
        title,
        description: description || null,
        slowModeInterval,
        guestChatEnabled,
      })

      toast.success("Room updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["rooms", "mine"] })
      setIsOpen(false)

      return INITIAL_STATE
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update room."
      toast.error(message)
      return { ...INITIAL_STATE, error: message }
    }
  }

  const [state, action] = useActionState(editRoomAction, INITIAL_STATE)

  return { state, action, isOpen, setIsOpen }
}
