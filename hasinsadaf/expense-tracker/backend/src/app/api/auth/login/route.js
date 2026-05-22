import { NextResponse } from "next/server";
import { createSupabaseAuthClient, supabase } from "@/lib/supabase";
import { signToken } from "@/lib/auth";
import { requireFields } from "@/lib/validate";
import { respondRouteError } from "@/lib/httpError";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;
    const email = body.email?.trim().toLowerCase();

    const { valid, message } = requireFields(body, ["email", "password"]);
    if (!valid) return NextResponse.json({ message }, { status: 400 });

    // Sign in with password
    const authClient = createSupabaseAuthClient();
    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      const isDev = process.env.NODE_ENV !== "production";
      return NextResponse.json(
        {
          message: "Invalid credentials",
          details: isDev ? error?.message : undefined,
          status: isDev ? error?.status : undefined,
        },
        { status: 401 }
      );
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    // Sign JWT
    const token = signToken({ id: data.user.id, email });

    return NextResponse.json(
      {
        token,
        user: {
          id: data.user.id,
          name: profile.name,
          email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return respondRouteError(error, "Login error:");
  }
}
