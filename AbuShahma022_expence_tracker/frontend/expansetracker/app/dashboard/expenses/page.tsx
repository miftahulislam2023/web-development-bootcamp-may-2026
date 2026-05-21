"use client"
import { toast } from "sonner"
import { useEffect, useState } from "react"

import Link from "next/link"

import ReactPaginate from "react-paginate"

import {
  Plus,
  Search,
  Tags,
} from "lucide-react"

import ExpenseTable from "@/components/dashboard/expense-table"

import { getExpensesApi,deleteExpenseApi } from "@/services/expense.api"
import EditExpenseDialog from "@/components/dashboard/edit-expense-dialog"
import CreateCategoryDialog from "@/components/dashboard/create-category-dialog"
import CreateExpenseDialog from "@/components/dashboard/create-expense-dialog"
import DeleteExpenseDialog from "@/components/dashboard/delete-expense-dialog"
import {
  Expense,
  ExpenseResponse,
} from "@/types/expense.types"

export default function ExpensesPage() {
  const [openEdit, setOpenEdit] =
  useState(false)

const [selectedExpenseId,
  setSelectedExpenseId] =
  useState("")

  const handleEdit = (
  id: string
) => {
  setSelectedExpenseId(id)

  setOpenEdit(true)
}

  const [expenses, setExpenses] =
    useState<Expense[]>([])

  const [loading, setLoading] =
    useState(true)

  const [page, setPage] =
    useState(1)

  const [limit] =
    useState(5)

  const [search, setSearch] =
    useState("")

  const [month, setMonth] =
    useState(
      new Date().getMonth() + 1
    )


    const [openCategory,
  setOpenCategory] =
  useState(false)

  const [openCreate,
  setOpenCreate] =
  useState(false)

  const [openDelete,
  setOpenDelete] =
  useState(false)

const [deleteExpenseId,
  setDeleteExpenseId] =
  useState("")


  //  CURRENT YEAR
  const year =
    new Date().getFullYear()

  const [totalPages, setTotalPages] =
    useState(1)

  const getExpenses =
    async () => {
      try {
        const response:
          ExpenseResponse =
          await getExpensesApi({
            page,
            limit,
            month,
            year,
            search,
          })

        setExpenses(response.data)

        setTotalPages(
          response.totalPages
        )
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    getExpenses()
  }, [
    page,
    month,
    search,
  ])

const handleDelete = (
  id: string
) => {
  setDeleteExpenseId(id)

  setOpenDelete(true)
}




  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading expenses...
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold tracking-tight dark:text-black">
            Expenses
          </h1>

          <p className="mt-2 text-muted-foreground">
            Track and manage all your expenses.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Categories */}
          <button
            onClick={() =>
            setOpenCategory(true)
            }
           className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 cursor-pointer">
            <Tags className="size-4" />

            Categories
          </button>

          {/* Add Expense */}
          <button
           onClick={() =>
            setOpenCreate(true)
            }
          
          className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 cursor-pointer">

            <Plus className="size-4" />

            Add Expense

          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}
        <div className="relative w-full max-w-md">

          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => {
              setSearch(
                e.target.value
              )

              setPage(1)
            }}
            className="bg-card h-12 w-full rounded-2xl border pl-11 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Right Side */}
        <div className="flex flex-wrap items-center gap-4">

          {/* Month */}
          <select
            value={month}
            onChange={(e) => {
              setMonth(
                Number(
                  e.target.value
                )
              )

              setPage(1)
            }}
            className="bg-card h-12 rounded-2xl border px-4 text-sm outline-none">

            {Array.from(
              { length: 12 },
              (_, i) => (
                <option
                  key={i}
                  value={i + 1}>

                  Month {i + 1}

                </option>
              )
            )}
          </select>

          {/* Year */}
          <div className="bg-card flex h-12 items-center rounded-2xl border px-5 text-sm font-medium">

            {year}

          </div>
        </div>
      </div>

      {/* Table */}
      <ExpenseTable
        expenses={expenses}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <EditExpenseDialog
       open={openEdit}
      setOpen={setOpenEdit}
      expenseId={selectedExpenseId}
       refetchExpenses={getExpenses}

       
          />
            <CreateCategoryDialog
          open={openCategory}
          setOpen={setOpenCategory}
            />

            <CreateExpenseDialog
         open={openCreate}
          setOpen={setOpenCreate}
          refetchExpenses={getExpenses}

          
/>


      <DeleteExpenseDialog
  open={openDelete}
  setOpen={setOpenDelete}
  expenseId={deleteExpenseId}
  refetchExpenses={getExpenses}
    />

      {/* Pagination */}
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        previousLabel="Prev"
        pageCount={totalPages}
        forcePage={page - 1}
        onPageChange={(selected) =>
          setPage(
            selected.selected + 1
          )
        }
        containerClassName="flex flex-wrap items-center justify-center gap-2"
        pageClassName="cursor-pointer rounded-xl border px-4 py-2 text-sm transition hover:bg-muted"
        activeClassName="border-primary bg-primary text-white"
        previousClassName="cursor-pointer rounded-xl border px-4 py-2 text-sm transition hover:bg-muted"
        nextClassName="cursor-pointer rounded-xl border px-4 py-2 text-sm transition hover:bg-muted"
      />
    </div>
  )
}