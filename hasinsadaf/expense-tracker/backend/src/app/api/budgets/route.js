import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";
import { requireFields } from "@/lib/validate";
import { respondRouteError } from "@/lib/httpError";

export async function GET(request) {
  try {
    const decoded = requireAuth(request);
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, color")
      .eq("user_id", decoded.id);

    const { data: existingBudgets } = await supabase
      .from("budgets")
      .select("*, categories(id, name, color)")
      .eq("user_id", decoded.id)
      .eq("month", currentMonth);

    const budgetedCategoryIds = (existingBudgets || []).map((b) => b.category_id);
    const missingCategories = (categories || []).filter(
      (c) => !budgetedCategoryIds.includes(c.id)
    );

    if (missingCategories.length > 0) {
      const defaults = missingCategories.map((c) => ({
        user_id: decoded.id,
        category_id: c.id,
        monthly_limit: 5000,
        month: currentMonth,
        is_default: true,
      }));

      await supabase.from("budgets").insert(defaults);
    }

    const { data: allBudgets, error } = await supabase
      .from("budgets")
      .select("*, categories(id, name, color)")
      .eq("user_id", decoded.id)
      .order("month", { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: "Failed to fetch budgets" },
        { status: 500 }
      );
    }

    return NextResponse.json(allBudgets || []);
  } catch (err) {
    console.error("GET budgets error:", err);
    return respondRouteError(err, "GET budgets error:");
  }
}

export async function POST(request) {
  try {
    const decoded = requireAuth(request);
    const body = await request.json();
    const { category_id, monthly_limit, month } = body;

    const { valid, message } = requireFields(body, ["category_id", "monthly_limit", "month"]);
    if (!valid) return NextResponse.json({ message }, { status: 400 });

    // Upsert budget
    const { data, error } = await supabase
      .from("budgets")
      .upsert(
        {
          user_id: decoded.id,
          category_id,
          monthly_limit,
          month,
        },
        {
          onConflict: "user_id,category_id,month",
        }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: "Failed to create or update budget" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return respondRouteError(err, "POST budgets error:");
  }
}
