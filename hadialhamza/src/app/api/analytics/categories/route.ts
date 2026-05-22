import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import Category from "@/models/Category";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const transactions = await Transaction.find({
      userId: session.user.id,
      date: { $gte: startOfMonth },
      type: "expense"
    }).populate('categoryId');

    const categories = await Category.find({ 
      $or: [{ userId: session.user.id }, { userId: null }] 
    });

    const breakdown = categories.map(cat => {
      const spent = transactions
        .filter(t => t.categoryId && t.categoryId._id.toString() === cat._id.toString())
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category: cat.name,
        spent,
        limit: 1000, // Default mock limit
        color: cat.color,
      };
    }).filter(b => b.spent > 0)
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 4);

    return NextResponse.json(breakdown);
  } catch (error: unknown) {
    console.error("Category Analytics Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
