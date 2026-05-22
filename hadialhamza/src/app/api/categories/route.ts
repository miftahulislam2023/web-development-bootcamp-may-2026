import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

const DEFAULT_CATEGORIES = [
  { name: "Food & Drinks", icon: "Utensils", color: "text-orange-500", type: "expense" },
  { name: "Shopping", icon: "ShoppingCart", color: "text-blue-500", type: "expense" },
  { name: "Transport", icon: "Car", color: "text-purple-500", type: "expense" },
  { name: "Utilities", icon: "Zap", color: "text-yellow-500", type: "expense" },
  { name: "Income", icon: "Wallet", color: "text-emerald-500", type: "income" },
  { name: "Health", icon: "HeartPulse", color: "text-rose-500", type: "expense" },
  { name: "Entertainment", icon: "Play", color: "text-indigo-500", type: "expense" },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Ensure system categories exist
    const systemCategoriesCount = await Category.countDocuments({ userId: null });
    if (systemCategoriesCount === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES.map(c => ({ ...c, userId: null })));
    }

    // 2. Fetch both system and user-specific categories
    const categories = await Category.find({
      $or: [{ userId: null }, { userId: session.user.id }],
    }).sort({ name: 1 });

    return NextResponse.json(categories);
  } catch (error: unknown) {
    console.error("Categories Fetch Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, icon, color, type } = await req.json();

    if (!name || !icon || !color || !type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Check for duplicates
    const existing = await Category.findOne({ name, userId: session.user.id });
    if (existing) {
      return NextResponse.json({ message: "Category already exists" }, { status: 400 });
    }

    const category = await Category.create({
      name,
      icon,
      color,
      type,
      userId: session.user.id,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    console.error("Category Create Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
