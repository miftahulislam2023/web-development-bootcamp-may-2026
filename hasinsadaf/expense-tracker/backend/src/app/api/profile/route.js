import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";
import { respondRouteError } from "@/lib/httpError";

export async function GET(request) {
  try {
    const decoded = requireAuth(request);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, created_at, monthly_income")
      .eq("id", decoded.id)
      .single();

    if (error) {
      return NextResponse.json(
        { message: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return respondRouteError(err, "GET profile error:");
  }
}

export async function PUT(request) {
  try {
    const decoded = requireAuth(request);
    const body = await request.json();
    const { name, monthly_income } = body;

    if (name !== undefined && (!name || name.trim() === "")) {
      return NextResponse.json({ message: "Name cannot be empty" }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabase
      .from("profiles")
      .select("name, monthly_income")
      .eq("id", decoded.id)
      .single();

    if (existingError || !existing) {
      return NextResponse.json(
        { message: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        name: name !== undefined ? name.trim() : existing.name,
        monthly_income: monthly_income !== undefined
          ? Number(monthly_income)
          : existing.monthly_income,
      })
      .eq("id", decoded.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return respondRouteError(err, "PUT profile error:");
  }
}
