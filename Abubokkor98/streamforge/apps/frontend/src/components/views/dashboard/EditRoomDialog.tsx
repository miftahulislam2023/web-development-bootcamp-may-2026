"use client"

import { useEditRoomAction } from "@/hooks/useEditRoomAction"
import { RoomFormFields } from "@/components/shared/room-form-fields"
import { FormAlert } from "@/components/shared/form-alert"
import { SubmitButton } from "@/components/shared/submit-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil } from "@phosphor-icons/react"
import type { Room } from "@/lib/types/room"

interface EditRoomDialogProps {
  room: Room
  trigger?: React.ReactNode
}

/**
 * Modal dialog for editing an existing streaming room.
 * Uses React 19 <form action={fn}> + useActionState internally.
 * On success: closes dialog + invalidates React Query room cache.
 */
function EditRoomDialog({ room, trigger }: EditRoomDialogProps) {
  const { state, action, isOpen, setIsOpen } = useEditRoomAction(room.roomKey)

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-1.5">
      <Pencil className="size-3.5" aria-hidden="true" />
      Edit
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit room</DialogTitle>
          <DialogDescription>
            Update your room settings. Changes take effect immediately.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <FormAlert message={state.error} />

          <RoomFormFields
            idPrefix="edit-room"
            defaultValues={room}
            fieldErrors={state.fieldErrors}
          />

          <DialogFooter>
            <SubmitButton className="w-full sm:w-auto" pendingText="Saving…">
              Save Changes
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { EditRoomDialog }
