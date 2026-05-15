"use client"

import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { deleteExpenseApi } from "@/services/expense.api"

interface DeleteExpenseDialogProps {
  open: boolean

  setOpen: (
    open: boolean
  ) => void

  expenseId: string

  refetchExpenses: () => void
}

export default function DeleteExpenseDialog({
  open,
  setOpen,
  expenseId,
  refetchExpenses,
}: DeleteExpenseDialogProps) {

  const handleDelete =
    async () => {
      try {
        await deleteExpenseApi(
          expenseId
        )

        toast.success(
          "Expense deleted"
        )

        refetchExpenses()

        setOpen(false)
      } catch (error) {
        console.log(error)

        toast.error(
          "Failed to delete expense"
        )
      }
    }

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}>

      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            Delete Expense?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone.
            This expense will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 text-white hover:bg-red-600">

            Delete

          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}