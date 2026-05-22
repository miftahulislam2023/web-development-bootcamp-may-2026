import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";
import { respondRouteError } from "@/lib/httpError";

export async function PUT(request, { params }) {
  try {
    const decoded = requireAuth(request);
    const { id } = await params;
    const { amount, description, category_id, date } = await request.json();

    const { data, error } = await supabase
      .from("expenses")
      .update({
        amount,
        description: description || null,
        category_id: category_id || null,
        date,
      })
      .eq("id", id)
      .eq("user_id", decoded.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return respondRouteError(err, "PUT expense error:");
  }
}

export async function DELETE(request, { params }) {
  try {
    const decoded = requireAuth(request);
    const { id } = await params;

    const { data, error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", decoded.id)
      .select("id");

    if (error) {
      return NextResponse.json(
        { message: "Failed to delete expense" },
        { status: 500 }
      );
    }

    if (!data?.length) {
      return NextResponse.json(
        { message: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return respondRouteError(err, "DELETE expense error:");
  }
}
