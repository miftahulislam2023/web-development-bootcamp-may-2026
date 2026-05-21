export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Mark online
    await prisma.user.update({ where: { id: user.id }, data: { isOnline: true } });

    // Trigger Pusher status
    const { pusherServer } = require("@/lib/pusher");
    await pusherServer.trigger("status_channel", "user:status", { userId: user.id, isOnline: true });

    const token = signToken({ id: user.id, name: user.name, username: user.username, email: user.email });

    const res = NextResponse.json({
      user: { id: user.id, name: user.name, username: user.username, email: user.email, avatar: user.avatar },
      token,
    });
    res.cookies.set("token", token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
