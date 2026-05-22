"use server";

import { auth } from "@/lib/auth";
import { createTransactionSchema, CreateTransactionInput } from "@/lib/schema";
import {
  ICreateTransactionActionResult,
  IDeleteTransactionActionResult,
} from "@/interfaces/interfaces";
import prisma from "@/prisma/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createTransactionAction(
  formData: FormData,
): Promise<ICreateTransactionActionResult> {
  const payload: Partial<CreateTransactionInput> = {
    amount: formData.get("amount") as unknown as CreateTransactionInput["amount"],
    description: (formData.get("description") as string | null) ?? undefined,
    category_name: formData.get("category_name") as string,
    type: formData.get("type") as CreateTransactionInput["type"],
    date: formData.get("date") as unknown as CreateTransactionInput["date"],
  };

  if (payload.description === "") {
    payload.description = undefined;
  }

  const parsed = createTransactionSchema.safeParse(payload);

  if (!parsed.success) {
    return { status: "error", message: "Invalid payload" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { status: "error", message: "Unauthorized" };
  }

  const { amount, description, category_name, type, date } =
    parsed.data;

  const transactionDate = new Date(date);
  const day = transactionDate.getDate();
  const month = transactionDate.getMonth() + 1;
  const year = transactionDate.getFullYear();

  await prisma.$transaction([
    prisma.transactions.create({
      data: {
        amount,
        description,
        category_name,
        type,
        userId: session.user.id,
        created_at: transactionDate,
      },
    }),
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          day,
          month,
          year,
          userId: session.user.id,
        },
      },
      update:
        type === "income"
          ? { income: { increment: amount } }
          : { expense: { increment: amount } },
      create: {
        day,
        month,
        year,
        userId: session.user.id,
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
      },
    }),
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          month,
          year,
          userId: session.user.id,
        },
      },
      update:
        type === "income"
          ? { income: { increment: amount } }
          : { expense: { increment: amount } },
      create: {
        month,
        year,
        userId: session.user.id,
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
      },
    }),
  ]);

  revalidatePath("/dashboard");
  return { status: "success", message: "Transaction created" };
}

export async function deleteTransactionAction(
  formData: FormData,
): Promise<IDeleteTransactionActionResult> {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return { status: "error", message: "Invalid transaction id" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { status: "error", message: "Unauthorized" };
  }

  const result = await prisma.transactions.deleteMany({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (result.count === 0) {
    return { status: "error", message: "Transaction not found" };
  }

  revalidatePath("/dashboard/transactions");
  return { status: "success", message: "Transaction deleted" };
}
