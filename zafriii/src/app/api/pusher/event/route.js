import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { channel, event, data } = await req.json();
    if (!channel || !event) return NextResponse.json({ error: "missing params" }, { status: 400 });

    await pusherServer.trigger(channel, event, data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Pusher Event]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
