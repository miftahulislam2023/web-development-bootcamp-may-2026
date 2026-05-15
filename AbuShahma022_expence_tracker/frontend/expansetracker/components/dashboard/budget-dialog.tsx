"use client"

import { useState } from "react"

import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { createBudgetApi } from "@/services/budget.api"

interface BudgetDialogProps {
  open: boolean

  setOpen: (
    open: boolean
  ) => void
}

export default function BudgetDialog({
  open,
  setOpen,
}: BudgetDialogProps) {

  const currentMonth =
    new Date().getMonth() + 1

  const currentYear =
    new Date().getFullYear()

  const [loading, setLoading] =
    useState(false)

  const [amount, setAmount] =
    useState("")

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault()

      try {
        setLoading(true)

        await createBudgetApi({
          amount: Number(amount),

          month: currentMonth,

          year: currentYear,
        })

        toast.success(
          "Budget saved"
        )

        setAmount("")

        setOpen(false)
        window.location.reload()
      } catch (error) {
        console.log(error)

        toast.error(
          "Failed to save budget"
        )
      } finally {
        setLoading(false)
      }
    }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>

      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>
            Monthly Budget
          </DialogTitle>

          <DialogDescription>
            Set your monthly spending budget.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5">

          <Input
            type="number"
            placeholder="Enter budget amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full">

            {loading
              ? "Saving..."
              : "Save Budget"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}