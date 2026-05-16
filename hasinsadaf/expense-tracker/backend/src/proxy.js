import { NextResponse } from "next/server";
import { resolveCorsAllowOrigin } from "@/lib/corsOrigins";

function setCorsHeaders(response, request) {
  const origin = request.headers.get("origin");
  const allowOrigin = resolveCorsAllowOrigin(origin);

  response.headers.set("Access-Control-Allow-Origin", allowOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

export function proxy(request) {
  if (request.method !== "OPTIONS") {
    return setCorsHeaders(NextResponse.next(), request);
  }

  return setCorsHeaders(new NextResponse(null, { status: 204 }), request);
}

export const config = {
  matcher: "/api/:path*",
};
