import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";

function httpError(status, message) {
  return NextResponse.json({ message }, { status });
}

export async function DELETE(request, { params }) {
  const decoded = await requireAuth(request);
  if (decoded instanceof Response) return decoded;

  const { id } = await params;

  if (!id) {
    return httpError(400, "Budget ID is required");
  }

  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", decoded.id);

  if (error) {
    console.error("Delete budget error:", error);
    return httpError(500, "Failed to delete budget");
  }

  return Response.json({ message: "Budget deleted" }, { status: 200 });
}

export async function PUT(request, { params }) {
  const decoded = await requireAuth(request);
  if (decoded instanceof Response) return decoded;

  const { id } = await params;

  if (!id) {
    return httpError(400, "Budget ID is required");
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return httpError(400, "Invalid JSON body");
  }

  const { monthly_limit } = body;

  if (monthly_limit === undefined || monthly_limit === null) {
    return httpError(400, "monthly_limit is required");
  }

  const { data, error } = await supabase
    .from("budgets")
    .update({
      monthly_limit: Number(monthly_limit),
      is_default: false,
    })
    .eq("id", id)
    .eq("user_id", decoded.id)
    .select()
    .single();

  if (error) {
    console.error("Update budget error:", error);
    return httpError(500, "Failed to update budget");
  }

  if (!data) {
    return httpError(404, "Budget not found");
  }

  return Response.json(data, { status: 200 });
}
