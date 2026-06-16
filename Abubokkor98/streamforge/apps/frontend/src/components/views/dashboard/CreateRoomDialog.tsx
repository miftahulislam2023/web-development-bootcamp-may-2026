"use client"

import { useCreateRoomAction } from "@/hooks/useCreateRoomAction"
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
import { PlusCircle } from "@phosphor-icons/react"

interface CreateRoomDialogProps {
  trigger?: React.ReactNode
}

/**
 * Modal dialog for creating a new streaming room.
 * Uses React 19 <form action={fn}> + useActionState internally.
 * On success: closes dialog + invalidates React Query room cache.
 */
function CreateRoomDialog({ trigger }: CreateRoomDialogProps) {
  const { state, action, isOpen, setIsOpen } = useCreateRoomAction()

  const defaultTrigger = (
    <Button className="gap-2">
      <PlusCircle className="size-4" aria-hidden="true" />
      Create Room
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new room</DialogTitle>
          <DialogDescription>
            Set up your streaming room. You can edit settings later.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4">
          <FormAlert message={state.error} />

          <RoomFormFields
            idPrefix="create-room"
            fieldErrors={state.fieldErrors}
          />

          <DialogFooter>
            <SubmitButton className="w-full sm:w-auto" pendingText="Creating…">
              Create Room
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CreateRoomDialog }
