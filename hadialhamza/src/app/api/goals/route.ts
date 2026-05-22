import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Goal from "@/models/Goal";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const goals = await Goal.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(goals);
  } catch (error) {
    console.error("Goals API Error:", error);
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
    const { title, targetAmount, currentAmount, category, deadline } = body;

    const goal = await Goal.create({
      userId: session.user.id,
      title,
      targetAmount,
      currentAmount: currentAmount || 0,
      category,
      deadline,
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Goal Creation Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
