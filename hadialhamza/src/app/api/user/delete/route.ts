import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Budget from "@/models/Budget";
import Goal from "@/models/Goal";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = session.user.id;

    // Delete all user related data to prevent orphans
    await Transaction.deleteMany({ userId });
    
    // Some models might be optional, so use deleteMany safely
    try {
      if (Budget) await Budget.deleteMany({ userId });
    } catch {}
    try {
      if (Goal) await Goal.deleteMany({ userId });
    } catch {}

    // Finally delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Account deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete account" },
      { status: 500 },
    );
  }
}
