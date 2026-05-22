import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";
import { respondRouteError } from "@/lib/httpError";

export async function PUT(request) {
  try {
    const user = requireAuth(request);
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    // Update profile name
    const { error } = await supabase
      .from("profiles")
      .update({ name: name.trim() })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ message: "Failed to update name" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Name updated successfully", name: name.trim() },
      { status: 200 }
    );
  } catch (error) {
    return respondRouteError(error, "Update name error:");
  }
}
