import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { ICategory } from "@/models/Category";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentTx = await Transaction.find({
      userId: session.user.id,
      date: { $gte: startOfCurrentMonth },
    }).populate('categoryId');

    const prevTx = await Transaction.find({
      userId: session.user.id,
      date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth },
    }).populate('categoryId');

    const insights = [];

    // 1. Spending comparison
    const currentSpent = currentTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const prevSpent = prevTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    if (prevSpent > 0) {
      const diff = ((currentSpent - prevSpent) / prevSpent) * 100;
      if (diff > 5) {
        insights.push({
          type: 'warning',
          text: `You've spent ${Math.abs(diff).toFixed(0)}% more than last month.`,
          icon: 'TrendingUp'
        });
      } else if (diff < -5) {
        insights.push({
          type: 'success',
          text: `Great job! You've spent ${Math.abs(diff).toFixed(0)}% less than last month.`,
          icon: 'TrendingDown'
        });
      }
    }

    // 2. Highest Category
    const categoryTotals: Record<string, number> = {};
    currentTx.filter(t => t.type === 'expense').forEach(t => {
      const catName = (t.categoryId as unknown as ICategory)?.name || 'General';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
    });

    const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    if (highestCategory) {
      insights.push({
        type: 'info',
        text: `Your highest spending category this month is ${highestCategory[0]}.`,
        icon: 'Tag'
      });
    }

    // 3. Savings Insight
    const currentIncome = currentTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const currentSavings = currentIncome - currentSpent;

    if (currentIncome > 0) {
      const savingsRate = (currentSavings / currentIncome) * 100;
      if (savingsRate > 20) {
        insights.push({
          type: 'success',
          text: `Excellent! You've saved ${savingsRate.toFixed(0)}% of your income this month.`,
          icon: 'Wallet'
        });
      } else if (savingsRate < 5 && savingsRate > 0) {
        insights.push({
          type: 'warning',
          text: "Your savings rate is below 5%. Consider reviewing your expenses.",
          icon: 'AlertCircle'
        });
      }
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Insights API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
