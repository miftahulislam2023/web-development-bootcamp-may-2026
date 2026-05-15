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
  createExpenseApi,
} from "@/services/expense.api"

import {
  getCategoriesApi,
} from "@/services/category.api"

interface Category {
  _id: string
  name: string
}

interface CreateExpenseDialogProps {
  open: boolean

  setOpen: (
    open: boolean
  ) => void

  refetchExpenses: () => void
}

export default function CreateExpenseDialog({
  open,
  setOpen,
  refetchExpenses,
}: CreateExpenseDialogProps) {

  const [loading, setLoading] =
    useState(false)

  const [categories,
    setCategories] =
    useState<Category[]>([])

  const [formData, setFormData] =
    useState({
      expenseType: "",
      title: "",
      amount: "",
      note: "",
    })

  // fetch categories
  const getCategories =
    async () => {
      try {
        const response =
          await getCategoriesApi()

        setCategories(
          response.data
        )
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(() => {
    if (open) {
      getCategories()
    }
  }, [open])

  // input change
  const handleChange = (
    e:
      React.ChangeEvent<
        HTMLInputElement |
        HTMLSelectElement
      >
  ) => {
    setFormData((prev) => ({
      ...prev,

      [e.target.name]:
        e.target.value,
    }))
  }

  // submit
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault()

      try {
        setLoading(true)

        await createExpenseApi({
          expenseType:
            formData.expenseType,

          title:
            formData.title,

          amount: Number(
            formData.amount
          ),

          note:
            formData.note,
        })

        toast.success(
          "Expense created"
        )

        refetchExpenses()

        setOpen(false)

        // reset
        setFormData({
          expenseType: "",
          title: "",
          amount: "",
          note: "",
        })
      } catch (error) {
        console.log(error)

        toast.error(
          "Failed to create expense"
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
            Add Expense
          </DialogTitle>

          <DialogDescription>
            Create a new expense.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5">

          {/* Category */}
          <div className="space-y-2">

            <Label>
              Category
            </Label>

            <select
              name="expenseType"
              value={
                formData.expenseType
              }
              onChange={
                handleChange
              }
              className="bg-background h-11 w-full rounded-xl border px-3 text-sm outline-none">

              <option value="">
                Select category
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={
                      category._id
                    }
                    value={
                      category._id
                    }>

                    {category.name}

                  </option>
                )
              )}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-2">

            <Label>
              Title
            </Label>

            <Input
              name="title"
              value={
                formData.title
              }
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
              value={
                formData.amount
              }
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
              value={
                formData.note
              }
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
              ? "Creating..."
              : "Create Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}