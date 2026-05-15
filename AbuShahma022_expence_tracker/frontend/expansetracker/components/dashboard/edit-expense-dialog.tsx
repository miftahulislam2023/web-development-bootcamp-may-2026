"use client"

import {
  useEffect,
  useState,
} from "react"

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

import { Label } from "@/components/ui/label"

import {
  getSingleExpenseApi,
  updateExpenseApi,
} from "@/services/expense.api"

interface EditExpenseDialogProps {
  open: boolean

  setOpen: (
    open: boolean
  ) => void

  expenseId: string

  refetchExpenses: () => void
}

function EditExpenseDialog({
  open,
  setOpen,
  expenseId,
  refetchExpenses,
}: EditExpenseDialogProps) {

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState({
      title: "",
      amount: "",
      note: "",
    })

  // fetch single expense
  const getExpense =
    async () => {
      try {
        const response =
          await getSingleExpenseApi(
            expenseId
          )

        const expense =
          response.data

        setFormData({
          title:
            expense.title || "",

          amount:
            expense.amount || "",

          note:
            expense.note || "",
        })
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(() => {
    if (expenseId && open) {
      getExpense()
    }
  }, [expenseId, open])

  // input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,

      [e.target.name]:
        e.target.value,
    }))
  }

  // update expense
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault()

      try {
        setLoading(true)

        await updateExpenseApi(
          expenseId,
          {
            title:
              formData.title,

            amount:
              Number(
                formData.amount
              ),

            note:
              formData.note,
          }
        )

        toast.success(
          "Expense updated"
        )

        refetchExpenses()

        setOpen(false)
      } catch (error) {
        console.log(error)

        toast.error(
          "Failed to update expense"
        )
      } finally {
        setLoading(false)
      }
    }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>

      <DialogContent className="sm:max-w-lg">

        <DialogHeader>

          <DialogTitle>
            Edit Expense
          </DialogTitle>

          <DialogDescription>
            Update your expense information.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5">

          {/* Title */}
          <div className="space-y-2">

            <Label>
              Title
            </Label>

            <Input
              name="title"
              value={formData.title}
              onChange={
                handleChange
              }
              placeholder="Expense title"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">

            <Label>
              Amount
            </Label>

            <Input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={
                handleChange
              }
              placeholder="Expense amount"
            />
          </div>

          {/* Note */}
          <div className="space-y-2">

            <Label>
              Note
            </Label>

            <Input
              name="note"
              value={formData.note}
              onChange={
                handleChange
              }
              placeholder="Expense note"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full">

            {loading
              ? "Updating..."
              : "Update Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditExpenseDialog