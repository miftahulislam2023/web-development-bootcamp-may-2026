import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { signToken } from "@/lib/auth";
import { requireFields } from "@/lib/validate";
import { respondRouteError } from "@/lib/httpError";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, password } = body;
    const email = body.email?.trim().toLowerCase();

    const { valid, message } = requireFields(body, ["name", "email", "password"]);
    if (!valid) return NextResponse.json({ message }, { status: 400 });

    // Create user in Supabase Auth
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      // Check if it's a duplicate user error
      if (authError.message?.includes("already exists")) {
        return NextResponse.json(
          { message: "An account with this email already exists." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { message: authError.message || "Registration failed" },
        { status: 400 }
      );
    }

    const userId = authUser.user.id;

    // Insert profile with email
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: userId, name, email }]);

    if (profileError) {
      // Try to delete the user since profile creation failed
      try {
        await supabase.auth.admin.deleteUser(userId);
      } catch (deleteError) {
        console.error("Failed to delete user after profile creation failed:", deleteError);
      }
      return NextResponse.json(
        { message: "Failed to create profile: " + profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Registration successful",
        email: email
      },
      { status: 200 }
    );
  } catch (error) {
    return respondRouteError(error, "Register error:");
  }
}
