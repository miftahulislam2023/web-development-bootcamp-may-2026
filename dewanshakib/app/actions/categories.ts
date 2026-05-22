"use server";

import { auth } from "@/lib/auth";
import { createCategorySchema, CreateCategoryInput } from "@/lib/schema";
import { ICategoryActionResult } from "@/interfaces/interfaces";
import prisma from "@/prisma/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(
  formData: FormData,
): Promise<ICategoryActionResult> {
  const payload = {
    name: formData.get("name") as string,
    type: formData.get("type") as string,
  };

  const parsed = createCategorySchema.safeParse(payload);

  if (!parsed.success) {
    return { status: "error", message: "Invalid payload" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { status: "error", message: "Unauthorized" };
  }

  try {
    await prisma.category.create({
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        userId: session.user.id,
      },
    });
  } catch {
    return { status: "error", message: "Category already exists" };
  }

  revalidatePath("/dashboard/categories");
  return { status: "success", message: "Category created" };
}

export async function updateCategoryAction(
  formData: FormData,
): Promise<ICategoryActionResult> {
  const payload = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    type: formData.get("type") as CreateCategoryInput["type"],
  };

  if (!payload.id) {
    return { status: "error", message: "Invalid category id" };
  }

  const parsed = createCategorySchema.safeParse(payload);

  if (!parsed.success) {
    return { status: "error", message: "Invalid payload" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { status: "error", message: "Unauthorized" };
  }

  try {
    const result = await prisma.category.updateMany({
      where: {
        id: payload.id,
        userId: session.user.id,
      },
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
      },
    });

    if (result.count === 0) {
      return { status: "error", message: "Category not found" };
    }
  } catch {
    return { status: "error", message: "Category already exists" };
  }

  revalidatePath("/dashboard/categories");
  return { status: "success", message: "Category updated" };
}

export async function deleteCategoryAction(
  formData: FormData,
): Promise<ICategoryActionResult> {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return { status: "error", message: "Invalid category id" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { status: "error", message: "Unauthorized" };
  }

  const result = await prisma.category.deleteMany({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (result.count === 0) {
    return { status: "error", message: "Category not found" };
  }

  revalidatePath("/dashboard/categories");
  return { status: "success", message: "Category deleted" };
}

export async function getCategories(
  userId: string,
  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * limit;

  const categories = await prisma.category.findMany({
    where: { userId },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
  });

  const total = categories.length + 1;

  return {
    categories,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}
