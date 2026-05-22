import { NextResponse } from "next/server";
import { resolveCorsAllowOrigin } from "@/lib/corsOrigins";

export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  const allowOrigin = resolveCorsAllowOrigin(origin);

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
