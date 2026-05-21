import {
  Pencil,
  Trash2,
} from "lucide-react"

import { Expense }
from "@/types/expense.types"

interface ExpenseTableProps {
  expenses: Expense[]

  onDelete: (
    id: string
  ) => void

  onEdit: (
    id: string
  ) => void
}

export default function ExpenseTable({
  expenses,
  onDelete,
  onEdit,
}: ExpenseTableProps) {

  return (
    <div className="bg-card overflow-hidden rounded-3xl border shadow-sm">

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block">

        <table className="w-full min-w-[900px]">

          <thead className="bg-muted/50">

            <tr className="border-b">

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Title
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Category
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Date
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Note
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {expenses.map((expense) => (

              <tr
                key={expense._id}
                className="border-b transition hover:bg-muted/30 last:border-none">

                <td className="px-6 py-4 font-medium">
                  {expense.title}
                </td>

                <td className="px-6 py-4 capitalize text-muted-foreground">
                  {expense.expenseType.name}
                </td>

                <td className="px-6 py-4 font-semibold text-red-500">
                  ${expense.amount}
                </td>

                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(
                    expense.expenseDate
                  ).toLocaleDateString()}
                </td>

                <td className="max-w-[220px] truncate px-6 py-4 text-muted-foreground">
                  {expense.note}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">

                  <div className="flex items-center gap-2">

                    <button
                      onClick={() =>
                        onEdit(
                          expense._id
                        )
                      }
                      className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm transition hover:bg-muted cursor-pointer">

                      <Pencil className="size-4" />

                      Edit
                    </button>

                    <button
                      onClick={() =>
                        onDelete(
                          expense._id
                        )
                      }
                      className="flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer">

                      <Trash2 className="size-4" />

                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 p-4 lg:hidden">

        {expenses.map((expense) => (

          <div
            key={expense._id}
            className="rounded-2xl border p-4 shadow-sm">

            <div className="flex items-start justify-between gap-3">

              <div>

                <h3 className="font-semibold">
                  {expense.title}
                </h3>

                <p className="mt-1 text-sm capitalize text-muted-foreground">
                  {expense.expenseType.name}
                </p>
              </div>

              <p className="font-semibold text-red-500">
                ${expense.amount}
              </p>
            </div>

            <div className="mt-4 space-y-2 text-sm">

              <p className="text-muted-foreground">

                <span className="font-medium text-foreground">
                  Date:
                </span>{" "}

                {new Date(
                  expense.expenseDate
                ).toLocaleDateString()}
              </p>

              <p className="break-words text-muted-foreground">

                <span className="font-medium text-foreground">
                  Note:
                </span>{" "}

                {expense.note}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2">

              <button
                onClick={() =>
                  onEdit(
                    expense._id
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm transition hover:bg-muted">

                <Pencil className="size-4" />

                Edit
              </button>

              <button
                onClick={() =>
                  onDelete(
                    expense._id
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30">

                <Trash2 className="size-4" />

                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {expenses.length === 0 && (

          <div className="flex h-52 flex-col items-center justify-center">

            <h3 className="text-lg font-semibold">
              No expenses found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Start by adding your first expense.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}