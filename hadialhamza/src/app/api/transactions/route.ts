import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import * as z from "zod";

const transactionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number(),
  categoryId: z.string().min(1, "Category is required"),
  type: z.enum(["income", "expense"]),
  date: z.string().optional(),
  note: z.string().max(200).optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const categoryId = searchParams.get("categoryId");
    const type = searchParams.get("type");

    await dbConnect();

    const query = {
      userId: session.user.id,
      ...(categoryId && { categoryId }),
      ...(type && { type }),
    };

    const transactions = await Transaction.find(query)
      .populate("categoryId")
      .sort({ date: -1, createdAt: -1 })
      .limit(limit);

    return NextResponse.json(transactions);
  } catch (error: unknown) {
    console.error("Transactions Fetch Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = transactionSchema.parse(body);

    await dbConnect();

    const transaction = await Transaction.create({
      ...validatedData,
      userId: session.user.id,
      date: validatedData.date ? new Date(validatedData.date) : new Date(),
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }
    console.error("Transaction Create Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
