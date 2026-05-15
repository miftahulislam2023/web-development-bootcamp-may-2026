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

import { Label } from "@/components/ui/label"

import { createCategoryApi } from "@/services/category.api"

interface CreateCategoryDialogProps {
  open: boolean

  setOpen: (
    open: boolean
  ) => void
}

export default function CreateCategoryDialog({
  open,
  setOpen,
}: CreateCategoryDialogProps) {

  const [loading, setLoading] =
    useState(false)

  const [name, setName] =
    useState("")

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault()

      try {
        setLoading(true)

        await createCategoryApi({
          name,
        })

        toast.success(
          "Category created"
        )

        setName("")

        setOpen(false)
      } catch (error) {
        console.log(error)

        toast.error(
          "Failed to create category"
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
            Create Category
          </DialogTitle>

          <DialogDescription>
            Add a new expense category.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5">

          <div className="space-y-2">

            <Label>
              Category Name
            </Label>

            <Input
              placeholder="e.g Grocery"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full">

            {loading
              ? "Creating..."
              : "Create Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}