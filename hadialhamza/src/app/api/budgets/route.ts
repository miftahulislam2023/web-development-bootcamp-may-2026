import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Budget from "@/models/Budget";
import Transaction from "@/models/Transaction";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || new Date().getMonth().toString());
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());

    // 1. Get Budget
    const budget = await Budget.findOne({
      userId: session.user.id,
      month,
      year,
    });

    // 2. Get Spending for this month
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      userId: session.user.id,
      type: "expense",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      budget: budget?.amount || 0,
      totalSpent,
      month,
      year,
    });
  } catch (error) {
    console.error("Budget API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();
    const { amount, month, year } = body;

    const budget = await Budget.findOneAndUpdate(
      { userId: session.user.id, month, year },
      { amount },
      { upsert: true, new: true }
    );

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Budget Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
