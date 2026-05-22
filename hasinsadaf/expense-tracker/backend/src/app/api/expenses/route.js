import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";
import { requireFields } from "@/lib/validate";
import { respondRouteError } from "@/lib/httpError";

export async function GET(request) {
  try {
    const decoded = requireAuth(request);

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", decoded.id)
      .order("date", { ascending: false });

    if (error) {
      return NextResponse.json(
        { message: "Failed to fetch expenses" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    return respondRouteError(err, "GET expenses error:");
  }
}

export async function POST(request) {
  try {
    const decoded = requireAuth(request);
    const body = await request.json();
    const { amount, description, category_id, date } = body;

    const { valid, message } = requireFields(body, ["amount", "date"]);
    if (!valid) return NextResponse.json({ message }, { status: 400 });

    // Check for duplicate expense
    const { data: existing } = await supabase
      .from("expenses")
      .select("id")
      .eq("user_id", decoded.id)
      .eq("amount", amount)
      .eq("description", description || "")
      .eq("date", date)
      .eq("category_id", category_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error: "duplicate",
          message: "An identical expense already exists for this date, amount, category and description."
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          user_id: decoded.id,
          amount,
          description: description || null,
          category_id: category_id || null,
          date,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: "Failed to create expense" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return respondRouteError(err, "POST expenses error:");
  }
}
