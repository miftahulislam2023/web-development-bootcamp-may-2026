import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";
import { respondRouteError } from "@/lib/httpError";

const DEFAULT_CATEGORIES = [
  { name: "Food", color: "#FF6B6B" },
  { name: "Transport", color: "#4ECDC4" },
  { name: "Housing", color: "#45B7D1" },
  { name: "Health", color: "#FFA07A" },
  { name: "Entertainment", color: "#FFD93D" },
  { name: "Other", color: "#A8E6CF" },
];

export async function GET(request) {
  try {
    const decoded = requireAuth(request);

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", decoded.id);

    if (error) {
      return NextResponse.json(
        { message: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    // If no categories exist, insert defaults
    if (!data || data.length === 0) {
      const defaultCategoriesWithUserId = DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        user_id: decoded.id,
      }));

      const { data: newCategories, error: insertError } = await supabase
        .from("categories")
        .insert(defaultCategoriesWithUserId)
        .select();

      if (insertError) {
        console.error("Failed to insert default categories:", insertError);
        return NextResponse.json(
          { message: "Failed to create default categories" },
          { status: 500 }
        );
      }

      return NextResponse.json(newCategories || []);
    }

    return NextResponse.json(data);
  } catch (err) {
    return respondRouteError(err, "GET categories error:");
  }
}

export async function POST(request) {
  try {
    const decoded = requireAuth(request);
    const { name, color } = await request.json();

    // Validate fields
    if (!name) {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([
        {
          user_id: decoded.id,
          name,
          color: color || "#0088FE",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: "Failed to create category" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return respondRouteError(err, "POST categories error:");
  }
}
