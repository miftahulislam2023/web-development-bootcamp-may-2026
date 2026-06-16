"use client"

import { useState } from "react"
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
import { StopCircle } from "@phosphor-icons/react"

interface EndStreamDialogProps {
  onConfirm: () => Promise<void>
}

function EndStreamDialog({ onConfirm }: EndStreamDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEnding, setIsEnding] = useState(false)

  async function handleConfirm() {
    setIsEnding(true)
    try {
      await onConfirm()
      setIsOpen(false)
    } finally {
      setIsEnding(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="size-12 rounded-full"
          aria-label="End stream"
        >
          <StopCircle className="size-5" weight="fill" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Stream?</DialogTitle>
          <DialogDescription>
            This will disconnect all viewers and end the broadcast. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isEnding}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isEnding}
          >
            {isEnding ? "Ending…" : "End Stream"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { EndStreamDialog }
