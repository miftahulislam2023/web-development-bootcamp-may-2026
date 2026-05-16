import { NextResponse } from "next/server";
import { submitContactForm } from "@/actions/forms";

export async function POST(request) {
  try {
    const body = await request.json();
    const { subdomain, fields, honeypot } = body;
    if (!subdomain || !fields) {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const res = await submitContactForm({
      subdomain,
      data: { ...fields, _ip: ip },
      honeypot: honeypot || "",
    });

    if (!res.ok) {
      return NextResponse.json(res, { status: 400 });
    }
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e.message || "Server error" },
      { status: 500 },
    );
  }
}
