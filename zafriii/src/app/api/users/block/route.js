export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const blocks = await prisma.block.findMany({
      where: { blockerId: payload.id },
      select: { blockedId: true },
    });

    return NextResponse.json({ blockedIds: blocks.map((b) => b.blockedId) });
  } catch (err) {
    console.error("[GET block]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = await req.json();
    if (!userId || userId === payload.id) return NextResponse.json({ error: "Invalid" }, { status: 400 });

    // Use findFirst + create to avoid composite key upsert issues
    const existing = await prisma.block.findFirst({
      where: { blockerId: payload.id, blockedId: userId },
    });
    if (!existing) {
      await prisma.block.create({
        data: { blockerId: payload.id, blockedId: userId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST block]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "Invalid" }, { status: 400 });

    await prisma.block.deleteMany({
      where: { blockerId: payload.id, blockedId: userId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE block]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
