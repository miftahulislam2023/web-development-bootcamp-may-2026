import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();

  return NextResponse.json({
    success: true,
    message: "API Working",
  });
}
