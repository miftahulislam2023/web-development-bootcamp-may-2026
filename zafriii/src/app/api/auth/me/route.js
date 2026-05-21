export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, username: true, email: true, avatar: true, isOnline: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[auth/me]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
